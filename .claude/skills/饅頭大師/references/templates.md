# 頁面骨架範本

全部驗證自現有頁面，可直接複製後替換內容。

## 共通外層容器（鐵律）

```
mx-auto w-[min(100%,1180px)] p-6 max-md:p-4
```

用 `UIPageFooterButtonBox` 時要留頁尾空間：

```
mx-auto w-[min(100%,1180px)] p-6 pb-28 max-md:p-4 max-md:pb-32
```

`ShowcasePage` 已內建這串，用它就不要再包一層。

---

## 1. 列表頁

來源：`pages/example/list-table.vue`

結構順序：`UIPageHeader` → `UIPageContent`（內含統計列、篩選區、表格）→ `UITablePagination`（**在 Content 外面**）

```vue
<script setup lang="ts">
const pageSize = ref(10)
const currentPage = ref(1)
const filterExpanded = ref(true)
const keyword = ref('')

// 假資料
const quotes = [
  {
    id: 'QT-2026-001',
    customer: '宏達電子',
    amount: 128000,
    date: '2026-08-12',
    status: '已核准',
  },
  {
    id: 'QT-2026-002',
    customer: '長興材料',
    amount: 45600,
    date: '2026-08-15',
    status: '待審核',
  },
]
</script>

<template>
  <div class="mx-auto w-[min(100%,1180px)] p-6 max-md:p-4">
    <UIPageHeader
      title="報價單列表"
      description="檢視與管理所有報價單。"
      class="mb-4"
    >
      <!-- 動作按鈕放 default slot，不要用 #actions -->
      <UIFormButtonGroup :sm="0" :md="2">
        <UIFormButton text="新增" icon="Plus" variant="warning" />
        <UIFormButton text="匯出" icon="Download" variant="secondary" />
      </UIFormButtonGroup>
    </UIPageHeader>

    <UIPageContent class="flex flex-col">
      <div class="mb-4 flex justify-between">
        <UITablePaginationInfo
          v-model="pageSize"
          :current-page="currentPage"
          :total-pages="12"
          :total-items="123"
        />

        <div class="flex max-w-100 gap-2">
          <UIFormInput v-model="keyword" placeholder="請輸入關鍵字" />
          <UIFormButton icon="Search" icon-only aria-label="搜尋" />
          <UIFormButton
            icon="Filter"
            icon-only
            variant="secondary"
            aria-label="篩選"
            :aria-expanded="filterExpanded"
            @click="filterExpanded = !filterExpanded"
          />
        </div>
      </div>

      <UITableFilter v-model="filterExpanded">
        <div class="grid grid-cols-3 gap-3">
          <UIFormGroup label="客戶名稱" row>
            <UIFormInput placeholder="請輸入客戶名稱" />
          </UIFormGroup>

          <UIFormGroup label="狀態" row>
            <UIFormSelect
              :options="[
                { value: 'approved', label: '已核准' },
                { value: 'pending', label: '待審核' },
              ]"
            />
          </UIFormGroup>

          <div class="flex justify-end">
            <UIFormButton text="搜尋" class="w-fit" />
          </div>
        </div>
      </UITableFilter>

      <!-- UITable 內放原生 table，不是 props 驅動 -->
      <UITable>
        <table>
          <thead>
            <tr>
              <th>報價單號</th>
              <th>客戶名稱</th>
              <th data-align="right">金額</th>
              <th>報價日期</th>
              <th data-align="center">狀態</th>
              <th data-align="center" class="w-1">動作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="quote in quotes" :key="quote.id">
              <td>{{ quote.id }}</td>
              <td>{{ quote.customer }}</td>
              <td data-align="right">
                NT$ {{ quote.amount.toLocaleString() }}
              </td>
              <td>{{ quote.date }}</td>
              <td data-align="center">{{ quote.status }}</td>
              <td data-align="center" class="flex justify-center gap-1">
                <UIFormButton text="檢視" size="sm" />
                <UIFormButton text="刪除" size="sm" variant="danger" />
              </td>
            </tr>
          </tbody>
        </table>
      </UITable>
    </UIPageContent>

    <UITablePagination
      v-model="currentPage"
      :total-pages="12"
      class="m-auto mt-5 w-fit"
    />
  </div>
</template>
```

要點：

- `<th>` / `<td>` 對齊用 `data-align="center"` / `data-align="right"`
- 操作欄加 `class="w-1"` 讓它縮到最窄
- `UIFormButtonGroup` 的 `:sm="0" :md="2"` = 手機全收進更多選單、桌面顯示 2 顆
- 狀態欄若要色票，見「狀態標籤」一節

---

## 2. 表單頁

來源：`pages/example/form.vue`

結構順序：`UIPageHeader` → `<form>` 包 `UIPageContent` → `UIGrid` + `UIGridItem` → 每欄 `UIFormGroup` 包控制項 → `UIPageFooterButtonBox`

```vue
<script setup lang="ts">
const customer = ref('')
const quoteDate = ref('')
const amount = ref<number | undefined>(undefined)
const note = ref('')
const isDraft = ref(false)

const customerOptions = [
  { label: '宏達電子', value: 'htc' },
  { label: '長興材料', value: 'eternal' },
]

const save = () => {
  // 送出處理
}

const goBack = () => navigateTo('/example/quote-list')
</script>

<template>
  <div class="mx-auto w-[min(100%,1180px)] p-6 pb-28 max-md:p-4 max-md:pb-32">
    <UIPageHeader
      title="新增報價單"
      description="填寫報價單基本資料與明細。"
      class="mb-4"
    />

    <form @submit.prevent="save">
      <UIPageContent class="flex flex-col gap-6">
        <UIGrid>
          <UIGridItem sm="12" md="6">
            <UIFormGroup label="客戶名稱" star>
              <UIFormSelect
                v-model="customer"
                :options="customerOptions"
                required
              />
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem sm="12" md="6">
            <UIFormGroup label="報價日期" star>
              <UIFormDate v-model="quoteDate" required />
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem sm="12" md="6">
            <UIFormGroup label="金額" star>
              <UIFormInputUnit
                v-model="amount"
                type="number"
                prefix="NT$"
                placeholder="0"
                required
              />
            </UIFormGroup>
          </UIGridItem>

          <!-- 不給尺寸 = 整行佔滿 -->
          <UIGridItem>
            <UIFormGroup label="備註">
              <UIFormTextarea
                v-model="note"
                :rows="5"
                placeholder="請輸入備註"
              />
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem>
            <UIFormGroup label="選項">
              <div class="flex flex-col gap-3 py-2">
                <UIFormCheckbox v-model="isDraft" label="儲存為草稿" />
              </div>
            </UIFormGroup>
          </UIGridItem>
        </UIGrid>
      </UIPageContent>

      <UIPageFooterButtonBox>
        <UIButtonPageBottom variant="secondary" type="button" @click="goBack">
          返回
        </UIButtonPageBottom>
        <UIButtonPageBottom type="submit">儲存</UIButtonPageBottom>
      </UIPageFooterButtonBox>
    </form>
  </div>
</template>
```

**錯誤狀態**（`UIFormGroup` 和內層控制項都要加 `warning`）：

```vue
<UIFormGroup label="客戶名稱" star warning warning-text="請選擇客戶。">
  <UIFormSelect :options="customerOptions" warning placeholder="請選擇客戶" />
</UIFormGroup>
```

**輸入框 + 按鈕並排**（用 `.inline-field` 這個既有 CSS class）：

```vue
<UIFormGroup label="選擇項目" star>
  <div class="inline-field">
    <UIFormInput
      class="min-w-0 flex-1"
      :model-value="selectedSummary"
      placeholder="請選擇項目"
      readonly
      required
    />
    <UIFormButton type="button" variant="secondary" @click="isModalOpen = true">
      選擇
    </UIFormButton>
  </div>
</UIFormGroup>
```

**搭配 Modal 選擇**：

```vue
<UIModal v-model="isModalOpen" title="選擇項目" size="sm">
  <div class="flex flex-col gap-4 py-2">
    <UIFormCheckbox
      v-for="option in options"
      :key="option.value"
      v-model="selectedMap[option.value]"
      :label="option.label"
    />
  </div>
  <template #footer>
    <UIFormButton variant="outline" @click="isModalOpen = false">取消</UIFormButton>
    <UIFormButton @click="isModalOpen = false">確認</UIFormButton>
  </template>
</UIModal>
```

---

## 3. 詳情頁

沒有現成範例頁，以下依 `UIFieldGroup` / `UIField` 的實作組成。

`UIField` **必須**放在 `UIFieldGroup` 內（後者提供 grid 與邊框）。`UIField` 的標題欄固定 `max-w-[14ch]`。

```vue
<script setup lang="ts">
const quote = {
  id: 'QT-2026-001',
  customer: '宏達電子',
  contact: '陳先生',
  phone: '02-2345-6789',
  amount: 128000,
  date: '2026-08-12',
  validUntil: '2026-09-12',
  note: '含稅價，運費另計。',
}
</script>

<template>
  <div class="mx-auto w-[min(100%,1180px)] p-6 max-md:p-4">
    <UIPageHeader
      title="報價單明細"
      :description="`報價單號 ${quote.id}`"
      class="mb-4"
    >
      <UIFormButtonGroup :sm="0" :md="2">
        <UIFormButton text="編輯" icon="Pencil" />
        <UIFormButton text="列印" icon="Printer" variant="secondary" />
      </UIFormButtonGroup>
    </UIPageHeader>

    <UIPageContent class="flex flex-col gap-6">
      <UIFieldGroup :col="2">
        <UIField title="報價單號">{{ quote.id }}</UIField>
        <UIField title="報價日期">{{ quote.date }}</UIField>
        <UIField title="客戶名稱">{{ quote.customer }}</UIField>
        <UIField title="聯絡人">{{ quote.contact }}</UIField>
        <UIField title="聯絡電話">{{ quote.phone }}</UIField>
        <UIField title="有效期限">{{ quote.validUntil }}</UIField>

        <!-- sm="2" 讓這欄跨滿兩欄 -->
        <UIField title="金額" sm="2">
          <span class="font-bold">NT$ {{ quote.amount.toLocaleString() }}</span>
        </UIField>
        <UIField title="備註" sm="2">{{ quote.note }}</UIField>
      </UIFieldGroup>
    </UIPageContent>
  </div>
</template>
```

`UIFieldGroup` 的 `col` 是欄數（1–12）。`UIField` 的 `sm`/`md`/`lg`/`xl` 是該欄跨幾格；不給就佔滿整行。

輕量替代方案（不要框線時）用 `UITextItem`：

```vue
<div class="flex flex-col gap-3">
  <UITextItem title="客戶名稱" content="宏達電子" />
  <UITextItem title="金額" content="NT$ 128,000" content-strong />
</div>
```

---

## 4. 流程頁

`UIPageProgressSteps` **只支援三步驟**，文案寫死為「選擇項目／填寫資料／確認內容」。

```vue
<script setup lang="ts">
const currentStep = ref<1 | 2 | 3>(1)
const selected = ref('')

const services = [
  {
    key: 'basic',
    title: '基礎方案',
    description: '適合小型專案',
    price: 'NT$ 12,000',
  },
  {
    key: 'pro',
    title: '進階方案',
    description: '含後續維護',
    price: 'NT$ 28,000',
  },
]

const goNext = () => {
  if (currentStep.value < 3) currentStep.value += 1
}
</script>

<template>
  <div class="mx-auto w-[min(100%,1180px)] p-6 max-md:p-4">
    <UIPageHeader title="建立報價" class="mb-4" />

    <UIPageScreenBody>
      <UIPageProgressSteps :current="currentStep" />

      <div class="mt-6 flex flex-col gap-3">
        <UISelectableCard
          v-for="service in services"
          :key="service.key"
          :title="service.title"
          :description="service.description"
          :price="service.price"
          :selected="selected === service.key"
          @select="selected = service.key"
        />
      </div>

      <template #footer>
        <UIPageFooterButtonBox>
          <UIButtonPageBottom variant="secondary" @click="currentStep = 1">
            上一步
          </UIButtonPageBottom>
          <UIButtonPageBottom @click="goNext">下一步</UIButtonPageBottom>
        </UIPageFooterButtonBox>
      </template>
    </UIPageScreenBody>
  </div>
</template>
```

完成頁用 `UITextStatus`：

```vue
<UITextStatus
  title="報價單已送出"
  message="我們會在 3 個工作天內與您聯繫。\n報價單號：QT-2026-001"
/>
```

---

## 5. 全螢幕頁

來源：`pages/login.vue`

三個要件：`definePageMeta` 關掉框架、自寫 `<main>`（因為 app.vue 的 `<main>` 此時不存在）、自己給背景。

```vue
<script setup lang="ts">
definePageMeta({
  hideAppNavigation: true,
})

const account = ref('')
const password = ref('')

const handleLogin = () => navigateTo('/')
</script>

<template>
  <main
    class="flex min-h-dvh items-center justify-center bg-[linear-gradient(135deg,#edf5f1_0%,#e3e7e4_52%,#dae7ef_100%)] px-5 py-8"
  >
    <section class="w-full max-w-100" aria-label="登入">
      <div class="mb-10 flex justify-center">
        <UIPageLogo tone="dark" />
      </div>

      <form class="space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-5">
          <label class="block space-y-2" for="account">
            <span class="text-brand-800 block text-sm font-bold">帳號</span>
            <UIFormInput
              id="account"
              v-model="account"
              placeholder="請輸入帳號"
              autocomplete="username"
              required
              class="w-full"
            />
          </label>
        </div>

        <UIFormButton class="w-full" text="登入" type="submit" size="lg" />
      </form>
    </section>
  </main>
</template>
```

全螢幕頁不用 1180px 容器、不用 `UIPageHeader`（沒有麵包屑意義），改用 `space-y-*` 做垂直節奏。

---

## 6. 展示頁（`/UI/*` 專用）

只有新增元件展示時才用。`ShowcasePage` 已內建外層容器與 `UIPageHeader`。

```vue
<template>
  <ShowcasePage
    title="網格"
    description="使用 UIGrid 與 UIGridItem 建立響應式欄位配置。"
  >
    <ShowcaseSection
      title="響應式網格"
      component-name="UIGrid / UIGridItem"
      description="手機版整行，平板兩欄，桌面四欄。"
      usage='<UIGrid>
  <UIGridItem sm="12" md="6" lg="3">
    這是一個網格項目
  </UIGridItem>
</UIGrid>'
    >
      <UIGrid>
        <UIGridItem sm="12" md="6" lg="3">
          <div
            class="border-nurse-200 bg-brand-50 text-brand-700 rounded-lg border p-4 text-center font-bold"
          >
            第一個網格項目
          </div>
        </UIGridItem>
      </UIGrid>
    </ShowcaseSection>
  </ShowcasePage>
</template>
```

`usage` 是原樣顯示的字串，內含雙引號 → **用單引號包**，可跨多行。範例要能真的互動（綁 `ref`、有 handler），不是靜態截圖。

---

## 狀態標籤

`UITextStatusTag` 的文字寫死三種（進行中／已完成／未啟用）。文案對得上就直接用：

```vue
<UITextStatusTag status="active" />
<UITextStatusTag status="complete" size="md" />
```

文案對不上（例如「已核准／待審核／已作廢」），手刻膠囊：

```vue
<span
  class="bg-brand-50 text-brand-700 inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-bold"
>
  已核准
</span>
```

色票對照：核准／完成 `bg-brand-50 text-brand-700`、待處理 `bg-warning-100 text-warning-800`、作廢／錯誤 `bg-danger-50 text-danger-700`、中性 `bg-secondary-100 text-secondary-700`。
