# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 指令

> **`npm run dev` 由使用者自己執行，Claude 不要跑。**
> 需要驗證畫面時，請使用者自行啟動 dev server 並回報結果，不要自己開（也不要用 `timeout`、背景執行等變通方式）。其他指令照常。

```bash
npm install          # 安裝依賴（postinstall 會跑 nuxt prepare 產生 .nuxt/tsconfig.json）
npm run dev          # 開發伺服器 http://localhost:3000 —— 使用者專用，Claude 勿執行
npm run build        # production build
npm run generate     # 靜態產生
npm run preview      # 預覽 production build
npm run format       # prettier --write .
npm run format:check # prettier --check .
```

沒有測試框架、沒有 lint 設定。npm scripts 一律用 `node ./node_modules/nuxt/bin/nuxt.mjs` 而非 `nuxt` binary（Windows 環境相容性），新增 script 時沿用這個寫法。

## 專案性質

Nuxt 3 (`nuxt ^3.21`，傳統目錄結構：`app.vue`／`pages/`／`components/` 都在專案根目錄) + Vue 3 + Tailwind CSS v4 的**內部 UI 元件庫展示站**。`package.json` 的 name 是 `shop_booking`，但目前內容是元件庫 + 範例頁，沒有實際業務邏輯、沒有 API、`server/` 只有 tsconfig。

## 架構

### 全域 shell 與 `hideAppNavigation`

[app.vue](app.vue) 是唯一的 layout（沒有用 `layouts/`）。它讀 `route.meta.hideAppNavigation` 決定兩種模式：

- 有這個 meta → 直接渲染 `<NuxtPage />`，全螢幕無框架（例：[pages/login.vue](pages/login.vue)）
- 沒有 → 包上 `UIPageTopNav` + `UIPageSidebar` + 可捲動的 `<main>`

新增全螢幕頁面時在 page 裡寫 `definePageMeta({ hideAppNavigation: true })`。

`<main>` 是唯一的捲動容器（`html`/`body` 在 [main.css](assets/styles/main.css) 被設成 `overflow: hidden`），路由變更時由 app.vue 手動捲回頂端。若元件需要偵測捲動，對象是這個 `<main>`，不是 window。

### 導覽是單一資料來源

[composables/useAppNavigation.ts](composables/useAppNavigation.ts) 的 `mainNavigation` 陣列同時驅動 sidebar、top nav 與首頁卡片。**新增頁面必須同步加進這個陣列**，否則進不去。其衍生值有語意約定：

- `pageItems` = 沒有 `children` 的項目（獨立頁）
- `workspaceItems` = 有 `children` 的項目（可展開群組）
- `homeItem` / `uiWorkspace` 是硬編碼的 `mainNavigation[0]` / `[1]`，**重排陣列會壞掉**

目前陣列裡的 `/example/chart` 沒有對應的 page 檔案（`chart.js` 已在依賴中，但頁面未建）。

### 元件命名 = 目錄結構

Nuxt 自動註冊，元件名由 `components/` 下的路徑拼成，**沒有 prefix 設定**：

- `components/UI/Form/Input.vue` → `<UIFormInput>`
- `components/UI/Page/Sidebar.vue` → `<UIPageSidebar>`
- `components/UI/Table.vue` → `<UITable>`
- `components/Showcase/Section.vue` → `<ShowcaseSection>`

`components/UI/Grid/Grid.vue` 因路徑重複而是 `<UIGridGrid>`。移動元件檔案等同重新命名元件，全站引用都要改。

### 表單樣式集中在 composable

所有輸入類元件的 class 來自 [composables/useFormControlStyles.ts](composables/useFormControlStyles.ts)，回傳 `[base, readonly, size, status]` 字串陣列。約定：

- `size`: `sm` | `md` | `lg`，`status`: `default` | `error` | `warning`
- 元件另外接受一個 `warning` boolean prop，為 true 時**強制轉成 `error` 樣式**（見 [Input.vue:32-34](components/UI/Form/Input.vue#L32-L34)）——命名與行為不一致，沿用既有寫法即可
- 改表單外觀改這個檔案，不要逐一改元件

### 主題 token 在 CSS，不在 JS

Tailwind v4 沒有 `tailwind.config`，全部設定寫在 [assets/styles/main.css](assets/styles/main.css) 的 `@theme static` 區塊。自訂色階：`brand`（藍）、`secondary`、`warning`、`danger`、`desert`（米色，頁面底色）、`nurse`（灰，邊框/disabled）、`rose`（錯誤，與 `danger` 值相同）。

注意 `secondary` 與 `nurse` 色階值完全相同，`danger` 與 `rose` 也是。新增顏色加在這裡，並更新 [pages/UI/colors.vue](pages/UI/colors.vue)。

### 圖示

[UIIcon](components/UI/Icon.vue) 用字串名動態查 `@lucide/vue` 的整包 export（`import * as lucideIcons`），會把 `arrow-left` / `arrow_left` 正規化成 `ArrowLeft`。查不到就靜默不渲染——圖示沒出現先檢查名稱拼寫。需要靜態引用時（如 navigation 設定）直接 `import { Home } from '@lucide/vue'`。

## 撰寫展示頁

`/UI/*` 底下的頁面一律用這組容器：

```vue
<ShowcasePage title="..." description="...">
  <ShowcaseSection
    title="按鈕"
    component-name="UIFormButton"
    description="..."
    usage='<UIFormButton variant="primary">主要操作</UIFormButton>'
  >
    <!-- 可互動的實際元件 -->
  </ShowcaseSection>
</ShowcasePage>
```

`usage` prop 是原樣顯示的程式碼字串，收在 `<details>` 裡。因為內含雙引號，習慣用**單引號包字串**。範例要能真的互動（綁 `ref`、有 handler），不是靜態截圖。

一般頁面（`pages/example/*`）用 `UIPageHeader` + `UIPageContent`，外層容器慣例是 `mx-auto w-[min(100%,1180px)] p-6 max-md:p-4`。

## 慣例

- 介面文字、註解、`description` 全用繁體中文
- Prettier：無分號、單引號、含 `prettier-plugin-tailwindcss`（會自動排序 class）——提交前跑 `npm run format`
- Vue 元件用 `<script setup lang="ts">`，props 用 `withDefaults(defineProps<{}>(), {})`，雙向綁定用 `defineModel`
- Nuxt auto-import 生效（`ref`、`computed`、`useState`、`navigateTo` 等不用 import）；跨層級共用狀態用 `useState('key', ...)`（sidebar 收合狀態就是這樣做）
