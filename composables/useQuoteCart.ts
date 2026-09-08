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

  const count = computed(() => items.value.length)

  const addItem = (item: Omit<QuoteCartItem, 'id'>) => {
    items.value = [...items.value, { ...item, id: nextId.value }]
    nextId.value += 1
  }

  const removeItem = (id: number) => {
    items.value = items.value.filter((item) => item.id !== id)
  }

  const clearItems = () => {
    items.value = []
  }

  // 產生假單號，格式沿用 quote-builder
  const makeOrderNo = () => {
    const now = new Date()
    const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
    const random = String(Math.floor(Math.random() * 900) + 100)

    return `Q${stamp}-${random}`
  }

  const buildRows = () => {
    const header = ['項次', '品項', '選擇', '規格', '數量', '參考圖檔', '備註']
    // 數量帶單位而非純數字——CSV 是給人看的，不是給程式 parse 的
    const body = items.value.map((item, index) => [
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

  /** 匯出 CSV，回傳要顯示給使用者的訊息 */
  const exportCsv = () => {
    if (!items.value.length) {
      return '詢價單目前是空的，沒有可匯出的資料。'
    }

    const csv = buildRows()
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

    return `已匯出 詢價單_${orderNo}.csv，共 ${items.value.length} 項。`
  }

  return {
    items,
    count,
    addItem,
    removeItem,
    clearItems,
    makeOrderNo,
    exportCsv,
  }
}
