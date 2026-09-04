# 慣例與避坑

## 避坑指南（寫程式碼前必讀）

以下都是實測出來、會讓頁面壞掉或行為不如預期的陷阱。

### 1. `UIPageHeader` 的 `actions` slot 不會渲染

模板判斷 `$slots.actions || $slots.default`，但實際只渲染 `<slot />`。傳 `<template #actions>` 內容**永遠不顯示**。

```vue
<!-- ❌ 不會顯示 -->
<UIPageHeader title="報價單">
  <template #actions>
    <UIFormButton text="新增" />
  </template>
</UIPageHeader>

<!-- ✅ 用 default slot -->
<UIPageHeader title="報價單">
  <UIFormButton text="新增" />
</UIPageHeader>
```

### 2. `mainNavigation` 前兩位不能動

`useAppNavigation.ts` 裡 `homeItem = mainNavigation[0]`、`uiWorkspace = mainNavigation[1]` 是硬編碼索引。新項目一律 **append 到陣列尾端**，插隊會讓首頁與 UI 工作區指到錯的項目。

### 3. `warning` prop 顯示的是紅色

元件對外的 `warning` boolean 為 true 時，內部傳給 `useFormControlStyles` 的是 `'error'` 而非 `'warning'`。所以畫面是**紅色**（`rose-500` 邊框），不是琥珀色。命名與行為不一致，照用即可，知道會紅就好。

`FormControlStatus` 的 `'warning'` 值實際上沒有任何元件在用。

### 4. `<UIGrid>` 不是 `<UIGridGrid>`

`components/UI/Grid/Grid.vue` 路徑重複，但 Nuxt 會去重成 `<UIGrid>`。專案 CLAUDE.md 在這點上寫錯了，以實際頁面（`pages/UI/grid.vue`、`pages/example/form.vue`）為準。

### 5. `UITextStatusTag` 文案寫死

只有三種：`active`→「進行中」、`complete`→「已完成」、`inactive`→「未啟用」。無法自訂。要別的文案就手刻膠囊，寫法見 `templates.md` 的「狀態標籤」一節。

### 6. `UIPageProgressSteps` 只有三步驟

`current` 型別寫死 `1 | 2 | 3`，步驟文案也寫死（選擇項目／填寫資料／確認內容）。超過三步驟或要自訂文案 = 缺件，回報使用者。

### 7. `UIFormInputUnit` 的 v-model 實作不同

全專案唯一沒用 `defineModel` 的表單元件，改用 `modelValue` prop + `update:modelValue` emit。`v-model` 照樣能用，但別假設它跟其他 17 個 Form 元件行為一致（例如它另設了 `inheritAttrs: false`）。

### 8. 三個元件的 v-model 是必填

`UIFormRadio`、`UIFormRadioGroup`、`UIListDraggable` 的 `defineModel` 是 `required: true`，不綁 `v-model` 會噴警告。

### 9. 唯一的捲動容器是 app.vue 的 `<main>`

`main.css` 把 `html` 和 `body` 都設成 `overflow: hidden`。需要偵測捲動時對象是那個 `<main>`，**不是 `window`**。

### 10. `UIPageFooterButtonBox` 要留頁尾空間

它在行動裝置是固定在畫面底部的。用了它，外層容器要加 `pb-28 max-md:pb-32`，否則內容會被蓋住。

### 11. `UIIcon` 查不到就靜默不渲染

圖示沒出現時先檢查名稱拼寫。它會把 `arrow-left` / `arrow_left` 正規化成 `ArrowLeft` 再去 `@lucide/vue` 查。

### 12. 兩種 icon 傳法不能混

- `UIFormButton`、`UIIcon` 收**字串**：`icon="Plus"`
- `UIButtonIconBlock`、`UIButtonNavMenu`、`UITextIconItem` 收**元件本身**：要 `import { Plus } from '@lucide/vue'` 再 `:icon="Plus"`

---

## 主題 token

Tailwind v4，沒有 `tailwind.config`。全部寫在 `assets/styles/main.css` 的 `@theme static`。

**7 個色板 × 11 階**（`50 100 200 300 400 500 600 700 800 900 950`）：

| Token       | 用途                       | 500 值    |
| ----------- | -------------------------- | --------- |
| `brand`     | 主要品牌／操作（藍）       | `#0576f1` |
| `secondary` | 次要操作／中性輔助         | `#878b87` |
| `warning`   | 需留意的操作與狀態（琥珀） | `#d98a08` |
| `danger`    | 刪除／錯誤／高風險         | `#c85a5a` |
| `desert`    | 頁面背景、溫和中性（米）   | `#978c79` |
| `nurse`     | 邊框、停用、冷調中性（灰） | `#878b87` |
| `rose`      | 表單錯誤狀態               | `#c85a5a` |

⚠️ `secondary` 與 `nurse` 數值**完全相同**；`danger` 與 `rose` 也**完全相同**。

class 形式：`text-{token}-{shade}`、`bg-`、`border-`、`ring-`、`divide-`、`outline-`、`fill-`、`stroke-`、`accent-`、`shadow-`，CSS 變數 `var(--color-{token}-{shade})`。變體前綴皆可組合（`hover:`、`focus:`、`disabled:`、`max-md:`）。

其他 token：

- `--font-sans: 'Inter', 'Noto Sans TC', sans-serif`
- `--container-page: 800px` → `w-[min(100%,var(--container-page))]`

新增顏色加在 `main.css`，並更新 `pages/UI/colors.vue`。**但饅頭大師不改這個檔**。

---

## 版面慣例

### 寬度

一律 `w-[min(100%,Npx)]`，**不用** `max-w-` + `w-full`。

- 頁面容器：`w-[min(100%,1180px)]`
- 流程頁主體：`w-[min(100%,var(--container-page))]`（= 800px，`UIPageScreenBody` 內建）

### 間距節奏

| 場景                 | class                                   |
| -------------------- | --------------------------------------- |
| 頁面 padding         | `p-6 max-md:p-4`                        |
| Header 與內容之間    | `mb-4`（掛在 `UIPageHeader` 上）        |
| Section 之間         | `grid gap-6`                            |
| 卡片內區塊           | `flex flex-col gap-6`                   |
| Grid 欄位間          | `gap-4`（`UIGrid` 內建）                |
| 按鈕並排             | `gap-2` / `gap-3`                       |
| 表格內小按鈕         | `gap-1`                                 |
| 垂直節奏（全螢幕頁） | `space-y-6` / `space-y-5` / `space-y-2` |

### 卡片與圓角

- 內容卡（`UIPageContent`）：`border-nurse-200 overflow-hidden rounded-2xl border bg-white p-4`
- 帶 header 的卡：外層同上不含 padding，header `border-b`，body `bg-desert-50 px-6 py-7`
- 小方塊：`border-nurse-200 bg-brand-50 text-brand-700 rounded-lg border p-4 text-center font-bold`

圓角階梯：卡片 `rounded-2xl` → 中型容器 `rounded-xl` → 輸入框／按鈕 `rounded-lg` → 小按鈕 `rounded-md`

### 響應式

本專案慣用 **`max-*` 前綴（desktop-first 覆寫）**：`max-md:p-4`、`max-md:text-3xl`、`max-md:grid-cols-1`、`max-lg:hidden`。

只有網格類會用 min-width 前綴：`sm:grid-cols-5`、`md:col-span-6`。

Sidebar 桌面／行動切換界線是 `1024px`（`lg`）。

### 文字

| 用途     | class                                                              |
| -------- | ------------------------------------------------------------------ |
| 頁面 h1  | `text-nurse-900 text-4xl leading-tight font-black max-md:text-3xl` |
| 卡片 h2  | `text-brand-900 m-0 text-xl font-bold`                             |
| 頁面說明 | `text-nurse-600 m-0 text-base leading-7`                           |
| 小說明   | `text-nurse-600 m-0 mt-1 text-sm`                                  |
| 連結     | `text-brand-600 hover:text-brand-800 no-underline`                 |

標題一律**明確寫 `m-0`**（`main.css` 只設了 h1–h6 的 font-weight，沒清 margin）。

### 防溢出組合

flex 佈局裡 `min-w-0`、`shrink-0`、`truncate`、`flex-1` 幾乎必成套出現：外層 `flex min-w-0 items-center gap-2`，固定項 `shrink-0`，文字 `truncate`。

### 既有 CSS class

`main.css` 的 `@layer components` 有一批舊式 class，最實用的是：

- `.inline-field` — 輸入框 + 按鈕並排的標準寫法（`display:flex; align-items:center; gap:8px`，且內部 `.form-control` 自動 `flex:1; min-width:0`）
- `.form-grid` / `.form-grid--three` — 2 欄 / 3 欄表單網格

`.form-control` 由 `useFormControlStyles` 掛在每個輸入元件上，是 `.inline-field` 能選到子元素的關鍵。

---

## 專案結構

- **沒有** `layouts/`、`middleware/`、`plugins/`、`utils/`、`types/`、`stores/`
- `app.vue` 是唯一 layout，讀 `route.meta.hideAppNavigation` 決定全螢幕或帶框架
- `server/` 只有 tsconfig，沒有 API
- 跨層級共用狀態用 `useState('key', () => initial)`（sidebar 收合狀態就是這樣做）
- 取代 middleware 的做法：`definePageMeta({ hideAppNavigation: true })`

---

## 程式碼風格

- 一律 `<script setup lang="ts">`
- props 用 `withDefaults(defineProps<{}>(), {})`
- 雙向綁定用 `defineModel`
- Nuxt auto-import 生效：`ref`、`computed`、`reactive`、`watch`、`useState`、`navigateTo`、`useRoute` **不用 import**
- **只有** `@lucide/vue` 的 icon 和跨檔案 type 需要顯式 import
- Prettier：無分號、單引號、`prettier-plugin-tailwindcss` 自動排序 class
- 介面文字、註解、`description` 全用繁體中文（台灣用語）

提交前跑 `npm run format`。
