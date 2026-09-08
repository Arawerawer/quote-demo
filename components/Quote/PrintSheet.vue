<script setup lang="ts">
import type { QuoteCartItem } from '~/composables/useQuoteCart'
import type { QuoteContact } from '~/composables/useQuoteContact'

// 詢價單的列印專用版面。平常整個 hidden，只在 @media print 出現
//（class 與分頁規則見 assets/styles/main.css 最後的 @media print 區塊）。
//
// 版面刻意跟螢幕不一樣：螢幕的三個區塊是為了「編輯」排的，
// 這裡是給老闆「讀」的，所以改成一項一頁、每頁自成一份完整的加工單——
// 老闆可以把某一頁撕下來給師傅，不必附別頁。
const props = defineProps<{
  items: QuoteCartItem[]
  contact: QuoteContact
  /** 由呼叫端產生後傳入，整份 PDF 共用同一個單號 */
  orderNo: string
  /** 送貨地點的組合字串，沿用 useQuoteContact 的 shippingText */
  shippingText: string
}>()

// 只有一項時不印封面：總表只有一列，跟後面那一頁講的是同一件事
const hasCover = computed(() => props.items.length > 1)

// 內容頁的頁碼要把封面算進去，客戶看到的「第 n / N 頁」才跟實際張數一致
const totalPages = computed(() => props.items.length + (hasCover.value ? 1 : 0))

const pageNoOf = (index: number) => index + (hasCover.value ? 2 : 1)

const printDate = computed(() => {
  const now = new Date()

  // 本地時間自己拼，不要用 toISOString()——那是 UTC，會整天偏掉
  return `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`
})

// 聯絡資訊每頁都印一次，所以組成資料再 v-for，不要把同一段 template 複製兩份
const contactRows = computed(() => [
  { label: '聯絡人', value: props.contact.name },
  { label: '聯絡電話', value: props.contact.phone },
  { label: '公司名稱', value: props.contact.company },
  { label: '公司統編', value: props.contact.taxId },
  { label: '電子郵件', value: props.contact.email },
  { label: '希望交期', value: props.contact.deliveryDate },
  { label: '送貨地點', value: props.shippingText },
])

// 沒填的欄位印「—」而不是留白，老闆才分得出「客戶沒填」與「印壞了」
const orDash = (value: string) => value || '—'
</script>

<template>
  <!-- hidden 讓它在螢幕上完全不佔位，.print-only 在 @media print 放出來 -->
  <div class="print-only hidden text-[#001d45]">
    <!-- ── 封面：總表 ── -->
    <section v-if="hasCover" class="print-page">
      <header class="print-block mb-4 border-b-2 border-[#001d45] pb-2">
        <h1 class="m-0 text-2xl font-black">詢價單 {{ orderNo }}</h1>
        <p class="m-0 mt-1 text-xs">
          {{ printDate }}　共 {{ items.length }} 項　第 1 / {{ totalPages }} 頁
        </p>
      </header>

      <section class="print-block mb-5">
        <h2 class="m-0 mb-2 text-base font-bold">詢價清單</h2>
        <table class="w-full border-collapse text-xs">
          <thead>
            <tr class="bg-[#0576f1] text-white">
              <th class="border border-[#c9ccc9] px-2 py-1.5 text-center">#</th>
              <th class="border border-[#c9ccc9] px-2 py-1.5 text-left">
                品項
              </th>
              <th class="border border-[#c9ccc9] px-2 py-1.5 text-left">
                選擇
              </th>
              <th class="border border-[#c9ccc9] px-2 py-1.5 text-left">
                規格
              </th>
              <th class="border border-[#c9ccc9] px-2 py-1.5 text-center">
                數量
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="item.id">
              <td class="border border-[#c9ccc9] px-2 py-1.5 text-center">
                {{ index + 1 }}
              </td>
              <td class="border border-[#c9ccc9] px-2 py-1.5">
                {{ item.category }}
              </td>
              <td class="border border-[#c9ccc9] px-2 py-1.5">
                {{ item.summary }}
              </td>
              <td class="border border-[#c9ccc9] px-2 py-1.5">
                {{ item.detail }}
              </td>
              <td class="border border-[#c9ccc9] px-2 py-1.5 text-center">
                {{ item.quantity }} 支
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="print-block">
        <h2 class="m-0 mb-2 text-base font-bold">交期與聯絡資訊</h2>
        <table class="w-full border-collapse text-xs">
          <tbody>
            <tr v-for="row in contactRows" :key="row.label">
              <th
                class="w-24 border border-[#c9ccc9] bg-[#f2f4f2] px-2 py-1.5 text-left font-bold"
              >
                {{ row.label }}
              </th>
              <td class="border border-[#c9ccc9] px-2 py-1.5">
                {{ orDash(row.value) }}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </section>

    <!-- ── 每項一頁：圖面 → 項目明細 → 交期與聯絡資訊 ── -->
    <section v-for="(item, index) in items" :key="item.id" class="print-page">
      <header class="print-block mb-4 border-b-2 border-[#001d45] pb-2">
        <h1 class="m-0 text-2xl font-black">詢價單 {{ orderNo }}</h1>
        <p class="m-0 mt-1 text-xs">
          {{ printDate }}　第 {{ pageNoOf(index) }} / {{ totalPages }} 頁
        </p>
      </header>

      <h2 class="m-0 mb-2 text-base font-bold">
        項次 {{ index + 1 }} · {{ item.category }}
      </h2>

      <!-- 圖面。svg 內容是本站 template 產生的快照，不是使用者輸入 -->
      <figure
        class="print-block m-0 mb-5 rounded border border-[#c9ccc9] p-3 [&>svg]:h-auto [&>svg]:w-full"
      >
        <div v-if="item.diagramSvg" v-html="item.diagramSvg" />
        <p v-else class="m-0 py-6 text-center text-xs text-[#6c6f6c]">
          此品項無圖面
        </p>
      </figure>

      <!-- 直式排列而非表格：一項只有一列的話，表頭會比內容還長 -->
      <section class="print-block mb-5">
        <h2 class="m-0 mb-2 text-base font-bold">項目明細</h2>
        <table class="w-full border-collapse text-xs">
          <tbody>
            <tr>
              <th
                class="w-24 border border-[#c9ccc9] bg-[#f2f4f2] px-2 py-1.5 text-left font-bold"
              >
                品項
              </th>
              <td class="border border-[#c9ccc9] px-2 py-1.5">
                {{ item.category }}
              </td>
            </tr>
            <tr>
              <th
                class="border border-[#c9ccc9] bg-[#f2f4f2] px-2 py-1.5 text-left font-bold"
              >
                選擇
              </th>
              <td class="border border-[#c9ccc9] px-2 py-1.5">
                {{ item.summary }}
              </td>
            </tr>
            <tr>
              <th
                class="border border-[#c9ccc9] bg-[#f2f4f2] px-2 py-1.5 text-left font-bold"
              >
                規格
              </th>
              <td class="border border-[#c9ccc9] px-2 py-1.5">
                {{ item.detail }}
              </td>
            </tr>
            <tr>
              <th
                class="border border-[#c9ccc9] bg-[#f2f4f2] px-2 py-1.5 text-left font-bold"
              >
                數量
              </th>
              <td class="border border-[#c9ccc9] px-2 py-1.5">
                {{ item.quantity }} 支
              </td>
            </tr>
            <!-- 這兩欄螢幕上的表格刻意不顯示（客戶自己填時就看過了），
                 但 PDF 要印——老闆報價時才看得到客戶的特殊要求，跟 CSV 同理 -->
            <tr>
              <th
                class="border border-[#c9ccc9] bg-[#f2f4f2] px-2 py-1.5 text-left font-bold"
              >
                參考圖檔
              </th>
              <td class="border border-[#c9ccc9] px-2 py-1.5">
                {{ orDash(item.attachmentName) }}
              </td>
            </tr>
            <tr>
              <th
                class="border border-[#c9ccc9] bg-[#f2f4f2] px-2 py-1.5 text-left font-bold"
              >
                備註
              </th>
              <td class="border border-[#c9ccc9] px-2 py-1.5">
                {{ orDash(item.note) }}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- 每頁都重複印：這樣單頁撕下來給師傅時，聯絡人與交期都在同一張紙上 -->
      <section class="print-block">
        <h2 class="m-0 mb-2 text-base font-bold">交期與聯絡資訊</h2>
        <table class="w-full border-collapse text-xs">
          <tbody>
            <tr v-for="row in contactRows" :key="row.label">
              <th
                class="w-24 border border-[#c9ccc9] bg-[#f2f4f2] px-2 py-1.5 text-left font-bold"
              >
                {{ row.label }}
              </th>
              <td class="border border-[#c9ccc9] px-2 py-1.5">
                {{ orDash(row.value) }}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </section>
  </div>
</template>
