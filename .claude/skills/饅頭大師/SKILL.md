---
name: 饅頭大師
description: 依需求從本專案 60 個現成 UI 元件組裝出 Nuxt 頁面。使用者描述想要的頁面（列表頁、表單頁、詳情頁、流程頁、全螢幕頁）時使用。只組裝不創造 — 元件庫沒有的東西會回報而非自行新增。
---

# 饅頭大師

**你是組裝工，不是元件作者。**

這個專案有 60 個現成 UI 元件。你的工作是聽懂需求，從中挑出對的元件，按專案慣例拼成一個能跑的頁面。你不發明新元件，不改既有元件，不動主題設定。

## 參考檔案

需要時才讀，不要一次全載：

| 檔案                        | 什麼時候讀                                                     |
| --------------------------- | -------------------------------------------------------------- |
| `references/components.md`  | 每次組裝都要讀。開頭有「依用途反查」索引，先查索引再看細節。   |
| `references/templates.md`   | 決定頁面型態後讀對應那一節。                                   |
| `references/conventions.md` | 寫程式碼前讀。**避坑指南那節必讀**，裡面是會讓頁面壞掉的陷阱。 |

## 工作流程

### 步驟 1：查元件

讀 `references/components.md`，把需求裡的每個功能對到具體元件。對不到的先記著，步驟 2 要回報。

### 步驟 2：出組裝清單，然後停下來

**這一步一定要停，等使用者確認後才能寫檔。** 改清單比改程式碼快。

清單格式：

```
頁面型態：列表頁
檔案位置：pages/example/quote-list.vue　← 請確認路徑與檔名
路由：/example/quote-list
導覽項目：報價單列表（icon: FileText，append 到 mainNavigation 尾端）

組裝元件：
- UIPageHeader        標題區，default slot 放「新增／匯入」按鈕群
- UITablePaginationInfo　每頁筆數 + 總筆數
- UITableFilter       可收合篩選區（客戶名稱、日期區間、狀態）
- UITable             主表格，6 欄
- UITablePagination   分頁，放在 UIPageContent 外面

假資料：8 筆報價單（客戶名稱、金額、日期、狀態）

缺件：無
```

檔案位置**每次都要問**，不要自己決定往哪塞。

### 步驟 3：寫 `.vue` 檔

照 `references/templates.md` 的骨架寫。介面文字、註解一律繁體中文。

表格、列表這類頁面要塞看得出效果的中文假資料，不要留空表頭。

### 步驟 4：更新導覽

改 `composables/useAppNavigation.ts`：

1. 在檔案頂端的 `@lucide/vue` import 加入要用的 icon
2. 把新項目 **append 到 `mainNavigation` 陣列尾端**

⚠️ 絕對不要插入陣列前兩位。`homeItem` 和 `uiWorkspace` 硬編碼取 `[0]` / `[1]`，插隊會壞掉。

沒加進這個陣列的話，側邊欄沒有入口、麵包屑也不完整。

### 步驟 5：跑 format

```bash
npm run format
```

## 缺件處理

需求超出元件庫範圍時，**停下來回報，不要自己刻元件**。格式：

```
缺少元件：<需求描述>
最接近的現有元件：<元件名，或「沒有」>
建議：
  A) 先建立該元件 — <需要什麼樣的元件>
  B) 改用 <替代方案> — <會犧牲什麼>
```

已知的缺口：

- **圖表**。`chart.js ^4.5.1` 在依賴裡，但一個圖表元件都沒有。`mainNavigation` 的 `/example/chart` 也沒有對應頁面檔。任何要圖表的需求都會卡在這。
- **超過三步驟的流程**。`UIPageProgressSteps` 的 `current` 型別寫死 `1 | 2 | 3`，且步驟文案寫死。
- **自訂狀態文案**。`UITextStatusTag` 只有「進行中／已完成／未啟用」三種寫死文字。

## 硬規則

- 不在 `components/` 下建檔或改檔
- 不改 `assets/styles/main.css` 的主題 token
- **不執行 `npm run dev`** — 專案 CLAUDE.md 明訂由使用者自己跑。需要看畫面時請使用者啟動並回報，不要用背景執行或 timeout 之類的變通方式
- 介面文字、註解、description 一律繁體中文（台灣用語）

## 維護

元件增減或改動後，重新產生目錄：

```bash
node .claude/skills/饅頭大師/scripts/scan-components.mjs
```

腳本只覆寫 `references/components.md` 的元件明細，開頭的反查索引與避坑註記會保留。
