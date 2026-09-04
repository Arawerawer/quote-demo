<script setup lang="ts">
// 等邊角鐵規格表（A = B，單位 mm）
const SPEC_TABLE = [
  { value: 'L25x25x3', label: 'L25×25×3', a: 25, t: 3 },
  { value: 'L30x30x3', label: 'L30×30×3', a: 30, t: 3 },
  { value: 'L40x40x3', label: 'L40×40×3', a: 40, t: 3 },
  { value: 'L40x40x5', label: 'L40×40×5', a: 40, t: 5 },
  { value: 'L50x50x4', label: 'L50×50×4', a: 50, t: 4 },
  { value: 'L50x50x5', label: 'L50×50×5', a: 50, t: 5 },
  { value: 'L60x60x5', label: 'L60×60×5', a: 60, t: 5 },
  { value: 'L65x65x6', label: 'L65×65×6', a: 65, t: 6 },
  { value: 'L75x75x6', label: 'L75×75×6', a: 75, t: 6 },
  { value: 'L75x75x9', label: 'L75×75×9', a: 75, t: 9 },
  { value: 'L90x90x7', label: 'L90×90×7', a: 90, t: 7 },
  { value: 'L100x100x7', label: 'L100×100×7', a: 100, t: 7 },
  { value: 'L100x100x10', label: 'L100×100×10', a: 100, t: 10 },
]

// 原材長度上限
const RAW_LENGTH = 6000

const UNIT_OPTIONS = [
  { label: 'mm', value: 'mm', factor: 1 },
  { label: 'cm', value: 'cm', factor: 10 },
  { label: '台尺', value: 'tw', factor: 303.03 },
  { label: 'M', value: 'm', factor: 1000 },
]

const MATERIAL_OPTIONS = [
  { label: 'SS400 黑鐵', value: 'ss400' },
  { label: 'SUS304 白鐵', value: 'sus304' },
]

const PROCESS_OPTIONS = [
  { label: '不需加工', value: 'none' },
  { label: '鋸切', value: 'saw' },
  { label: '需折彎', value: 'bend' },
  { label: '需鑽孔', value: 'drill' },
  { label: '需焊接', value: 'weld' },
  { label: '其他', value: 'other' },
]

// 各加工方式的說明，顯示在下拉欄位下方
const PROCESS_NOTES: Record<string, string> = {
  none: '原材直接出貨，不做任何裁切或加工。',
  saw: '依 L 長度裁切，斷面不另做去毛邊處理。',
  bend: '請於下方「加工說明」註明折彎角度與位置，必要時附上圖面。',
  drill: '於下方設定孔徑、打孔面與孔位排列，系統會即時檢查孔位是否可行。',
  weld: '請於下方「加工說明」註明焊接位置與型式，建議附上圖面。',
  other: '請於下方「加工說明」詳述需求並附圖面，我們會另行評估報價。',
}

const HOLE_SIDE_OPTIONS = [
  { label: 'A 面', value: 'a' },
  { label: 'B 面', value: 'b' },
  { label: '兩面都要', value: 'both' },
]

const HOLE_LAYOUT_OPTIONS = [
  { label: '等距均分', value: 'even' },
  { label: '指定端距與節距', value: 'fixed' },
  { label: '不規則（依圖面）', value: 'irregular' },
]

const URGENCY_OPTIONS = [
  { label: '一般', value: 'normal' },
  { label: '急件（請來電確認）', value: 'urgent' },
]

// 上傳限制
const ACCEPT_EXT = ['dxf', 'dwg', 'pdf', 'jpg', 'jpeg', 'png']
const MAX_FILE_SIZE = 10 * 1024 * 1024
const MAX_FILE_COUNT = 5

interface QuoteFile {
  name: string
  size: number
  kind: 'pdf' | 'image' | 'cad'
}

interface QuoteItem {
  id: number
  spec: string
  material: string
  lengthMm: number
  qty: number
  process: string
  scrap: boolean
  files: QuoteFile[]
}

// 目前編輯中的項目
const spec = ref('L50x50x5')
const material = ref('ss400')
const length = ref<number | undefined>(1500)
const unit = ref('mm')
const qty = ref<number | undefined>(10)
const process = ref('saw')

// 鑽孔設定
const holeDia = ref<number | undefined>(12)
const holeSide = ref('a')
const holeLayout = ref('even')
const holeCount = ref<number | undefined>(6)
const holeEdge = ref<number | undefined>(50)
const holePitch = ref<number | undefined>(200)
const holeIrregular = ref('')

const processNote = ref('')
const files = ref<QuoteFile[]>([])
const fileError = ref('')
const isDragging = ref(false)
const keepScrap = ref(true)

// 訂單層級
const orderDate = ref('')
const todayIso = ref('')
const urgency = ref('normal')
const orderNote = ref('')

const items = ref<QuoteItem[]>([])
const exportMessage = ref('')
const submitError = ref('')
const submitSuccess = ref('')

const fileInput = useTemplateRef('fileInput')
const noteInput = useTemplateRef('noteInput')

let nextItemId = 1

const toIsoDate = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// 日期預設值延到 onMounted，避免伺服器與瀏覽器時間不一致
onMounted(() => {
  const now = new Date()
  todayIso.value = toIsoDate(now)
  const week = new Date(now)
  week.setDate(week.getDate() + 7)
  orderDate.value = toIsoDate(week)
})

const currentSpec = computed(
  () => SPEC_TABLE.find((row) => row.value === spec.value) ?? SPEC_TABLE[5],
)

const unitFactor = computed(
  () => UNIT_OPTIONS.find((row) => row.value === unit.value)?.factor ?? 1,
)

const lengthMm = computed(() =>
  Math.round((length.value ?? 0) * unitFactor.value),
)

const holeRadius = computed(() => (holeDia.value ?? 0) / 2)

const isDrilling = computed(() => process.value === 'drill')

const processLabel = computed(
  () => PROCESS_OPTIONS.find((row) => row.value === process.value)?.label ?? '',
)

const processHint = computed(() => PROCESS_NOTES[process.value] ?? '')

// 孔位軸向座標（mm）
const holePositions = computed<number[]>(() => {
  if (!isDrilling.value || holeLayout.value === 'irregular') return []

  const n = holeCount.value ?? 0
  const L = lengthMm.value
  if (n <= 0 || L <= 0) return []

  if (holeLayout.value === 'even') {
    const p = L / (n + 1)
    return Array.from({ length: n }, (_, i) => (i + 1) * p)
  }

  const e = holeEdge.value ?? 0
  const p = holePitch.value ?? 0
  return Array.from({ length: n }, (_, i) => e + i * p)
})

// 等距均分模式下自動算出的節距與端距
const evenPitch = computed(() => {
  const n = holeCount.value ?? 0
  if (n <= 0 || lengthMm.value <= 0) return 0
  return lengthMm.value / (n + 1)
})

const lengthError = computed(() => {
  if (lengthMm.value <= 0) return '請輸入長度'
  if (lengthMm.value > RAW_LENGTH) return '超過 6M 原材長度，需訂製或分段接合'
  return ''
})

const qtyError = computed(() => ((qty.value ?? 0) <= 0 ? '請輸入數量' : ''))

const holeDiaError = computed(() => {
  if (!isDrilling.value) return ''
  return (holeDia.value ?? 0) <= 0 ? '請輸入孔徑' : ''
})

const holeCountError = computed(() => {
  // 不規則模式的孔位依圖面，不檢查孔數
  if (!isDrilling.value || holeLayout.value === 'irregular') return ''
  return (holeCount.value ?? 0) <= 0 ? '請輸入孔數' : ''
})

// 孔徑不可超過邊長，否則孔會吃穿整片板
const holeDiaFitError = computed(() => {
  if (!isDrilling.value) return ''

  const dia = holeDia.value ?? 0
  const { a } = currentSpec.value
  if (dia > 0 && dia >= a)
    return `孔徑 ${dia}mm 不小於邊長 ${a}mm，孔會吃穿整片板`
  return ''
})

// 節距小於孔徑時孔會相交，兩種排列模式都要檢查
const holePitchError = computed(() => {
  if (!isDrilling.value || holeLayout.value === 'irregular') return ''

  const n = holeCount.value ?? 0
  const dia = holeDia.value ?? 0
  if (n <= 1 || dia <= 0) return ''

  const p =
    holeLayout.value === 'even' ? evenPitch.value : (holePitch.value ?? 0)
  if (p > 0 && p < dia)
    return `節距 ${Math.round(p)}mm 小於孔徑 ${dia}mm，孔會重疊`
  return ''
})

const holePositionError = computed(() => {
  if (!isDrilling.value || holeLayout.value !== 'fixed') return ''

  const e = holeEdge.value ?? 0
  const p = holePitch.value ?? 0
  const n = holeCount.value ?? 0
  if (n <= 0) return ''

  if (n > 1 && p <= 0) return '請輸入節距 p'

  const last = e + (n - 1) * p
  if (last > lengthMm.value)
    return `孔位超出長度：末孔在 ${Math.round(last)}mm，超過 ${lengthMm.value}mm`
  return ''
})

const canAddItem = computed(
  () =>
    !lengthError.value &&
    !qtyError.value &&
    !holeDiaError.value &&
    !holeDiaFitError.value &&
    !holeCountError.value &&
    !holePitchError.value &&
    !holePositionError.value,
)

// 加工方式摘要，清單與匯出共用
const processSummary = (item: QuoteItem) => item.process

const currentProcessLabel = computed(() => {
  const base = processLabel.value
  if (!isDrilling.value) return base

  const side =
    HOLE_SIDE_OPTIONS.find((row) => row.value === holeSide.value)?.label ?? ''
  const n = holePositions.value.length
  const note = holeIrregular.value.trim()
  const detail =
    holeLayout.value === 'irregular'
      ? note
        ? `不規則：${note}`
        : '不規則依圖面'
      : `${n} 孔`
  return `${base}（Ø${holeDia.value ?? 0}，${side}，${detail}）`
})

// ---- 孔位預覽圖座標 ----

const isFaceOn = (face: 'a' | 'b') =>
  holeSide.value === face || holeSide.value === 'both'

// 點 3D 圖選面，與「打在哪一面」下拉雙向連動。
// 點已選中的面 = 取消它；點未選的面 = 加上它。至少要留一面。
const selectFace = (face: 'a' | 'b') => {
  const other = face === 'a' ? 'b' : 'a'

  if (holeSide.value === 'both') {
    holeSide.value = other
    return
  }
  if (holeSide.value === face) return
  holeSide.value = 'both'
}

// 側視圖比例：把長度 L 映射到 320 個 SVG 單位
const sideScale = computed(() =>
  lengthMm.value > 0 ? 320 / lengthMm.value : 0,
)

const sideHoles = computed(() =>
  holePositions.value.map((pos) => ({
    cx: 20 + pos * sideScale.value,
    // 孔徑太小會看不見，設下限；圖上已註明未按比例
    r: Math.max(holeRadius.value * sideScale.value, 2.5),
  })),
)

const previewSummary = computed(() => {
  const side =
    HOLE_SIDE_OPTIONS.find((row) => row.value === holeSide.value)?.label ?? ''
  if (holeLayout.value === 'irregular')
    return `Ø${holeDia.value ?? 0}，${side}，孔位依圖面`
  return `Ø${holeDia.value ?? 0} × ${holePositions.value.length} 孔，${side}`
})

// 末孔到尾端的距離
const tailDistance = computed(() => {
  const positions = holePositions.value
  if (!positions.length) return 0
  return Math.max(lengthMm.value - positions[positions.length - 1], 0)
})

const displayEdge = computed(() =>
  holeLayout.value === 'even' ? evenPitch.value : (holeEdge.value ?? 0),
)

const displayPitch = computed(() =>
  holeLayout.value === 'even' ? evenPitch.value : (holePitch.value ?? 0),
)

// ---- 加工說明：符號插入與自動轉換 ----

const normalizeNote = (value: string) =>
  value.replace(/\b[dD](?=\d)/g, 'Ø').replace(/\+-(?=\d)/g, '±')

const handleNoteInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const start = target.selectionStart ?? target.value.length
  const converted = normalizeNote(target.value)

  if (converted === target.value) {
    processNote.value = target.value
    return
  }

  // 轉換後長度會變，游標位置要跟著校正
  const diff = target.value.length - converted.length
  processNote.value = converted
  nextTick(() => {
    const el = noteInput.value?.$el as HTMLInputElement | undefined
    el?.setSelectionRange(start - diff, start - diff)
  })
}

const insertSymbol = (symbol: string) => {
  const el = noteInput.value?.$el as HTMLInputElement | undefined
  const value = processNote.value
  const start = el?.selectionStart ?? value.length
  const end = el?.selectionEnd ?? value.length

  processNote.value = value.slice(0, start) + symbol + value.slice(end)

  nextTick(() => {
    el?.focus()
    el?.setSelectionRange(start + symbol.length, start + symbol.length)
  })
}

// ---- 圖面上傳 ----

const fileKind = (name: string): QuoteFile['kind'] => {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'pdf') return 'pdf'
  if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') return 'image'
  return 'cad'
}

const fileIcon = (kind: QuoteFile['kind']) => {
  if (kind === 'pdf') return 'FileText'
  if (kind === 'image') return 'Image'
  return 'FileBox'
}

const formatSize = (size: number) => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

const addFiles = (incoming: FileList | null | undefined) => {
  if (!incoming?.length) return

  fileError.value = ''
  const errors: string[] = []

  for (const file of Array.from(incoming)) {
    if (files.value.length >= MAX_FILE_COUNT) {
      errors.push(`每個項目最多 ${MAX_FILE_COUNT} 個檔案`)
      break
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!ACCEPT_EXT.includes(ext)) {
      errors.push(`${file.name}：格式不支援`)
      continue
    }

    if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name}：超過 10MB`)
      continue
    }

    // Demo 不真的上傳，只記檔名與大小
    files.value.push({
      name: file.name,
      size: file.size,
      kind: fileKind(file.name),
    })
  }

  if (errors.length) fileError.value = errors.join('、')
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  addFiles(target.files)
  // 清空才能重複選同一個檔案
  target.value = ''
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  addFiles(event.dataTransfer?.files)
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
  fileError.value = ''
}

// ---- 詢價清單 ----

const addItem = () => {
  if (!canAddItem.value) return

  items.value.push({
    id: nextItemId++,
    spec: currentSpec.value.label,
    material:
      MATERIAL_OPTIONS.find((row) => row.value === material.value)?.label ?? '',
    lengthMm: lengthMm.value,
    qty: qty.value ?? 0,
    process: currentProcessLabel.value,
    scrap: keepScrap.value,
    files: files.value,
  })

  // 檔案綁在該項目上，加入後上傳區清空
  files.value = []
  fileError.value = ''
  exportMessage.value = ''
  submitSuccess.value = ''
  submitError.value = ''
}

const removeItem = (id: number) => {
  items.value = items.value.filter((item) => item.id !== id)
}

const clearItems = () => {
  items.value = []
  exportMessage.value = ''
  submitSuccess.value = ''
}

const totalFiles = computed(() =>
  items.value.reduce((sum, item) => sum + item.files.length, 0),
)

// 產生假單號
const makeOrderNo = () => {
  const now = new Date()
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const random = String(Math.floor(Math.random() * 900) + 100)
  return `Q${stamp}-${random}`
}

// CSV 與剪貼簿共用同一份資料，避免兩處格式走鐘
const buildRows = () => {
  const header = [
    '項次',
    '規格',
    '材質',
    '長度(mm)',
    '數量(支)',
    '加工方式',
    '餘料',
    '附件',
  ]

  const body = items.value.map((item, index) => [
    String(index + 1),
    item.spec,
    item.material,
    String(item.lengthMm),
    String(item.qty),
    processSummary(item),
    item.scrap ? '需要取回' : '不需取回',
    item.files.map((file) => file.name).join(' / '),
  ])

  return [header, ...body]
}

const escapeCsv = (value: string) =>
  /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value

const exportCsv = () => {
  if (!items.value.length) {
    exportMessage.value = '清單目前是空的，沒有可匯出的資料。'
    return
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

  exportMessage.value = `已匯出 詢價單_${orderNo}.csv，共 ${items.value.length} 項。`
}

const copyTable = async () => {
  if (!items.value.length) {
    exportMessage.value = '清單目前是空的，沒有可複製的資料。'
    return
  }

  const text = buildRows()
    .map((row) => row.join('\t'))
    .join('\n')

  try {
    await navigator.clipboard.writeText(text)
    exportMessage.value = '已複製，直接在 Excel 按 Ctrl+V 貼上'
  } catch {
    exportMessage.value = '複製失敗，請確認瀏覽器已允許存取剪貼簿。'
  }
}

const submitQuote = () => {
  exportMessage.value = ''

  if (!items.value.length) {
    submitSuccess.value = ''
    submitError.value = '詢價清單是空的，請先加入至少一個項目。'
    return
  }

  submitError.value = ''
  submitSuccess.value = `詢價單 ${makeOrderNo()} 已送出，共 ${items.value.length} 項、附圖 ${totalFiles.value} 個，希望交期 ${orderDate.value}。我們會盡快與您聯繫。`
}
</script>

<template>
  <div class="mx-auto w-[min(100%,1180px)] p-6 max-md:p-4">
    <UIPageHeader
      title="角鐵線上詢價"
      description="選規格、填長度數量、設定加工方式，逐項加入詢價清單後即可匯出或送出。"
      class="mb-4"
    />

    <div class="grid gap-6">
      <!-- 規格、示意圖與加工方式 -->
      <UIPageContent class="flex flex-col gap-6">
        <div>
          <h2 class="text-brand-900 m-0 text-xl font-bold">規格與加工</h2>
          <p class="text-nurse-600 m-0 mt-1 text-sm">
            圖中代號 A、B 為兩邊長，t 為厚度，L
            為裁切長度。選「需鑽孔」時會展開孔位設定與預覽圖。
          </p>
        </div>

        <!-- 靜態等角投影示意圖，僅用來說明代號位置 -->
        <div
          class="border-nurse-200 overflow-hidden rounded-xl border bg-white p-4"
        >
          <svg
            viewBox="28 -12 535 318"
            class="mx-auto h-auto w-[min(100%,620px)]"
            role="img"
            aria-label="角鐵立體示意圖，標示 A 邊長、B 邊長、t 厚度與 L 長度"
          >
            <!-- 遠端 L 斷面 -->
            <polygon
              points="425,125 535,125 535,111 439,111 439,15 425,15"
              fill="var(--color-brand-100)"
              stroke="var(--color-brand-600)"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
            <!-- 左外側面 -->
            <polygon
              points="95,235 95,125 425,15 425,125"
              fill="var(--color-brand-200)"
              stroke="var(--color-brand-600)"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
            <!-- 垂直邊頂面 -->
            <polygon
              points="95,125 109,125 439,15 425,15"
              fill="var(--color-brand-300)"
              stroke="var(--color-brand-600)"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
            <!-- 內側面 -->
            <polygon
              points="109,125 109,221 439,111 439,15"
              fill="var(--color-brand-200)"
              stroke="var(--color-brand-600)"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
            <!-- 水平邊頂面 -->
            <polygon
              points="109,221 205,221 535,111 439,111"
              fill="var(--color-brand-300)"
              stroke="var(--color-brand-600)"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
            <!-- 右端面 -->
            <polygon
              points="205,221 205,235 535,125 535,111"
              fill="var(--color-brand-200)"
              stroke="var(--color-brand-600)"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
            <!-- 近端 L 斷面 -->
            <polygon
              points="95,235 205,235 205,221 109,221 109,125 95,125"
              fill="var(--color-brand-400)"
              stroke="var(--color-brand-700)"
              stroke-width="1.5"
              stroke-linejoin="round"
            />

            <!-- A：垂直邊長 -->
            <line
              x1="95"
              y1="125"
              x2="60"
              y2="125"
              stroke="var(--color-nurse-500)"
              stroke-width="1"
              stroke-dasharray="4 3"
            />
            <line
              x1="95"
              y1="235"
              x2="60"
              y2="235"
              stroke="var(--color-nurse-500)"
              stroke-width="1"
              stroke-dasharray="4 3"
            />
            <line
              x1="68"
              y1="125"
              x2="68"
              y2="235"
              stroke="var(--color-nurse-500)"
              stroke-width="1"
            />
            <text
              x="56"
              y="186"
              text-anchor="end"
              font-size="20"
              font-weight="bold"
              fill="var(--color-brand-800)"
            >
              A
            </text>

            <!-- B：水平邊長 -->
            <line
              x1="95"
              y1="235"
              x2="95"
              y2="272"
              stroke="var(--color-nurse-500)"
              stroke-width="1"
              stroke-dasharray="4 3"
            />
            <line
              x1="205"
              y1="235"
              x2="205"
              y2="272"
              stroke="var(--color-nurse-500)"
              stroke-width="1"
              stroke-dasharray="4 3"
            />
            <line
              x1="95"
              y1="264"
              x2="205"
              y2="264"
              stroke="var(--color-nurse-500)"
              stroke-width="1"
            />
            <text
              x="150"
              y="288"
              text-anchor="middle"
              font-size="20"
              font-weight="bold"
              fill="var(--color-brand-800)"
            >
              B
            </text>

            <!-- t：厚度，引線指向水平邊的斷面厚度 -->
            <line
              x1="205"
              y1="228"
              x2="268"
              y2="272"
              stroke="var(--color-nurse-500)"
              stroke-width="1"
              stroke-dasharray="4 3"
            />
            <text
              x="276"
              y="278"
              font-size="20"
              font-weight="bold"
              fill="var(--color-brand-800)"
            >
              t
            </text>

            <!-- L：長度，引線指向頂稜線中點 -->
            <line
              x1="260"
              y1="70"
              x2="260"
              y2="34"
              stroke="var(--color-nurse-500)"
              stroke-width="1"
              stroke-dasharray="4 3"
            />
            <text
              x="260"
              y="26"
              text-anchor="middle"
              font-size="20"
              font-weight="bold"
              fill="var(--color-brand-800)"
            >
              L
            </text>
          </svg>
        </div>

        <!-- 四格唯讀資訊卡 -->
        <div class="grid grid-cols-4 gap-3 max-md:grid-cols-2">
          <div
            class="border-nurse-200 bg-brand-50 text-brand-700 rounded-lg border p-4 text-center"
          >
            <p class="m-0 text-xs font-bold">A 邊長</p>
            <p class="m-0 mt-1 text-2xl font-black">
              {{ currentSpec.a }}
              <span class="text-sm font-bold">mm</span>
            </p>
          </div>
          <div
            class="border-nurse-200 bg-brand-50 text-brand-700 rounded-lg border p-4 text-center"
          >
            <p class="m-0 text-xs font-bold">B 邊長</p>
            <p class="m-0 mt-1 text-2xl font-black">
              {{ currentSpec.a }}
              <span class="text-sm font-bold">mm</span>
            </p>
          </div>
          <div
            class="border-nurse-200 bg-brand-50 text-brand-700 rounded-lg border p-4 text-center"
          >
            <p class="m-0 text-xs font-bold">t 厚度</p>
            <p class="m-0 mt-1 text-2xl font-black">
              {{ currentSpec.t }}
              <span class="text-sm font-bold">mm</span>
            </p>
          </div>
          <div
            class="border-nurse-200 bg-brand-50 text-brand-700 rounded-lg border p-4 text-center"
          >
            <p class="m-0 text-xs font-bold">L 長度</p>
            <p class="m-0 mt-1 text-2xl font-black">
              {{ lengthMm }}
              <span class="text-sm font-bold">mm</span>
            </p>
          </div>
        </div>

        <!-- 基本規格欄位 -->
        <UIGrid>
          <UIGridItem sm="12" md="6">
            <UIFormGroup label="規格" star>
              <UIFormSelect
                v-model="spec"
                :options="SPEC_TABLE"
                placeholder=""
              />
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem sm="12" md="6">
            <UIFormGroup label="材質" star>
              <UIFormSelect
                v-model="material"
                :options="MATERIAL_OPTIONS"
                placeholder=""
              />
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem sm="12" md="6">
            <UIFormGroup
              label="L 長度"
              star
              :warning="!!lengthError"
              :warning-text="lengthError"
            >
              <UIFormNumber
                v-model="length"
                :min="0"
                :warning="!!lengthError"
                placeholder="請輸入長度"
              />
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem sm="12" md="6">
            <UIFormGroup label="單位" star>
              <UIFormSelect
                v-model="unit"
                :options="UNIT_OPTIONS"
                placeholder=""
              />
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem sm="12" md="6">
            <UIFormGroup label="加工方式" star>
              <UIFormSelect
                v-model="process"
                :options="PROCESS_OPTIONS"
                placeholder=""
              />
              <!-- 說明掛在欄位下方，避免唯讀文字被誤認成可填欄位 -->
              <template #slot-after>
                <p class="text-nurse-600 m-0 text-sm leading-6">
                  {{ processHint }}
                </p>
              </template>
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem sm="12" md="4">
            <UIFormGroup
              label="數量"
              star
              :warning="!!qtyError"
              :warning-text="qtyError"
            >
              <UIFormInputUnit
                v-model="qty"
                type="number"
                suffix="支"
                :min="0"
                :warning="!!qtyError"
                placeholder="請輸入數量"
              />
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem sm="12" md="2">
            <UIFormGroup label="餘料">
              <div class="flex h-11 items-center">
                <UIFormCheckbox v-model="keepScrap" label="需要餘料取回" />
              </div>
            </UIFormGroup>
          </UIGridItem>
        </UIGrid>

        <!-- 鑽孔設定，僅在選「需鑽孔」時顯示 -->
        <div
          v-if="isDrilling"
          class="border-nurse-200 bg-desert-50 flex flex-col gap-6 rounded-xl border p-4"
        >
          <h3 class="text-brand-900 m-0 text-base font-bold">鑽孔設定</h3>

          <UIGrid>
            <UIGridItem sm="12" md="4">
              <UIFormGroup
                label="孔徑 Ø"
                star
                :warning="!!holeDiaError || !!holeDiaFitError"
                :warning-text="holeDiaError || holeDiaFitError"
              >
                <UIFormInputUnit
                  v-model="holeDia"
                  type="number"
                  suffix="mm"
                  :min="0"
                  :warning="!!holeDiaError || !!holeDiaFitError"
                />
              </UIFormGroup>
            </UIGridItem>

            <UIGridItem sm="12" md="4">
              <UIFormGroup label="打在哪一面" star>
                <UIFormSelect
                  v-model="holeSide"
                  :options="HOLE_SIDE_OPTIONS"
                  placeholder=""
                />
              </UIFormGroup>
            </UIGridItem>

            <UIGridItem sm="12" md="4">
              <UIFormGroup label="孔位排列" star>
                <UIFormSelect
                  v-model="holeLayout"
                  :options="HOLE_LAYOUT_OPTIONS"
                  placeholder=""
                />
              </UIFormGroup>
            </UIGridItem>

            <!-- 等距均分：只要孔數，端距與節距自動算 -->
            <template v-if="holeLayout === 'even'">
              <UIGridItem sm="12" md="4">
                <UIFormGroup
                  label="孔數 n"
                  star
                  :warning="!!holeCountError || !!holePitchError"
                  :warning-text="holeCountError || holePitchError"
                >
                  <UIFormInputUnit
                    v-model="holeCount"
                    type="number"
                    suffix="孔"
                    :min="0"
                    :warning="!!holeCountError || !!holePitchError"
                  />
                </UIFormGroup>
              </UIGridItem>
              <UIGridItem sm="12" md="8">
                <UIFormGroup label="自動計算">
                  <p class="text-nurse-600 m-0 py-2.5 text-sm">
                    節距 p ＝ L ÷ (n＋1) ＝
                    <span class="text-brand-700 font-bold">
                      {{ Math.round(evenPitch) }}mm
                    </span>
                    ，端距 e 同為
                    <span class="text-brand-700 font-bold">
                      {{ Math.round(evenPitch) }}mm
                    </span>
                  </p>
                </UIFormGroup>
              </UIGridItem>
            </template>

            <!-- 指定端距與節距 -->
            <template v-else-if="holeLayout === 'fixed'">
              <UIGridItem sm="12" md="4">
                <UIFormGroup
                  label="e 端距"
                  star
                  :warning="!!holePositionError"
                  :warning-text="holePositionError"
                >
                  <UIFormInputUnit
                    v-model="holeEdge"
                    type="number"
                    suffix="mm"
                    :min="0"
                    :warning="!!holePositionError"
                  />
                </UIFormGroup>
              </UIGridItem>
              <UIGridItem sm="12" md="4">
                <UIFormGroup
                  label="p 節距"
                  star
                  :warning="!!holePositionError || !!holePitchError"
                  :warning-text="holePitchError"
                >
                  <UIFormInputUnit
                    v-model="holePitch"
                    type="number"
                    suffix="mm"
                    :min="0"
                    :warning="!!holePositionError || !!holePitchError"
                  />
                </UIFormGroup>
              </UIGridItem>
              <UIGridItem sm="12" md="4">
                <UIFormGroup
                  label="孔數 n"
                  star
                  :warning="!!holePositionError || !!holeCountError"
                  :warning-text="holeCountError"
                >
                  <UIFormInputUnit
                    v-model="holeCount"
                    type="number"
                    suffix="孔"
                    :min="0"
                    :warning="!!holePositionError || !!holeCountError"
                  />
                </UIFormGroup>
              </UIGridItem>
            </template>

            <!-- 不規則：改用文字描述，並提示上傳圖面 -->
            <template v-else>
              <UIGridItem>
                <UIFormGroup label="孔位描述">
                  <template #slot-before>
                    <p class="text-nurse-600 m-0 text-sm">
                      不規則孔位無法自動排列，請在下方「圖面上傳」附上圖檔，並於此簡述孔位。
                    </p>
                  </template>
                  <UIFormInput
                    v-model="holeIrregular"
                    placeholder="例：距左端 120、340、620 各一孔"
                  />
                </UIFormGroup>
              </UIGridItem>
            </template>
          </UIGrid>

          <!-- 孔位預覽圖：上為選面圖（可點），下為側視圖，隨輸入即時重畫 -->
          <div class="grid gap-4 md:grid-cols-2">
            <!-- 選面圖：俯視等角投影，只畫此角度看得到的四個面 -->
            <div
              class="border-nurse-200 flex flex-col gap-2 rounded-xl border bg-white p-3"
            >
              <svg
                viewBox="28 -12 535 318"
                class="mx-auto h-auto w-full"
                role="img"
                aria-label="選擇要打孔的面"
              >
                <!-- 遠端 L 斷面 -->
                <polygon
                  points="425,125 535,125 535,111 439,111 439,15 425,15"
                  fill="var(--color-brand-100)"
                  stroke="var(--color-brand-600)"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                  class="pointer-events-none"
                />

                <!-- A 面（垂直邊外側），可點 -->
                <polygon
                  points="95,235 95,125 425,15 425,125"
                  fill="var(--color-brand-200)"
                  stroke="var(--color-brand-600)"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                  class="cursor-pointer"
                  role="button"
                  tabindex="0"
                  aria-label="選擇 A 面"
                  :aria-pressed="isFaceOn('a')"
                  @click="selectFace('a')"
                  @keydown.enter.prevent="selectFace('a')"
                  @keydown.space.prevent="selectFace('a')"
                />

                <!-- 垂直邊頂面 -->
                <polygon
                  points="95,125 109,125 439,15 425,15"
                  fill="var(--color-brand-300)"
                  stroke="var(--color-brand-600)"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                  class="pointer-events-none"
                />

                <!-- 內側面 -->
                <polygon
                  points="109,125 109,221 439,111 439,15"
                  fill="var(--color-brand-200)"
                  stroke="var(--color-brand-600)"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                  class="pointer-events-none"
                />

                <!-- B 面（水平邊頂面），可點 -->
                <polygon
                  points="109,221 205,221 535,111 439,111"
                  fill="var(--color-brand-300)"
                  stroke="var(--color-brand-600)"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                  class="cursor-pointer"
                  role="button"
                  tabindex="0"
                  aria-label="選擇 B 面"
                  :aria-pressed="isFaceOn('b')"
                  @click="selectFace('b')"
                  @keydown.enter.prevent="selectFace('b')"
                  @keydown.space.prevent="selectFace('b')"
                />

                <!-- 右端面 -->
                <polygon
                  points="205,221 205,235 535,125 535,111"
                  fill="var(--color-brand-200)"
                  stroke="var(--color-brand-600)"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                  class="pointer-events-none"
                />

                <!-- 近端 L 斷面，畫在最上層 -->
                <polygon
                  points="95,235 205,235 205,221 109,221 109,125 95,125"
                  fill="var(--color-brand-400)"
                  stroke="var(--color-brand-700)"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                  class="pointer-events-none"
                />

                <text
                  x="260"
                  y="133"
                  text-anchor="middle"
                  font-size="24"
                  font-weight="bold"
                  class="pointer-events-none"
                  :fill="
                    isFaceOn('a')
                      ? 'var(--color-danger-600)'
                      : 'var(--color-brand-700)'
                  "
                >
                  A 面
                </text>
                <text
                  x="322"
                  y="174"
                  text-anchor="middle"
                  font-size="24"
                  font-weight="bold"
                  class="pointer-events-none"
                  :fill="
                    isFaceOn('b')
                      ? 'var(--color-danger-600)'
                      : 'var(--color-brand-700)'
                  "
                >
                  B 面
                </text>
              </svg>

              <p class="text-nurse-600 m-0 text-center text-xs">
                點選要打孔的面（可複選）
              </p>
            </div>

            <!-- 側視圖：孔沿長度方向的分布 -->
            <div
              class="border-nurse-200 flex flex-col gap-2 rounded-xl border bg-white p-3"
            >
              <svg
                viewBox="0 0 360 170"
                class="mx-auto h-auto w-full"
                role="img"
                aria-label="孔位側視圖"
              >
                <rect
                  x="20"
                  y="40"
                  width="320"
                  height="62"
                  rx="2"
                  fill="var(--color-brand-100)"
                  stroke="var(--color-brand-600)"
                  stroke-width="1.5"
                />

                <circle
                  v-for="(hole, index) in sideHoles"
                  :key="`side-${index}`"
                  :cx="hole.cx"
                  cy="71"
                  :r="hole.r"
                  fill="#ffffff"
                  stroke="var(--color-danger-600)"
                  stroke-width="1.5"
                />

                <!-- e / p / 尾端距離標註 -->
                <template v-if="sideHoles.length">
                  <line
                    x1="20"
                    y1="120"
                    :x2="sideHoles[0].cx"
                    y2="120"
                    stroke="var(--color-nurse-500)"
                    stroke-width="1"
                  />
                  <text
                    :x="(20 + sideHoles[0].cx) / 2"
                    y="116"
                    text-anchor="middle"
                    font-size="11"
                    font-weight="bold"
                    fill="var(--color-brand-800)"
                  >
                    e {{ Math.round(displayEdge) }}
                  </text>

                  <template v-if="sideHoles.length > 1">
                    <line
                      :x1="sideHoles[0].cx"
                      y1="140"
                      :x2="sideHoles[1].cx"
                      y2="140"
                      stroke="var(--color-nurse-500)"
                      stroke-width="1"
                    />
                    <text
                      :x="(sideHoles[0].cx + sideHoles[1].cx) / 2"
                      y="136"
                      text-anchor="middle"
                      font-size="11"
                      font-weight="bold"
                      fill="var(--color-brand-800)"
                    >
                      p {{ Math.round(displayPitch) }}
                    </text>
                  </template>

                  <line
                    :x1="sideHoles[sideHoles.length - 1].cx"
                    y1="120"
                    x2="340"
                    y2="120"
                    stroke="var(--color-nurse-500)"
                    stroke-width="1"
                  />
                  <text
                    :x="(sideHoles[sideHoles.length - 1].cx + 340) / 2"
                    y="116"
                    text-anchor="middle"
                    font-size="11"
                    font-weight="bold"
                    fill="var(--color-brand-800)"
                  >
                    {{ Math.round(tailDistance) }}
                  </text>
                </template>

                <text
                  x="180"
                  y="162"
                  text-anchor="middle"
                  font-size="11"
                  fill="var(--color-nurse-600)"
                >
                  {{ previewSummary }}
                </text>
              </svg>

              <p class="text-nurse-500 m-0 text-center text-xs">
                孔徑為示意，未按比例
              </p>
            </div>
          </div>
        </div>
      </UIPageContent>

      <!-- 加工說明與圖面上傳 -->
      <UIPageContent class="flex flex-col gap-6">
        <div>
          <h2 class="text-brand-900 m-0 text-xl font-bold">其他加工說明</h2>
          <p class="text-nurse-600 m-0 mt-1 text-sm">
            補充說明與圖面會跟著這一個項目進入詢價清單。
          </p>
        </div>

        <UIFormGroup label="加工說明">
          <template #slot-label>
            <span class="ml-2 flex gap-1">
              <UIFormButton
                text="Ø"
                size="sm"
                variant="secondary"
                appearance="outline"
                @click="insertSymbol('Ø')"
              />
              <UIFormButton
                text="±"
                size="sm"
                variant="secondary"
                appearance="outline"
                @click="insertSymbol('±')"
              />
            </span>
          </template>
          <UIFormInput
            ref="noteInput"
            :model-value="processNote"
            placeholder="例：Ø12 通孔，公差 ±1"
            @input="handleNoteInput"
          />
          <template #slot-after>
            <p class="text-nurse-600 m-0 text-sm">
              點按插入，或直接打 d12、+-1
            </p>
          </template>
        </UIFormGroup>

        <!-- 圖面上傳：多檔、限 10MB、最多 5 個 -->
        <UIFormGroup label="圖面上傳">
          <div class="grid gap-3">
            <input
              ref="fileInput"
              class="sr-only"
              type="file"
              multiple
              accept=".dxf,.dwg,.pdf,.jpg,.jpeg,.png"
              @change="handleFileChange"
            />

            <div
              class="border-nurse-300 text-brand-700 hover:border-brand-400 hover:bg-brand-50 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-white p-6 text-center transition-[background-color,border-color,box-shadow] duration-200"
              :class="
                isDragging
                  ? 'border-brand-500 bg-brand-50 ring-brand-500/20 border-solid ring-4'
                  : ''
              "
              role="button"
              tabindex="0"
              @click="fileInput?.click()"
              @keydown.enter.prevent="fileInput?.click()"
              @keydown.space.prevent="fileInput?.click()"
              @dragenter.prevent="isDragging = true"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
            >
              <UIIcon name="UploadCloud" :size="28" />
              <strong>
                {{
                  isDragging
                    ? '放開以加入圖面'
                    : '拖曳圖面到這裡，或點擊選擇檔案'
                }}
              </strong>
              <small class="text-nurse-500">
                支援 .dxf .dwg .pdf .jpg .jpeg .png，單檔 10MB，最多 5 個
              </small>
            </div>

            <p v-if="fileError" class="m-0 text-sm text-rose-600" role="alert">
              {{ fileError }}
            </p>

            <!-- 已選檔案列表 -->
            <div v-if="files.length" class="grid gap-2">
              <div
                v-for="(file, index) in files"
                :key="`${file.name}-${index}`"
                class="border-nurse-200 flex min-w-0 items-center gap-2 rounded-lg border bg-white px-3 py-2"
              >
                <span class="text-brand-600 shrink-0">
                  <UIIcon :name="fileIcon(file.kind)" :size="18" />
                </span>
                <span class="text-brand-900 min-w-0 flex-1 truncate text-sm">
                  {{ file.name }}
                </span>
                <span class="text-nurse-500 shrink-0 text-xs">
                  {{ formatSize(file.size) }}
                </span>
                <UIFormButton
                  icon="X"
                  icon-only
                  size="sm"
                  variant="danger"
                  appearance="outline"
                  aria-label="移除檔案"
                  class="shrink-0"
                  @click="removeFile(index)"
                />
              </div>
            </div>
          </div>
        </UIFormGroup>

        <UIFormButton
          class="w-full"
          text="加入詢價清單"
          icon="Plus"
          size="lg"
          :disabled="!canAddItem"
          @click="addItem"
        />
      </UIPageContent>

      <!-- 詢價清單 -->
      <UIPageContent class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h2 class="text-brand-900 m-0 text-xl font-bold">詢價清單</h2>
          <div class="flex flex-wrap gap-2">
            <UIFormButton
              text="匯出 Excel"
              icon="Download"
              @click="exportCsv"
            />
            <UIFormButton
              text="複製表格"
              icon="Copy"
              variant="secondary"
              @click="copyTable"
            />
            <UIFormButton
              text="清空"
              icon="Trash2"
              variant="danger"
              appearance="outline"
              @click="clearItems"
            />
          </div>
        </div>

        <UIEmptyState
          v-if="!items.length"
          title="清單目前是空的"
          description="設定好上方的規格與加工方式後，按「加入詢價清單」。"
        />

        <template v-else>
          <UITable>
            <table>
              <thead>
                <tr>
                  <th data-align="center" class="w-1">#</th>
                  <th>規格</th>
                  <th>材質</th>
                  <th data-align="right">長度</th>
                  <th data-align="right">數量</th>
                  <th>加工</th>
                  <th data-align="center">餘料</th>
                  <th data-align="center" class="w-1">動作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="item.id">
                  <td data-align="center">{{ index + 1 }}</td>
                  <td>{{ item.spec }}</td>
                  <td>{{ item.material }}</td>
                  <td data-align="right">{{ item.lengthMm }} mm</td>
                  <td data-align="right">{{ item.qty }} 支</td>
                  <td>
                    <span class="inline-flex items-center gap-1">
                      {{ item.process }}
                      <span
                        v-if="item.files.length"
                        class="text-brand-600 inline-flex items-center gap-0.5 font-bold"
                      >
                        <UIIcon name="Paperclip" :size="14" />
                        {{ item.files.length }}
                      </span>
                    </span>
                  </td>
                  <td data-align="center">
                    {{ item.scrap ? '取回' : '不取回' }}
                  </td>
                  <td data-align="center">
                    <UIFormButton
                      text="刪除"
                      size="sm"
                      variant="danger"
                      appearance="outline"
                      @click="removeItem(item.id)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </UITable>

          <p class="text-nurse-600 m-0 text-sm">
            目前清單：{{ items.length }} 項，附圖 {{ totalFiles }} 個
          </p>
        </template>

        <p v-if="exportMessage" class="text-brand-700 m-0 text-sm font-bold">
          {{ exportMessage }}
        </p>
      </UIPageContent>

      <!-- 訂單層級欄位與送出 -->
      <UIPageContent class="flex flex-col gap-6">
        <div>
          <h2 class="text-brand-900 m-0 text-xl font-bold">交期與備註</h2>
        </div>

        <UIGrid>
          <UIGridItem sm="12" md="6">
            <UIFormGroup label="希望交期">
              <UIFormDate v-model="orderDate" :min="todayIso" />
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem sm="12" md="6">
            <UIFormGroup label="急件">
              <UIFormSelect
                v-model="urgency"
                :options="URGENCY_OPTIONS"
                placeholder=""
              />
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem>
            <UIFormGroup label="其他備註說明">
              <UIFormTextarea
                v-model="orderNote"
                :rows="4"
                placeholder="請輸入其他需要說明的事項"
              />
            </UIFormGroup>
          </UIGridItem>
        </UIGrid>

        <UIFormButton
          class="w-full"
          text="送出詢價"
          icon="Send"
          size="lg"
          @click="submitQuote"
        />

        <p v-if="submitError" class="m-0 text-sm font-bold text-rose-600">
          {{ submitError }}
        </p>
        <p v-if="submitSuccess" class="m-0 text-sm font-bold text-emerald-700">
          {{ submitSuccess }}
        </p>
      </UIPageContent>
    </div>
  </div>
</template>
