# 元件目錄

本專案共 **60 個元件**。Nuxt 自動註冊，元件名 = `components/` 下的路徑拼接，無 prefix 設定。

共用型別（來自 `composables/useFormControlStyles.ts`）：

- `FormControlSize = 'sm' | 'md' | 'lg'`
- `FormControlStatus = 'default' | 'error' | 'warning'`

<!-- INDEX:START 以下反查索引為手寫維護，掃描腳本不會覆寫 -->

## 依用途反查

**文字輸入** → `UIFormInput`（單行）／`UIFormTextarea`（多行）／`UIFormPassword`（密碼含顯示切換）／`UIFormNumber`（數字）／`UIFormInputUnit`（帶單位前後綴，⚠️ 見避坑）／`UIFormCopy`（唯讀+複製鈕）

**選擇** → `UIFormSelect`（單選下拉）／`UIFormMultiSelect`（多選、可搜尋）／`UIFormRadio`＋`UIFormRadioGroup`（單選鈕）／`UIFormCheckbox`（勾選）／`UIFormRange`（滑桿）／`UISelectableCard`（卡片式單選）／`UIButtonChoice`（三態選項鈕，如時段）

**日期時間** → `UIFormDate`／`UIFormTime`

**表單結構** → `UIFormGroup`（標籤+必填星號+錯誤訊息）／`UIFormMerge`（多控制項併成一個外框）／`UIGrid`＋`UIGridItem`（12 欄網格）

**按鈕** → `UIFormButton`（標準）／`UIFormButtonGroup`（群組，超出收進更多選單）／`UIButtonPageBottom`（頁尾大按鈕）／`UIButtonGoBack`（返回）／`UIButtonIconBlock`（圖示導覽卡）／`UIButtonNavMenu`（頂欄膠囊，可下拉）／`UIButtonPageTab`（頁籤）

**表格** → `UITable`（外框，內包原生 `<table>`）／`UITableFilter`（可收合篩選區）／`UITablePagination`（頁碼）／`UITablePaginationInfo`（每頁筆數+統計）

**清單** → `UIListGroup`＋`UIListItem`（斑馬紋清單）／`UIListDraggable`（可拖曳排序）

**唯讀資料展示** → `UIFieldGroup`＋`UIField`（左標題右內容，詳情頁主力）／`UITextItem`（dt/dd 對照）／`UITextIconItem`（圖示+文字）

**頁面骨架** → `UIPageHeader`（標題+麵包屑+動作區）／`UIPageContent`（白卡容器）／`UIPageFooterButtonBox`（頁尾按鈕列）／`UIPageScreenBody`（限寬主體）／`UIPageBreadcrumb`／`UIPageProgressSteps`（三步驟，⚠️ 寫死）／`UIPageLogo`／`UIPageTopNav`／`UIPageSidebar`（app.vue 已用，頁面不需自行放）

**彈窗與回饋** → `UIModal`（對話框）／`UIAlert`（確認框，SweetAlert 風格）／`UIPageLoading`（底部載入提示）／`UISkeleton`（骨架佔位）／`UIEmptyState`（空狀態）／`UITextStatus`（完成頁大打勾）

**狀態標示** → `UITextStatusTag`（⚠️ 文字寫死三種）

**圖片** → `UIImageDisplay`（固定比例顯示）／`UIImageUpload`（拖放上傳）

**圖示** → `UIIcon`（字串名動態查 Lucide）

**卡片** → `UIBoxCard`（帶標題描述表頭）

**展示頁專用** → `ShowcasePage`＋`ShowcaseSection`（只用於 `/UI/*`）

**❌ 沒有的東西**：圖表（chart.js 已裝但無元件）、Tooltip、Toast、Accordion、Tabs 內容切換、樹狀選單、日期區間選擇器（只有單一日期）、檔案上傳（只有圖片）

<!-- INDEX:END -->

<!-- COMPONENTS:START 以下由 scan-components.mjs 產生 -->

## Showcase（2）

### `<ShowcasePage>` — `components/Showcase/Page.vue`

- Props：`title: string`（必填）、`description: string`（必填）
- Slots：`default`
- 用途：`/UI/*` 展示頁外框。**內建**外層容器 class 與 `UIPageHeader`，內容以 `grid gap-6` 排列。

### `<ShowcaseSection>` — `components/Showcase/Section.vue`

- Props：`title: string`（必填）、`componentName: string`（必填）、`description: string`（必填）、`usage?: string`（`''`）、`tone?: 'default' | 'brand'`（`'default'`）
- Slots：`default`
- 用途：單一元件的展示卡片，含標題、說明、示範區、可摺疊的 usage 程式碼。

---

## UI 根層（8）

### `<UIAlert>` — `components/UI/Alert.vue`

- Props：`title: string`（必填）、`text?: string`（`''`）、`html?: string`（`''`）、`icon?: 'success' | 'error' | 'warning' | 'info' | 'question'`（`'info'`）、`confirmText?: string`（`'確認'`）、`cancelText?: string`（`'取消'`）、`showConfirmButton?: boolean`（`true`）、`showCancelButton?: boolean`（`false`）、`closeOnBackdrop?: boolean`（`true`）、`closeOnEscape?: boolean`（`true`）、`timer?: number`（`0`）
- v-model：`boolean`（預設 `false`）— 開關
- Emits：`confirm`、`cancel`、`timeout`（皆無參數）
- Slots：`footer`（slot props：`confirm`、`cancel`）
- 用途：SweetAlert 風格確認框，基於 `UIModal`。`timer` > 0 時自動關閉。

### `<UIEmptyState>` — `components/UI/EmptyState.vue`

- Props：`variant?: 'service' | 'time'`（`'time'`）、`title?: string`（`''`）、`description?: string`（`''`）
- 用途：無資料時的空狀態提示。

### `<UIField>` — `components/UI/Field.vue`

- Props：`title: string`（必填）、`sm?: number | string`、`md?`、`lg?`、`xl?`（皆 `undefined`）
- Slots：`default`（欄位內容）
- 用途：左標題右內容的唯讀欄位列。標題欄固定 `max-w-[14ch]`。**必須放在 `UIFieldGroup` 內**。

### `<UIIcon>` — `components/UI/Icon.vue`

- Props：`name: string`（必填）、`size?: number | string`（`18`）、`strokeWidth?: number | string`（`2.5`）
- 用途：以字串名動態查 Lucide 圖示，自動把 `arrow-left` / `arrow_left` 正規化成 `ArrowLeft`。**查不到就靜默不渲染** — 圖示沒出現先檢查拼字。

### `<UIModal>` — `components/UI/Modal.vue`

- Props：`title: string`（必填）、`size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'`（`'md'`）、`closeOnBackdrop?: boolean`（`true`）、`closeOnEscape?: boolean`（`true`）、`showHeader?: boolean`（`true`）、`showClose?: boolean`（`true`）
- v-model：`boolean`（預設 `false`）— 開關
- Slots：`default`（主體）、`before-footer`、`footer`
- 用途：Teleport 到 body 的對話框，含捲動鎖定與焦點處理。

### `<UISelectableCard>` — `components/UI/SelectableCard.vue`

- Props：`title: string`（必填）、`description: string`（必填）、`selected?: boolean`（無預設）、`duration?: string`、`price?: string`
- Emits：`select: []`
- 用途：卡片式單選（含 radio 樣式、時長與價格），流程頁選服務項目用。

### `<UISkeleton>` — `components/UI/Skeleton.vue`

- Props：`variant?: 'text' | 'card' | 'circle'`（`'text'`）、`width?: string`（`'100%'`）、`height?: string`（`''`）
- 用途：載入中骨架佔位，含 shimmer 動畫。

### `<UITable>` — `components/UI/Table.vue`

- Props：`hideVerticalBorders?: boolean`（`false`）
- Slots：`default`
- 用途：表格外框，提供橫向捲動與統一的 table/th/td 樣式。**內部放原生 `<table>`，不是 props 驅動。**

---

## UI/Box（1）

### `<UIBoxCard>` — `components/UI/Box/Card.vue`

- Props：`title: string`（必填）、`description: string`（必填）
- Slots：`default`
- 用途：帶標題與描述表頭的內容卡片。

---

## UI/Button（6）

### `<UIButtonChoice>` — `components/UI/Button/Choice.vue`

- Props：`text: string`（必填）、`state?: 'default' | 'selected' | 'disabled'`（`'default'`）、`statusText?: string`（`''`）
- Emits：`select: []`
- 用途：三態選項按鈕，可附小標籤文字（如時段選擇的「已額滿」）。

### `<UIButtonGoBack>` — `components/UI/Button/GoBack.vue`

- Props：`text: string`（型別必填，`withDefaults` 給 `'返回'`）、`to?: string`
- 用途：帶圓形箭頭圖示的返回連結（NuxtLink）。

### `<UIButtonIconBlock>` — `components/UI/Button/IconBlock.vue`

- Props：`title: string`（必填）、`description: string`（必填）、`icon: Component`（必填，**要從 `@lucide/vue` import 元件本身，不是字串**）、`to: string`（必填）
- 用途：左圖示 + 標題描述 + 右箭頭的導覽卡。首頁卡片就是這個。

### `<UIButtonNavMenu>` — `components/UI/Button/NavMenu.vue`

- Props：`text: string`（必填）、`icon?: Component`、`onClick?: () => void | Promise<void>`、`hasDropdown?: boolean`（`false`）、`dropdown?: NavMenuConfig`
- 匯出型別：`NavMenuItem { text; onClick; isRed? }`、`NavMenuConfig { items: NavMenuItem[] }`
- 用途：頂欄膠囊按鈕，可展開下拉（點外部／Esc 關閉）。

### `<UIButtonPageBottom>` — `components/UI/Button/PageBottom.vue`

- Props：`variant?: 'primary' | 'secondary'`（`'primary'`）、`type?: 'button' | 'submit'`（`'button'`）
- Slots：`default`（按鈕文字）
- 用途：頁面底部大型圓角按鈕。搭配 `UIPageFooterButtonBox` 使用。

### `<UIButtonPageTab>` — `components/UI/Button/PageTab.vue`

- Props：`title: string`（必填）、`to: string`（必填）、`active?: boolean`（無預設）
- 用途：頁籤式導覽連結，啟用時自動水平捲動到可視範圍。

---

## UI/Field（1）

### `<UIFieldGroup>` — `components/UI/Field/Group.vue`

- Props：`col?: number | string`（`12`，clamp 1–12）
- Slots：`default`（放 `UIField`）
- 用途：`UIField` 的網格容器，設定欄數並統一邊框。

---

## UI/Form（18）

### `<UIFormButton>` — `components/UI/Form/Button.vue`

- Props：`text?: string`（`''`）、`icon?: string`（`''`，**字串名，走 `UIIcon`**）、`iconPosition?: 'left' | 'right'`（`'left'`）、`iconOnly?: boolean`（`false`）、`ariaLabel?: string`、`type?: 'button' | 'submit' | 'reset'`（`'button'`）、`variant?: 'primary' | 'secondary' | 'cancel' | 'warning' | 'danger' | 'outline'`（`'primary'`）、`appearance?: 'solid' | 'outline'`（`'solid'`）、`disabled?: boolean`（`false`）、`warning?: boolean`（`false`）、`size?: FormControlSize`（`'md'`）
- Emits：無（`@click` 靠 attrs fallthrough，直接綁即可）
- Slots：`default`（接在文字／圖示之後）
- 用途：表單標準按鈕。`iconOnly` 時記得給 `ariaLabel`。

### `<UIFormButtonGroup>` — `components/UI/Form/ButtonGroup.vue`

- Props：`size?: FormControlSize`（`'md'`）、`gap?: number`（`8`）、`sm?: number`、`md?`、`lg?`、`xl?`（預設皆 `Number.MAX_SAFE_INTEGER`＝不限）
- Slots：`default`
- 用途：按鈕群組。斷點 props 是「該尺寸下最多顯示幾顆」，超出的收進「更多操作」浮動選單。例：`:sm="0" :md="2"` = 手機全收起、桌面顯示 2 顆。

### `<UIFormCheckbox>` — `components/UI/Form/Checkbox.vue`

- Props：`label?: string`（`''`）、`disabled?: boolean`（`false`）、`warning?: boolean`（`false`）、`bordered?: boolean`（`false`）、`ariaLabel?: string`
- v-model：`boolean`（預設 `false`）
- Slots：`default`（覆寫 label）

### `<UIFormCopy>` — `components/UI/Form/Copy.vue`

- Props：`text?: string`（`''`）、`disabled?: boolean`（`false`）
- 用途：唯讀輸入框 + 複製鈕，複製後 2 秒顯示打勾。

### `<UIFormDate>` — `components/UI/Form/Date.vue`

- Props：`min?: string`、`max?: string`、`required?: boolean`（`false`）、`disabled?: boolean`（`false`）、`readonly?: boolean`（`false`）、`warning?: boolean`（`false`）、`status?: FormControlStatus`（`'default'`）、`size?: FormControlSize`（`'md'`）
- v-model：`string`（預設 `''`）
- 用途：`type="date"` 輸入框。**沒有日期區間元件**，要區間就放兩個。

### `<UIFormGroup>` — `components/UI/Form/Group.vue`

- Props：`label?: string`（`''`）、`star?: boolean`（`false`，必填星號）、`merge?: boolean`（`false`）、`groupClass?: string`（`''`）、`boxClass?: string`（`''`）、`warning?: boolean`（`false`）、`warningText?: string`（`''`）、`row?: boolean`（`false`，標籤與控制項同列）
- Slots：`slot-before`、`slot-label`、`default`、`slot-after`
- 用途：表單欄位包裝器。⚠️ 錯誤狀態要**同時**給 `UIFormGroup` 和內層控制項各自加 `warning`。

### `<UIFormInput>` — `components/UI/Form/Input.vue`

- Props：`type?: string`（`'text'`）、`placeholder?: string`（`''`）、`required?: boolean`（`false`）、`disabled?: boolean`（`false`）、`readonly?: boolean`（`false`）、`warning?: boolean`（`false`）、`status?: FormControlStatus`（`'default'`）、`size?: FormControlSize`（`'md'`）
- v-model：`string`（預設 `''`）

### `<UIFormInputUnit>` — `components/UI/Form/InputUnit.vue`

- Props：`modelValue?: string | number`（`''`）、`type?: string`（`'text'`）、`placeholder?: string`（`''`）、`prefix?: string`（`''`）、`suffix?: string`（`''`）、`required?: boolean`、`disabled?: boolean`、`readonly?: boolean`、`warning?: boolean`、`status?: FormControlStatus`、`size?: FormControlSize`
- Emits：`update:modelValue`（`value: string | number`）
- ⚠️ **全專案唯一沒用 `defineModel` 的表單元件**，改用 `modelValue` prop + emit 手動實作。`inheritAttrs: false`，`$attrs` 綁到內層 input。`v-model` 照樣能用。
- 用途：帶前後綴單位的輸入框（NT$、公斤、%）。

### `<UIFormMerge>` — `components/UI/Form/Merge.vue`

- Props：`warning?: boolean`（`false`）、`status?: FormControlStatus`（`'default'`）
- Slots：`default`
- 用途：把多個控制項合併成單一外框的水平群組。

### `<UIFormMultiSelect>` — `components/UI/Form/MultiSelect.vue`

- Props：`options: FormMultiSelectOption[]`（**必填**）、`placeholder?: string`（`'請選擇'`）、`searchPlaceholder?: string`（`'搜尋選項'`）、`emptyText?: string`（`'目前沒有選項'`）、`noResultsText?: string`（`'找不到符合的選項'`）、`required?: boolean`、`disabled?: boolean`、`warning?: boolean`、`status?: FormControlStatus`、`size?: FormControlSize`、`searchable?: boolean`（`true`）、`clearable?: boolean`（`true`）、`closeOnSelect?: boolean`（`false`）、`teleport?: boolean`（`true`）、`placement?: 'bottom-start' | 'top-start'`（`'bottom-start'`）、`maxMenuHeight?: number`（`280`）、`maxTagCount?: number`（`0`＝不限）、`editable?: boolean`（`false`）、`allowCustomValue?: boolean`（`false`）
- 匯出型別：`FormMultiSelectOption { label: string; value: string | number; disabled?: boolean; description?: string }`
- v-model：`(string | number)[]`（預設 `[]`）
- Slots：`footer`（slot props：`close`）

### `<UIFormNumber>` — `components/UI/Form/Number.vue`

- Props：`min?: number`、`max?: number`、`step?: number`（`1`）、`placeholder?: string`（`''`）、`required?: boolean`、`disabled?: boolean`、`readonly?: boolean`、`warning?: boolean`、`status?: FormControlStatus`、`size?: FormControlSize`
- v-model：`number | undefined`（預設 `undefined`）

### `<UIFormPassword>` — `components/UI/Form/Password.vue`

- Props：`placeholder?: string`（`''`）、`required?: boolean`、`disabled?: boolean`、`readonly?: boolean`、`autocomplete?: string`（`'current-password'`）、`warning?: boolean`、`status?: FormControlStatus`、`size?: FormControlSize`
- v-model：`string`（預設 `''`）
- 用途：密碼框，內建顯示／隱藏眼睛鈕。

### `<UIFormRadio>` — `components/UI/Form/Radio.vue`

- Props：`value: string | number`（**必填**）、`label?: string`（`''`）、`name?: string`、`disabled?: boolean`、`warning?: boolean`、`bordered?: boolean`、`ariaLabel?: string`
- v-model：`string | number`（**`required: true`，必須綁**）
- Slots：`default`（覆寫 label）

### `<UIFormRadioGroup>` — `components/UI/Form/RadioGroup.vue`

- Props：`options: FormRadioOption[]`（**必填**）、`name?: string`、`direction?: 'horizontal' | 'vertical'`（`'horizontal'`）、`disabled?: boolean`、`warning?: boolean`
- 匯出型別：`FormRadioOption { label: string; value: string | number; disabled?: boolean }`
- v-model：`string | number`（**`required: true`，必須綁**）

### `<UIFormRange>` — `components/UI/Form/Range.vue`

- Props：`min?: number`（`0`）、`max?: number`（`100`）、`step?: number`（`1`）、`disabled?: boolean`、`showValue?: boolean`（`true`）、`valueSuffix?: string`（`''`）、`warning?: boolean`
- v-model：`number`（預設 `0`）

### `<UIFormSelect>` — `components/UI/Form/Select.vue`

- Props：`options: FormSelectOption[]`（**必填**）、`placeholder?: string`（`'請選擇'`）、`required?: boolean`、`disabled?: boolean`、`warning?: boolean`、`status?: FormControlStatus`、`size?: FormControlSize`
- 匯出型別：`FormSelectOption { label: string; value: string | number; disabled?: boolean }`
- v-model：`string | number`（預設 `''`）
- 用途：原生 select 的樣式化單選下拉。要搜尋或多選改用 `UIFormMultiSelect`。

### `<UIFormTextarea>` — `components/UI/Form/Textarea.vue`

- Props：`placeholder?: string`（`''`）、`rows?: number`（`4`）、`maxlength?: number`、`required?: boolean`、`disabled?: boolean`、`readonly?: boolean`、`warning?: boolean`、`resize?: 'none' | 'vertical' | 'horizontal' | 'both'`（`'vertical'`）、`status?: FormControlStatus`、`size?: FormControlSize`
- v-model：`string`（預設 `''`）

### `<UIFormTime>` — `components/UI/Form/Time.vue`

- Props：`min?: string`、`max?: string`、`step?: number`（`60`）、`required?: boolean`、`disabled?: boolean`、`readonly?: boolean`、`warning?: boolean`、`status?: FormControlStatus`、`size?: FormControlSize`
- v-model：`string`（預設 `''`）

---

## UI/Grid（2）

### `<UIGrid>` — `components/UI/Grid/Grid.vue`

- Props：`col?: number | string`（`12`，clamp 1–12）
- Slots：`default`
- ⚠️ 路徑是 `Grid/Grid.vue`，Nuxt 去重後標籤是 **`<UIGrid>`**，不是 `<UIGridGrid>`。
- 用途：12 欄網格容器，內建 `gap-4`。

### `<UIGridItem>` — `components/UI/Grid/Item.vue`

- Props：`sm?: number | string`、`md?`、`lg?`、`xl?`（皆 `undefined`）
- Slots：`default`
- 用途：網格子項。**不給任何尺寸 = 整行佔滿**。最常見寫法 `<UIGridItem sm="12" md="6">`（手機整行、桌面兩欄）。

---

## UI/Image（2）

### `<UIImageDisplay>` — `components/UI/Image/Display.vue`

- Props：`src?: string | null`（`null`）、`alt?: string`（`''`）、`aspectRatio?: string`（`'4 / 3'`）、`objectFit?: 'cover' | 'contain'`（`'cover'`）
- 用途：固定比例圖片框，載入失敗或無圖時顯示替代狀態。

### `<UIImageUpload>` — `components/UI/Image/Upload.vue`

- Props：`accept?: string`（`'image/*'`）、`disabled?: boolean`（`false`）
- v-model：`File | null`（預設 `null`）
- Emits：`error: [message: string]`
- 用途：拖放／點擊上傳，含預覽、重選、移除。**只支援圖片，沒有通用檔案上傳元件。**

---

## UI/List（3）

### `<UIListDraggable>` — `components/UI/List/Draggable.vue`

- Props：`itemKey?: string`（`'id'`）、`disabled?: boolean`（`false`）
- 匯出型別：`DraggableListItem { id: string | number; text: string }`
- v-model：`DraggableListItem[]`（**`required: true`，必須綁**）
- Slots：`item`（slot props：`item`、`index`；預設顯示 `element.text`）
- 用途：vuedraggable 實作的拖曳排序清單，含握把。

### `<UIListGroup>` — `components/UI/List/Group.vue`

- Props：無
- Slots：`default`
- 用途：清單外框，提供偶數列斑馬紋。

### `<UIListItem>` — `components/UI/List/Item.vue`

- Props：`text?: string`（`''`）、`variant?: 'default' | 'primary' | 'secondary' | 'cancel' | 'warning' | 'danger' | 'title'`（`'default'`）
- Slots：`default`（覆寫 text）
- 用途：清單單列。`variant="title"` 是標題列樣式。

---

## UI/Page（10）

### `<UIPageBreadcrumb>` — `components/UI/Page/Breadcrumb.vue`

- Props：`title: string`（必填）
- 用途：依 `useAppNavigation()` 與當前路由自動組麵包屑，附返回鈕。**`UIPageHeader` 已內含，一般不需自己放。**

### `<UIPageContent>` — `components/UI/Page/Content.vue`

- Props：無
- Slots：`default`
- 用途：白底圓角內容卡（`rounded-2xl border bg-white p-4`）。頁面主要內容都包在這裡。

### `<UIPageFooterButtonBox>` — `components/UI/Page/FooterButtonBox.vue`

- Props：無
- Slots：`default`
- 用途：頁尾按鈕列，行動裝置固定在畫面底部、桌機轉靜態。⚠️ 用了它，外層容器要加 `pb-28 max-md:pb-32` 留空間。

### `<UIPageHeader>` — `components/UI/Page/Header.vue`

- Props：`title: string`（必填）、`description?: string`
- Slots：`default`（右側動作區）
- ⚠️ 模板判斷 `$slots.actions || $slots.default` 但只渲染 `<slot />`。**傳 `#actions` 內容永遠不顯示，動作按鈕一律放 default slot。**
- 用途：頁面標題區（麵包屑 + h1 + 描述 + 右側動作）。慣例加 `class="mb-4"`。

### `<UIPageLoading>` — `components/UI/Page/Loading.vue`

- Props：`visible: boolean`（必填）
- 用途：畫面底部浮動「載入中…」膠囊。

### `<UIPageLogo>` — `components/UI/Page/Logo.vue`

- Props：`tone?: 'light' | 'dark'`（`'light'`）
- 用途：站台 Logo 連結，導向首頁。

### `<UIPageProgressSteps>` — `components/UI/Page/ProgressSteps.vue`

- Props：`current: 1 | 2 | 3`（必填）
- ⚠️ **步驟數與文案都寫死**（選擇項目／填寫資料／確認內容），不可設定。超過三步驟或要自訂文案 = 缺件。
- 用途：三步驟流程進度指示器。

### `<UIPageScreenBody>` — `components/UI/Page/ScreenBody.vue`

- Props：無
- Slots：`default`、`footer`
- 用途：限寬主體容器（`--container-page` = 800px），footer 貼底。流程頁用。

### `<UIPageSidebar>` — `components/UI/Page/Sidebar.vue`

- Props：無
- 用途：主側邊導覽（桌機可收合、行動版抽屜）。**`app.vue` 已放，頁面不要自己放。**狀態走 `useState('sidebar-collapsed' / 'sidebar-mobile-menu')`。

### `<UIPageTopNav>` — `components/UI/Page/TopNav.vue`

- Props：無
- 用途：頂部固定導覽列。**`app.vue` 已放，頁面不要自己放。**

---

## UI/Table 子目錄（3）

### `<UITableFilter>` — `components/UI/Table/Filter.vue`

- Props：無
- v-model：`boolean`（預設 `true`）— 展開狀態
- Slots：`default`（篩選表單內容）
- 用途：表格上方可展開／收合的篩選區，含高度過渡動畫。

### `<UITablePagination>` — `components/UI/Table/Pagination.vue`

- Props：`totalPages: number`（必填）、`maxVisiblePages?: number`（`6`）、`showPageJump?: boolean`（`false`）、`pageJumpSize?: number`（`5`）
- v-model：`number`（預設 `1`）— 當前頁碼
- 用途：分頁按鈕列。慣例放在 `UIPageContent` **外面**，加 `class="m-auto mt-5 w-fit"`。

### `<UITablePaginationInfo>` — `components/UI/Table/PaginationInfo.vue`

- Props：`currentPage: number`（必填）、`totalPages: number`（必填）、`totalItems: number`（必填）、`pageSizeOptions?: number[]`（`[10, 20, 50, 100]`）
- v-model：`number`（預設 `10`）— 每頁筆數
- 用途：分頁統計資訊 + 每頁筆數選擇器。放在 `UIPageContent` 內、表格上方。

---

## UI/Text（4）

### `<UITextIconItem>` — `components/UI/Text/IconItem.vue`

- Props：`icon: Component`（必填，**元件本身，要 import**）、`text: string`（必填）、`iconSize?: number`（`16`）
- 用途：圖示 + 文字的行內組合。

### `<UITextItem>` — `components/UI/Text/Item.vue`

- Props：`title: string`（必填）、`content: string`（必填）、`titleClass?: string`（`''`）、`contentClass?: string`（`''`）、`contentStrong?: boolean`（`false`）、`layout?: 'horizontal' | 'vertical'`（`'horizontal'`）
- 用途：`dt`/`dd` 形式的標題-內容對照列。

### `<UITextStatus>` — `components/UI/Text/Status.vue`

- Props：`title: string`（必填）、`message: string`（必填，支援 `\n` 換行）
- 用途：完成／成功結果頁的大型打勾動畫與訊息。

### `<UITextStatusTag>` — `components/UI/Text/StatusTag.vue`

- Props：`status: 'active' | 'complete' | 'inactive'`（必填）、`color?: 'primary' | 'secondary' | 'warning' | 'danger'`（未給則依 status 自動推導）、`size?: 'sm' | 'md'`（`'sm'`）
- ⚠️ **顯示文字寫死**：`active`→「進行中」、`complete`→「已完成」、`inactive`→「未啟用」。**無法自訂文案**。要「已核准／待審核／已作廢」這類狀態，得自己用 `<span>` 加 `bg-*-50 text-*-700 rounded-full px-2.5 py-1 text-xs font-bold` 手刻，或回報為缺件。
- 用途：狀態標籤膠囊。

<!-- COMPONENTS:END -->
