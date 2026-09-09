/** 扁鐵的原始輸入，欄位對應 components/Product/FlatBarForm.vue 的四個步驟 */
export interface FlatBarSource {
  sizeId: string
  lengthId: string
  processId: string
  holeCount: number
  holeEdgeCm: number
  holePitchCm: number
}

/** 鋼板彎折的原始輸入，欄位對應 components/Product/BendingForm.vue 的三個步驟 */
export interface BendingSource {
  groupId: string
  shapeId: string
  /**
   * 各段尺寸，key 是段代號（'A'、'B'…）。
   * 表單元件內部的 key 帶 shapeId 前綴（跨形狀切換時不互相污染），
   * 但一筆詢價只對應一個形狀，存進來時要把前綴拿掉。
   */
  segments: Record<string, string>
  quantity: number
}

/**
 * 加入當下的原始參數，供詢價單的「修改」重建填寫流程。
 *
 * 與 detail / summary / diagramSvg / diagramImages 的關係是單向的：
 * 那些是由 state 算出來的顯示字串，state 才是唯一的真相。
 * 所以任何寫入都必須整包重算（表單元件一律 emit 完整的
 * Omit<QuoteCartItem, 'id'>，呼叫端只做 addItem / updateItem），
 * 不可以只改其中一欄，否則會出現規格文字跟圖面對不起來的項目。
 *
 * 上傳的檔案刻意不放進來：File 物件沒有後端可傳，也無法序列化，
 * 編輯時只還原檔名字串顯示，要換檔就重新上傳。
 *
 * 選填：五個待補的品項頁還沒有對應的表單元件，沒有 source 的項目
 * 在詢價單上就不顯示「修改」鈕，其餘功能完全不受影響
 * （比照 diagramImages 的「選填 + 消費端自己判斷」約定）。
 * 新品項頁一律要帶——選填是為了讓還沒接編輯器的品項能先上線，不是可以省略。
 */
export type QuoteItemSource =
  | { productId: 'flat-bar'; state: FlatBarSource }
  | { productId: 'bending'; state: BendingSource }

/** 圖面的一張圖：來源路徑與圖說 */
export interface QuoteDiagramImage {
  /** public/ 底下的靜態圖路徑，如 /images/products/bending/cut-4/shape-1.png */
  src: string
  /** 圖說，如「彎折後外形」 */
  caption: string
}

export interface QuoteCartItem {
  id: number
  /** 品項，如「鋼板彎折」 */
  category: string
  /** 選擇摘要，如「四刀 第 1 種」 */
  summary: string
  /** 尺寸摘要，如「A 10cm、B 20cm」 */
  detail: string
  /** 數量，單位「支」 */
  quantity: number
  /**
   * 參考圖檔名，多個以「、」串接；沒有上傳時是空字串。
   * 檔案本身不上傳，只記檔名。
   * 詢價單表格刻意不顯示這欄——客戶自己填規格時就看過了，
   * 但匯出的 CSV 要留著，老闆才知道這筆有沒有附圖要跟客戶要。
   */
  attachmentName: string
  /**
   * 備註說明，客戶自由填寫；沒填時是空字串。
   * 與 attachmentName 一樣，詢價單表格刻意不顯示——客戶自己填規格時就看過了，
   * 但匯出的 CSV 要留著，老闆報價時才看得到客戶的特殊要求。
   */
  note: string
  /**
   * 加入當下的圖面快照，完整的 `<svg>` 標記字串；沒有圖的品項是空字串。
   *
   * 存字串而不是存孔位參數，是為了讓詢價單不必知道各品項頁怎麼畫圖——
   * 每個品項的圖都不一樣，存參數的話這裡就得為每種品項各留一組欄位。
   * 代價是圖不會再跟著重算，但這正是要的：客戶按下加入的那一刻看到什麼，
   * 詢價單就顯示什麼。
   *
   * 內容由本站自己的 template 產生，不是使用者輸入，所以 v-html 是安全的。
   */
  diagramSvg: string
  /**
   * 加入當下的靜態圖面，一到兩張（外形圖 + 展開圖／立體示意）；沒有靜態圖的品項省略。
   *
   * 與 diagramSvg 分成兩欄而不是共用一欄，因為兩者的本質不同：
   * diagramSvg 是依使用者輸入即時算出來的向量標記，這裡是固定的檔案路徑。
   * 混在同一欄（把 <img> 塞進 diagramSvg）會有三個問題：
   * 破壞該欄「內容是 svg」的契約、讓 [&>svg]:w-full 這類定尺寸的選擇器失效、
   * 而且程式無法列舉出「有哪些圖要等載入」——列印前的 waitForPrintImages()
   * （見 pages/quote-cart.vue）就做不到了。
   *
   * 選填：只有 svg 的品項頁不必為了它多傳一個空陣列。
   * 消費端一律用 `item.diagramImages?.length` 判斷，
   * 語意跟 diagramSvg 的「空字串 = 沒圖」是同一種約定。
   */
  diagramImages?: QuoteDiagramImage[]
  /**
   * 加入當下的原始輸入，供詢價單的「修改」把填寫流程重建回原本的樣子。
   *
   * 這不是拿來重算圖面的——顯示一律讀上面的 diagramSvg / diagramImages 快照，
   * source 只在使用者主動按「修改」時才被讀取。
   */
  source?: QuoteItemSource
}

/**
 * 「已加入詢價單」提示視窗的文字。
 * 兩個品項頁的組法一模一樣，放在這裡是因為它跟 QuoteCartItem 的欄位綁定。
 */
export const buildAddedText = (item: Omit<QuoteCartItem, 'id'>) => {
  // 檔名是用「、」串的，切回來就是個數
  const attachmentCount = item.attachmentName.split('、').filter(Boolean).length

  return `${item.summary}\n${item.detail}\n數量 ${item.quantity} 支${
    attachmentCount
      ? `\n參考圖檔 ${attachmentCount} 個：${item.attachmentName}`
      : ''
  }${item.note ? `\n備註：${item.note}` : ''}`
}

/**
 * 跨頁共用的詢價單。刻意存已組好的顯示字串而非原始值，
 * 這樣各品項頁的資料結構不同也能共用同一張表格。
 * 用 useState 保存，換頁不會消失，重整理才清空。
 */
export const useQuoteCart = () => {
  const items = useState<QuoteCartItem[]>('quote-cart-items', () => [])
  // id 計數器也要放 useState，用 module-level 變數在 SSR 下會跨請求共用
  const nextId = useState<number>('quote-cart-next-id', () => 1)

  /**
   * 這次要送出／匯出哪幾項。比照購物車的勾選：清單是「我收集了什麼」，
   * 勾選是「這次要結帳哪些」，東西都留著但只送打了勾的。
   *
   * 存 id 而不是存整筆：項目被「修改」時 id 不變，勾選就自動跟著，
   * 存物件的話還要比對內容。
   *
   * 跟清單放同一個 composable（而不是像 useQuoteContact 那樣分出去），
   * 是因為兩者生命週期完全綁在一起——刪項目要清它的勾、清空要清全部。
   * 分開的話這些同步就得由每個呼叫端自己記得做。
   */
  const selectedIds = useState<number[]>('quote-selected-ids', () => [])

  const count = computed(() => items.value.length)

  /** 回傳新項目的 id，讓呼叫端能接著操作它（「送出詢價」要只勾這一項） */
  const addItem = (item: Omit<QuoteCartItem, 'id'>) => {
    const id = nextId.value

    items.value = [...items.value, { ...item, id }]
    // 加進來的預設就勾選——客戶按「加入詢價」的意思就是這項要詢
    selectedIds.value = [...selectedIds.value, id]
    nextId.value += 1

    return id
  }

  /**
   * 就地覆蓋一筆，id 不變——項次是使用者的心智錨點，
   * 改個孔數不該讓那一列跳到最後面去。
   * 找不到 id 就整個陣列原樣返回（map 天然如此）。
   */
  const updateItem = (id: number, item: Omit<QuoteCartItem, 'id'>) => {
    items.value = items.value.map((existing) =>
      existing.id === id ? { ...item, id } : existing,
    )
  }

  const removeItem = (id: number) => {
    items.value = items.value.filter((item) => item.id !== id)
    // 一定要一起清：留下指向不存在項目的 id，會讓 isAllSelected 的
    // 「勾選數 === 項目數」永遠不成立，全選框從此卡在半勾狀態
    selectedIds.value = selectedIds.value.filter(
      (selectedId) => selectedId !== id,
    )
  }

  const clearItems = () => {
    items.value = []
    selectedIds.value = []
  }

  // ---- 勾選 ----

  const selectedItems = computed(() =>
    items.value.filter((item) => selectedIds.value.includes(item.id)),
  )

  const selectedCount = computed(() => selectedItems.value.length)

  const isSelected = (id: number) => selectedIds.value.includes(id)

  const toggleSelected = (id: number) => {
    selectedIds.value = isSelected(id)
      ? selectedIds.value.filter((selectedId) => selectedId !== id)
      : [...selectedIds.value, id]
  }

  // 空清單不算全選，否則沒東西時全選框會顯示成打勾
  const isAllSelected = computed(
    () => items.value.length > 0 && selectedCount.value === items.value.length,
  )

  /** 勾了一部分——全選框要顯示成「—」而不是空的 */
  const isPartlySelected = computed(
    () => selectedCount.value > 0 && !isAllSelected.value,
  )

  const toggleAll = () => {
    selectedIds.value = isAllSelected.value
      ? []
      : items.value.map((item) => item.id)
  }

  /**
   * 只勾這一項，其餘全部取消——品項頁「送出詢價」用。
   * 對應購物網站的「直接購買」：商品照樣進購物車，
   * 只是幫使用者先勾好那一項，原本收集的項目都還在（只是沒打勾）。
   */
  const selectOnly = (id: number) => {
    selectedIds.value = [id]
  }

  // 產生假單號，格式沿用 quote-builder
  const makeOrderNo = () => {
    const now = new Date()
    const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
    const random = String(Math.floor(Math.random() * 900) + 100)

    return `Q${stamp}-${random}`
  }

  const buildRows = (rows: QuoteCartItem[]) => {
    const header = ['項次', '品項', '選擇', '規格', '數量', '參考圖檔', '備註']
    // 數量帶單位而非純數字——CSV 是給人看的，不是給程式 parse 的
    const body = rows.map((item, index) => [
      String(index + 1),
      item.category,
      item.summary,
      item.detail,
      `${item.quantity} 支`,
      item.attachmentName,
      item.note,
    ])

    return [header, ...body]
  }

  const escapeCsv = (value: string) =>
    /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value

  /**
   * 匯出 CSV，回傳要顯示給使用者的訊息。
   *
   * rows 刻意必填而不是預設讀 items——要匯出的是「勾選的那些」，
   * 不是整個清單。給預設值的話忘記傳參會靜默匯出錯的資料，
   * 必填則是編譯期就報錯。
   */
  const exportCsv = (rows: QuoteCartItem[]) => {
    if (!rows.length) {
      return '詢價單目前是空的，沒有可匯出的資料。'
    }

    const csv = buildRows(rows)
      .map((row) => row.map(escapeCsv).join(','))
      .join('\r\n')

    // BOM 讓 Excel 正確辨識 UTF-8，否則中文會亂碼
    const blob = new Blob([`﻿${csv}`], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const orderNo = makeOrderNo()

    link.href = url
    link.download = `詢價單_${orderNo}.csv`
    link.click()
    URL.revokeObjectURL(url)

    return `已匯出 詢價單_${orderNo}.csv，共 ${rows.length} 項。`
  }

  return {
    items,
    count,
    addItem,
    updateItem,
    removeItem,
    clearItems,
    selectedItems,
    selectedCount,
    isSelected,
    toggleSelected,
    isAllSelected,
    isPartlySelected,
    toggleAll,
    selectOnly,
    makeOrderNo,
    exportCsv,
  }
}
