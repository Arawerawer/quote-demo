export interface QuoteCartItem {
  id: number
  /** 品項，如「鋼板彎折」 */
  category: string
  /** 選擇摘要，如「四刀 第 1 款」 */
  summary: string
  /** 尺寸摘要，如「A 10cm、B 20cm」 */
  detail: string
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
    const header = ['項次', '品項', '選擇', '尺寸']
    const body = items.value.map((item, index) => [
      String(index + 1),
      item.category,
      item.summary,
      item.detail,
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
