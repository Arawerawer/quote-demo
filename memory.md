# 開發紀錄

這份是工作階段的重點整理，記錄「為什麼這樣做」與「踩過的坑」——
程式碼看得出來的事（結構、命名、有哪些檔案）不寫在這裡，看 code 就好。

---

## 一、日期欄位：為什麼要自己寫日曆

### 問題

原生 `<input type="date">` 點下去時，年／月／日那一段會出現**系統藍底的選取highlight**，
跟專案配色完全不搭。

### 結論：CSS 改不掉，不要再試

那個藍底是 Chrome 畫在 input 的 **shadow DOM 內部**的 selection highlight，
而 **highlight 樣式不會繼承進 shadow DOM**。所以下面這些全部無效：

| 試過的做法 | 為什麼失敗 |
|---|---|
| `::-webkit-datetime-edit-year-field:focus` | 那些欄位**不會**拿到 focus，focus 在 `<input>` 本身 |
| `::selection` | highlight 樣式不繼承進 shadow DOM |
| `::-webkit-datetime-edit-*` 改背景 | 同上，碰不到 highlight |
| 用 `<label>` 包住 input | 跟 shadow DOM 無關，沒有幫助 |
| 把規則從 `<style scoped>` 搬到全域 | 解決了 scoped 的問題，但**根本原因不是 scoped** |

**不要再往 `main.css` 或 `Date.vue` 加 CSS 試這件事。**

### 附帶發現：`<style scoped>` 碰不到 shadow DOM

Vue 的 `<style scoped>` 會把選擇器編譯成屬性選擇器：

```css
/* 你寫的 */
.form-date input[type='date']::-webkit-calendar-picker-indicator { display: none }

/* 實際編譯出來的 */
.form-date input[type='date'][data-v-847f62fb]::-webkit-calendar-picker-indicator { ... }
```

shadow DOM 內部的節點**不帶 `data-v-` 屬性**，所以規則完全失效。

因為這樣，`::-webkit-calendar-picker-indicator { display: none }` 這條原本寫在
`Date.vue` 的 scoped 區塊裡，**一直都是死的**——原生日曆圖示從來沒被藏起來過。
已搬到 `assets/styles/main.css` 的 `@layer components` 才真正生效。

> 驗證方法：用 `@vue/compiler-sfc` 的 `compileStyle()` 直接把 SFC 的 style 編譯出來看，
> 不要用猜的。也可以直接翻 `.nuxt/dist/client/_nuxt/` 裡 build 出來的 CSS。

### 最後的做法

`components/UI/Form/Date.vue` 改成**桌機自製日曆 + 觸控裝置維持原生 input**：

- 判斷方式 `window.matchMedia('(pointer: coarse)')`，**必須在 `onMounted` 裡做**，
  寫在 ref 初始值會造成 hydration mismatch。
- 桌機走自製日曆，藍底問題自然消失。
- 手機維持原生——原生的日期滾輪比任何自製日曆好用，而且藍底是桌機才有的症狀。
- 版面邏輯（定位、Teleport、外點關閉、鍵盤操作）**照抄 `components/UI/Form/MultiSelect.vue`**，
  沒有從零寫。專案沒有裝任何日期套件，這是唯一的路。

### 兩個容易踩的雷

1. **日期一律用本地時間組字串**，不要用 `toISOString()`——那是 UTC，會整天偏掉。
   要用 `getFullYear()` / `getMonth()` / `getDate()` 自己拼。
2. **彈出面板一定要 `Teleport to="body"`**。`<main>` 是專案唯一的捲動容器
   （`html` / `body` 在 main.css 被設成 `overflow: hidden`），不 teleport 會被裁掉。
3. 日曆格子固定畫 **42 格**（6 週），面板高度才不會隨月份跳動。

---

## 二、詢價單的欄位決策

### 聯絡資訊

畫面上是兩欄流動排列（每欄 `md="6"`），順序：

```
┌─────────────────────┬─────────────────────┐
│ 1 聯絡人姓名 *      │ 2 聯絡電話 *        │
├─────────────────────┼─────────────────────┤
│ 3 公司名稱          │ 4 公司統編          │
├─────────────────────┼─────────────────────┤
│ 5 電子郵件 (Email)  │ 6 希望交期          │
└─────────────────────┴─────────────────────┘
```

剛好六格填滿三列，不會空半格。手機寬度變單欄，由上而下 1→6。

### 驗證一律「寬鬆」，這是刻意的

擋太嚴會擋到真客戶，所以只做最低限度的防呆：

| 欄位 | 必填 | 規則 |
|---|---|---|
| 聯絡人姓名 | ✅ | 非空白 |
| 聯絡電話 | ✅ | 去掉非數字後**至少 8 碼**。`02-1234-5678`、`0912345678`、`04-22334455#123` 都要能過 |
| 公司統編 | ❌ | 填了才驗，**8 位數字**。刻意**不做**官方檢查碼演算法 |
| Email | ❌ | 填了才驗，有 `@`、`@` 後面有點、都不在頭尾 |
| 公司名稱／送貨地點 | ❌ | 不驗 |

`showErrors` 預設 `false`，按下「確認詢價」才轉 `true`——
一進頁面就滿江紅很難看。

> 統編或 Email 格式錯誤也會擋下送出，所以「請補齊聯絡資訊」那個
> 提示視窗的文字要一併提到格式，否則客戶會以為是姓名電話有問題。

### 其他決定

- **聯絡資訊不進 CSV**。CSV 維持只有項目資料：
  `項次,品項,選擇,規格,數量,參考圖檔,備註`
- **送出後不清空聯絡資訊**。demo 時常要連送好幾次，每次重打很煩。
- **參考圖檔只記檔名**，檔案本身不上傳（沒有後端）。
- 詢價單表格**刻意不顯示**參考圖檔與備註兩欄——客戶自己填的時候就看過了，
  但 CSV 要留著，老闆報價時才看得到特殊要求。
- `useQuoteContact` 跟 `useQuoteCart` **分開**：一個是訂單層級、一個是清單，
  生命週期不同（清空清單不該清掉聯絡資訊）。

### 已移除的東西

**「相關選購項目」已從詢價單移除**（同事反應放在購物車沒意義）。

`components/Product/RelatedList.vue` 本身**留著沒刪**，目前沒有任何地方引用。
連帶地 `useAppNavigation.ts` 的 `comingSoon` 欄位也暫時沒作用——
那個欄位當初就是為了這個元件加的。想放到品項頁的話隨時能接回去。

---

## 三、Notion 對照的規矩

**Notion 沒提到的欄位不要自己加，Notion 標問號的地方不要自己填。**

已經取得授權的例外（這些可以做）：
數量、參考圖示、備註、交期、聯絡資訊、送貨地點。

所以像「數值範圍檢查」這種 Notion 打問號的東西，程式裡就只做防呆、不做範圍驗證。

---

## 四、專案慣例備忘

> 這節只記容易忘或容易踩雷的，完整規範看 `CLAUDE.md`。

- **`npm run dev` 由使用者自己跑，Claude 不要跑**（也不要用 `timeout`、背景執行等變通）。
- npm scripts 一律寫 `node ./node_modules/nuxt/bin/nuxt.mjs`，不要用 `nuxt` binary（Windows 相容性）。
- `useAppNavigation.ts` 的 `mainNavigation` 是 **append-only**：
  `homeItem` / `uiWorkspace` 硬編碼在 `[0]` / `[1]`，**重排陣列會壞掉**。
  只能在既有物件上加欄位。
- 表單外觀改 `composables/useFormControlStyles.ts`，不要逐一改元件。
- Tailwind v4 沒有 `tailwind.config`，token 全在 `assets/styles/main.css` 的 `@theme static`。
- 元件名 = `components/` 底下的路徑，沒有 prefix。移動檔案等同改名，全站引用都要跟著改。
- Prettier：無分號、單引號，提交前跑 `npm run format`。

---

## 五、目前的待辦與已知狀態

### 還沒做的

- **六個品項頁還是「待補」空頁**：C 型鋼、角鐵、扁鐵、H 型鋼、水槽鋼瓦、連接板。
  只有鋼板彎折做完了。
- `/login` 目前進不去。
- `useAppNavigation.ts` 裡的 `/example/chart` 沒有對應的 page 檔案
  （`chart.js` 已在依賴裡，頁面沒建）。

### 沒進版控的檔案（刻意的）

| 檔案 | 原因 |
|---|---|
| `視覺化參考.jpg`（根目錄） | 參考圖，不是原始碼 |
| `public/images/steel/c-channel.svg` | **過時**，幾何跟 `components/UI/Steel/Icon.vue` 對不起來了 |
| `public/images/steel/preview.html` | 同上，而且是臨時的預覽頁，沒有任何地方引用 |

要清的話：刪掉 `public/images/steel/` 兩個檔，`.jpg` 加進 `.gitignore`。

### ⚠️ 尚未驗證

**從 `Date.vue` 重寫到現在，都沒有跑過 `npm run build`，也沒跑過 `npm run format`。**

`Date.vue` 是手寫的、沒經過 Prettier，所以 `npm run format:check` 目前大機率是紅的。
之後 build 如果出問題，優先看這個檔案。
