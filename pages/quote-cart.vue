<script setup lang="ts">
const {
  items,
  count,
  removeItem,
  clearItems,
  makeOrderNo,
  exportCsv: exportCartCsv,
} = useQuoteCart()

const {
  contact,
  todayIso,
  initDates,
  nameError,
  phoneError,
  emailError,
  taxIdError,
  isContactValid,
  shippingText,
} = useQuoteContact()

onMounted(initDates)

// 一進頁面就滿江紅很難看，按過「確認詢價」之後才開始即時顯示錯誤
const showErrors = ref(false)

// 匯出結果沿用原本的行內訊息，只有送出流程改用 UIAlert
const exportMessage = ref('')

const exportCsv = () => {
  exportMessage.value = exportCartCsv()
}

// 送出前先跳一次確認，避免誤按；空清單則直接跳錯誤提示
const isConfirmOpen = ref(false)
const isEmptyAlertOpen = ref(false)
const isContactAlertOpen = ref(false)
const isSubmittedOpen = ref(false)
const submittedText = ref('')

// 匯出 PDF 走瀏覽器列印：版面在 QuotePrintSheet，分頁規則在 main.css 的 @media print。
// 使用者會看到系統列印視窗，目的地選「另存為 PDF」。
//
// 沒有用 jspdf/html2canvas，因為那會把整頁轉成點陣圖，孔位圖的細線會糊掉。
const printOrderNo = ref('')

// 列印前把列印版面裡的圖等到解碼完。
//
// 這段是必要的，不是保險：nextTick() 只保證 Vue 把 DOM 更新完，不等 <img> 下載；
// 而列印版面平常是 display:none，瀏覽器對隱藏子樹裡的圖會延後甚至不載；
// window.print() 又是同步阻塞的。三件事湊起來就會印出空白的圖框。
// 扁鐵沒踩到是因為 svg 是內嵌標記、沒有網路請求，鋼板彎折的 PNG 有。
//
// 用 decode() 而不是 onload：已載好的圖會立即 resolve，
// 沒載的會等到能無延遲繪製為止，不必自己寫 complete ? ... : addEventListener。
// 任何一張失敗都不擋列印——寧可少一張圖，也不要按了沒反應。
const waitForPrintImages = async () => {
  const images = Array.from(
    document.querySelectorAll<HTMLImageElement>('.print-only img'),
  )

  await Promise.all(
    images.map((image) => image.decode().catch(() => undefined)),
  )
}

const exportPdf = async () => {
  exportMessage.value = ''

  if (!count.value) {
    isEmptyAlertOpen.value = true

    return
  }

  // makeOrderNo() 每次呼叫都會給不同的隨機碼，所以先產生一次存起來，
  // 整份 PDF 的每一頁頁首才會是同一個單號
  printOrderNo.value = makeOrderNo()

  // 等單號渲染進 DOM 再叫列印，否則印出來的頁首是空的
  await nextTick()
  await waitForPrintImages()
  window.print()
}

// 送出前把聯絡人與交期再念一次，讓客戶有機會發現打錯
const confirmText = computed(
  () => `共 ${count.value} 項將送出詢價。
聯絡人 ${contact.value.name}　${contact.value.phone}
希望交期 ${contact.value.deliveryDate}`,
)

const openConfirm = () => {
  exportMessage.value = ''

  if (!count.value) {
    isEmptyAlertOpen.value = true

    return
  }

  showErrors.value = true

  if (!isContactValid.value) {
    isContactAlertOpen.value = true

    return
  }

  isConfirmOpen.value = true
}

const submitQuote = async () => {
  submittedText.value = `詢價單 ${makeOrderNo()} 已送出，共 ${count.value} 項。
希望交期 ${contact.value.deliveryDate}，我們會盡快與您聯繫。`

  // 等確認視窗的關閉動畫跑完再開成功視窗，兩個才不會疊在一起
  await new Promise((resolve) => setTimeout(resolve, 200))
  isSubmittedOpen.value = true
}

// 清空與單筆刪除都先問過再動手，刪掉就救不回來了
const isClearConfirmOpen = ref(false)

const openClearConfirm = () => {
  exportMessage.value = ''

  if (!count.value) {
    return
  }

  isClearConfirmOpen.value = true
}

const clearAll = () => {
  clearItems()
  exportMessage.value = ''
}

const isRemoveConfirmOpen = ref(false)
const pendingRemoveId = ref<number | null>(null)

const pendingRemoveText = computed(() => {
  const target = items.value.find((item) => item.id === pendingRemoveId.value)

  return target
    ? `${target.category}　${target.summary}
${target.detail}　×${target.quantity} 支`
    : ''
})

const openRemoveConfirm = (id: number) => {
  exportMessage.value = ''
  pendingRemoveId.value = id
  isRemoveConfirmOpen.value = true
}

// 圖面放大檢視。縮圖在表格裡只有 120px 寬，標註的數字根本看不清楚，
// 點開才看得到孔位細節
const isDiagramOpen = ref(false)
const diagramItemId = ref<number | null>(null)

const diagramItem = computed(
  () => items.value.find((item) => item.id === diagramItemId.value) ?? null,
)

const openDiagram = (id: number) => {
  diagramItemId.value = id
  isDiagramOpen.value = true
}

const removeConfirmed = () => {
  if (pendingRemoveId.value === null) {
    return
  }

  removeItem(pendingRemoveId.value)
  pendingRemoveId.value = null
}
</script>

<template>
  <!-- screen-only：列印時整個畫面收起來，只留下面的 QuotePrintSheet。
       這裡面的按鈕、輸入框、彈窗都不該出現在 PDF 裡 -->
  <div class="screen-only mx-auto w-[min(100%,1180px)] p-6 max-md:p-4">
    <UIPageHeader
      title="詢價單"
      description="這裡是各品項頁加入的項目，確認無誤後可匯出 Excel 或送出詢價。"
      class="mb-4"
    />

    <div class="grid gap-6">
      <!-- 詢價清單 -->
      <UIPageContent class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h2 class="text-brand-900 m-0 text-xl font-bold">詢價清單</h2>
          <div class="flex flex-wrap gap-2">
            <UIFormButton
              text="匯出 Excel"
              icon="Download"
              @click="exportCsv"
            />
            <UIFormButton text="匯出 PDF" icon="Printer" @click="exportPdf" />
            <UIFormButton
              text="清空"
              icon="Trash2"
              variant="danger"
              appearance="outline"
              @click="openClearConfirm"
            />
          </div>
        </div>

        <UIEmptyState
          v-if="!count"
          title="詢價單目前是空的"
          description="在品項頁選好規格、填完數量後，按「加入詢價」即可加入這裡。"
        />

        <template v-else>
          <UITable>
            <table>
              <thead>
                <tr>
                  <th data-align="center" class="w-1">#</th>
                  <th>品項</th>
                  <th>選擇</th>
                  <th>規格</th>
                  <th data-align="center" class="w-1">圖</th>
                  <th data-align="center" class="w-1">數量</th>
                  <th data-align="center" class="w-1">動作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="item.id">
                  <td data-align="center">{{ index + 1 }}</td>
                  <td>{{ item.category }}</td>
                  <td>{{ item.summary }}</td>
                  <td>{{ item.detail }}</td>
                  <td data-align="center">
                    <!-- 縮圖本身就是按鈕，整張圖都可以點，比另外放一顆
                         「檢視」按鈕好按，也不用多佔一欄寬度。
                         svg 內容是本站 template 產生的，不是使用者輸入 -->
                    <button
                      v-if="item.diagramSvg"
                      type="button"
                      class="border-nurse-200 hover:border-brand-500 block w-[120px] cursor-pointer rounded border bg-white p-1 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
                      :aria-label="`放大檢視 ${item.category} 的圖面`"
                      @click="openDiagram(item.id)"
                      v-html="item.diagramSvg"
                    />
                    <!-- 靜態圖的品項（鋼板彎折）：縮圖只放第一張（彎折後外形）。
                         120px 寬裡塞兩張的話各只剩 55px，看不出差別；
                         點開放大才顯示全部 -->
                    <button
                      v-else-if="item.diagramImages?.length"
                      type="button"
                      class="border-nurse-200 hover:border-brand-500 block w-[120px] cursor-pointer rounded border bg-white p-1"
                      :aria-label="`放大檢視 ${item.category} 的圖面`"
                      @click="openDiagram(item.id)"
                    >
                      <img
                        :src="item.diagramImages[0].src"
                        :alt="`${item.category} ${item.summary} 圖面`"
                        class="block h-16 w-full object-contain"
                      />
                    </button>
                    <span v-else class="text-nurse-500">—</span>
                  </td>
                  <td data-align="center">{{ item.quantity }} 支</td>
                  <td data-align="center">
                    <UIFormButton
                      text="刪除"
                      size="sm"
                      variant="danger"
                      appearance="outline"
                      @click="openRemoveConfirm(item.id)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </UITable>

          <p class="text-nurse-600 m-0 text-sm">目前清單：{{ count }} 項</p>
        </template>

        <p v-if="exportMessage" class="text-brand-700 m-0 text-sm font-bold">
          {{ exportMessage }}
        </p>
      </UIPageContent>

      <!-- 交期與聯絡資訊 -->
      <UIPageContent class="flex flex-col gap-4">
        <div>
          <h2 class="text-brand-900 m-0 text-xl font-bold">交期與聯絡資訊</h2>
          <p class="text-nurse-600 m-0 mt-1 text-sm">
            標示 <span class="text-rose-500">*</span> 為必填，我們才能回覆報價。
          </p>
        </div>

        <UIGrid>
          <UIGridItem sm="12" md="6">
            <UIFormGroup
              label="聯絡人姓名"
              star
              :warning-text="showErrors ? nameError : ''"
            >
              <UIFormInput v-model="contact.name" placeholder="請輸入姓名" />
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem sm="12" md="6">
            <UIFormGroup
              label="聯絡電話"
              star
              :warning-text="showErrors ? phoneError : ''"
            >
              <UIFormInput
                v-model="contact.phone"
                type="tel"
                placeholder="請輸入電話號碼"
              />
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem sm="12" md="6">
            <UIFormGroup label="公司名稱">
              <UIFormInput
                v-model="contact.company"
                placeholder="個人詢價可不填"
              />
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem sm="12" md="6">
            <UIFormGroup
              label="公司統編"
              :warning-text="showErrors ? taxIdError : ''"
            >
              <UIFormInput
                v-model="contact.taxId"
                inputmode="numeric"
                maxlength="8"
                placeholder="個人詢價可不填"
              />
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem sm="12" md="6">
            <UIFormGroup
              label="電子郵件 (Email)"
              :warning-text="showErrors ? emailError : ''"
            >
              <UIFormInput
                v-model="contact.email"
                type="email"
                placeholder="example@company.com"
              />
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem sm="12" md="6">
            <UIFormGroup label="希望交期">
              <UIFormDate v-model="contact.deliveryDate" :min="todayIso" />
            </UIFormGroup>
          </UIGridItem>
        </UIGrid>

        <!-- 送貨地點框起來自成一區：縣市與地址是一組的，
             而且整組都可以不填（自行取貨），跟上面的必填欄位分開比較不會誤會 -->
        <fieldset class="border-nurse-200 m-0 rounded-lg border p-4">
          <legend class="text-brand-800 px-1 text-sm font-bold">
            送貨地點<span class="text-nurse-500 text-xs font-normal">
              （自行取貨可不填）
            </span>
          </legend>

          <UIGrid>
            <UIGridItem sm="12" md="6">
              <UIFormGroup label="縣市">
                <UIFormSelect
                  v-model="contact.shippingCity"
                  :options="TAIWAN_CITIES"
                  placeholder="請選擇縣市"
                />
              </UIFormGroup>
            </UIGridItem>

            <UIGridItem sm="12" md="6">
              <UIFormGroup label="詳細地址">
                <UIFormInput v-model="contact.shippingAddress" />
              </UIFormGroup>
            </UIGridItem>
          </UIGrid>
        </fieldset>
      </UIPageContent>

      <!-- 確認送出 -->
      <UIPageContent class="flex flex-col gap-6">
        <div>
          <h2 class="text-brand-900 m-0 text-xl font-bold">確認詢價</h2>
          <p class="text-nurse-600 m-0 mt-1 text-sm">
            送出後我們會依上方清單與您聯繫報價。
          </p>
        </div>

        <UIFormButton
          class="w-full"
          text="確認詢價"
          icon="Send"
          size="lg"
          @click="openConfirm"
        />
      </UIPageContent>
    </div>

    <!-- 圖面放大檢視 -->
    <UIModal
      v-model="isDiagramOpen"
      :title="diagramItem ? `${diagramItem.category}　圖面` : '圖面'"
      size="xl"
    >
      <div v-if="diagramItem" class="flex flex-col gap-3">
        <p class="text-nurse-600 m-0 text-sm">
          {{ diagramItem.summary }}　{{ diagramItem.detail }}
        </p>
        <div
          v-if="diagramItem.diagramSvg"
          class="border-nurse-200 rounded-lg border bg-white p-4 [&>svg]:h-auto [&>svg]:w-full"
          v-html="diagramItem.diagramSvg"
        />
        <!-- 靜態圖可能有兩張（外形 + 展開／立體示意），並排並各自帶圖說 -->
        <div
          v-else-if="diagramItem.diagramImages?.length"
          class="grid gap-4"
          :class="diagramItem.diagramImages.length > 1 ? 'sm:grid-cols-2' : ''"
        >
          <figure
            v-for="image in diagramItem.diagramImages"
            :key="image.src"
            class="border-nurse-200 m-0 grid place-items-center rounded-lg border bg-white p-4"
          >
            <img
              :src="image.src"
              :alt="`${diagramItem.category} ${image.caption}`"
              class="block h-auto max-h-[60vh] w-auto max-w-full object-contain"
            />
            <figcaption class="text-brand-600 mt-3 text-center text-sm">
              {{ image.caption }}
            </figcaption>
          </figure>
        </div>
        <p class="text-nurse-500 m-0 text-sm">
          此圖為加入詢價單當下的圖面，不會隨後續修改變動。
        </p>
      </div>
    </UIModal>

    <!-- 清空前的確認 -->
    <UIAlert
      v-model="isClearConfirmOpen"
      title="確定清空詢價單？"
      :text="`目前的 ${count} 項會全部移除，這個動作無法復原。`"
      icon="warning"
      confirm-text="確定清空"
      show-cancel-button
      @confirm="clearAll"
    />

    <!-- 單筆刪除前的確認 -->
    <UIAlert
      v-model="isRemoveConfirmOpen"
      title="確定刪除這一筆？"
      :text="pendingRemoveText"
      icon="warning"
      confirm-text="確定刪除"
      show-cancel-button
      @confirm="removeConfirmed"
      @cancel="pendingRemoveId = null"
    />

    <!-- 送出前的二次確認 -->
    <UIAlert
      v-model="isConfirmOpen"
      title="確認送出詢價單？"
      :text="confirmText"
      icon="question"
      confirm-text="確認送出"
      show-cancel-button
      @confirm="submitQuote"
    />

    <!-- 送出成功 -->
    <UIAlert
      v-model="isSubmittedOpen"
      title="詢價單已送出"
      :text="submittedText"
      icon="success"
      confirm-text="知道了"
    />

    <!-- 清單是空的 -->
    <UIAlert
      v-model="isEmptyAlertOpen"
      title="詢價單是空的"
      text="請先從品項頁選好規格、填完數量後加入，再回來送出。"
      icon="warning"
      confirm-text="知道了"
    />

    <!-- 聯絡資訊沒填齊 -->
    <UIAlert
      v-model="isContactAlertOpen"
      title="請補齊聯絡資訊"
      text="聯絡人姓名與聯絡電話為必填，我們才能回覆報價。若有填公司統編與 Email，請確認格式正確。"
      icon="warning"
      confirm-text="知道了"
    />
  </div>

  <!-- 列印專用版面。螢幕上完全不佔位，按下「匯出 PDF」時才由 @media print 放出來 -->
  <QuotePrintSheet
    :items="items"
    :contact="contact"
    :order-no="printOrderNo"
    :shipping-text="shippingText"
  />
</template>
