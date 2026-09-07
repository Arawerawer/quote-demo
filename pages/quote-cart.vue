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

const removeConfirmed = () => {
  if (pendingRemoveId.value === null) {
    return
  }

  removeItem(pendingRemoveId.value)
  pendingRemoveId.value = null
}
</script>

<template>
  <div class="mx-auto w-[min(100%,1180px)] p-6 max-md:p-4">
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
</template>
