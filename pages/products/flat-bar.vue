<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'

// 步驟順序照 Notion「順裕鐵材 / 扁鐵」的條目：
//   尺寸／規格 → 數量與長度 → 加工方式 → 圖解說明
// Notion 的「規格」（面寬、厚度）是選定尺寸後就固定的值，客戶沒有東西可填，
// 所以併進第一步的卡片，不另外開一個唯讀步驟。
type Step = 'size' | 'length' | 'process' | 'holes'

const steps: { id: Step; title: string }[] = [
  { id: 'size', title: '尺寸與規格' },
  { id: 'length', title: '數量與長度' },
  { id: 'process', title: '加工方式' },
  { id: 'holes', title: '圖解說明' },
]

// Notion「常用尺寸範圍：6分 ~ 5" (吋)」。
// 面寬換算依 Notion 自己寫的「面寬 3" (等於 7.5 cm)」，即 1" = 2.5 cm；
// 分是八分之一吋，所以 6分 = 6/8" = 1.875 cm、7分 = 7/8" = 2.1875 cm。
//
// ⚠️ Notion 只給了 6分 與 5" 兩個端點，中間的 7分、1"、2"、3"、4"
// 都是暫填的，厚度也一律沿用範例的 4.5 m/m（Notion 沒有各尺寸的厚度對照表）。
// 等業主給實際供應的尺寸階級就整組換掉，詳見「扁鐵-待確認事項.md」第三條。
interface FlatBarSize {
  id: string
  /** 卡片標題，用 Notion 的寫法 */
  title: string
  /** 面寬（cm） */
  faceWidthCm: number
  /** 厚度（m/m） */
  thicknessMm: number
}

const FLAT_BAR_SIZES: FlatBarSize[] = [
  { id: 's-6f', title: '6分 扁鐵', faceWidthCm: 1.875, thicknessMm: 4.5 },
  { id: 's-7f', title: '7分 扁鐵', faceWidthCm: 2.1875, thicknessMm: 4.5 },
  { id: 's-1', title: '1" 扁鐵', faceWidthCm: 2.5, thicknessMm: 4.5 },
  { id: 's-2', title: '2" 扁鐵', faceWidthCm: 5, thicknessMm: 4.5 },
  { id: 's-3', title: '3" 扁鐵', faceWidthCm: 7.5, thicknessMm: 4.5 },
  { id: 's-4', title: '4" 扁鐵', faceWidthCm: 10, thicknessMm: 4.5 },
  { id: 's-5', title: '5" 扁鐵', faceWidthCm: 12.5, thicknessMm: 4.5 },
]

// Notion 範例寫死「數量與長度：300 cm × 20 支」，不開放修改
const FIXED_LENGTH_CM = 300
const FIXED_QUANTITY = 20

// 數量與長度目前只有這一種組合（Notion 只給了這一組數字）。
// 做成陣列而不是寫死一張卡，之後業主給了別的組合直接加進來就好。
const LENGTH_OPTIONS = [
  {
    id: 'l-300x20',
    title: `${FIXED_LENGTH_CM} cm × ${FIXED_QUANTITY} 支`,
    description: `每筆固定 ${FIXED_QUANTITY} 支，單支長度 ${FIXED_LENGTH_CM} cm。`,
  },
]

// Notion 扁鐵段的加工方式只寫了「客製沖孔」一種，先列這一個
const PROCESS_OPTIONS = [
  {
    id: 'custom-punch',
    title: '客製沖孔',
    description: '依下一步填寫的孔位加工。',
  },
]

// 「等距均分／指定端距與節距」兩種排列先不顯示。
// Notion 的圖解說明只描述了一種排法（兩端各留 5cm、中間等距），
// 沒有提到客戶可以選排列方式，所以先照原文做單一種，等業主確認再開。
// const HOLE_LAYOUT_OPTIONS = [
//   { label: '等距均分', value: 'even' },
//   { label: '指定端距與節距', value: 'fixed' },
// ]

const currentStep = ref<Step>('size')

// ① 尺寸與規格：選一張卡，面寬與厚度隨卡片帶出
const selectedSizeId = ref<string | null>(null)

const selectedSize = computed(
  () => FLAT_BAR_SIZES.find((size) => size.id === selectedSizeId.value) ?? null,
)

const faceWidthCm = computed(() => selectedSize.value?.faceWidthCm ?? 0)
const thicknessMm = computed(() => selectedSize.value?.thicknessMm ?? 0)
const lengthCm = FIXED_LENGTH_CM
const quantity = FIXED_QUANTITY

// ② 數量與長度：只有一個選項，但仍要客戶點過才算填完，
// 免得畫面上出現一個沒有互動、按下一步就過的空步驟
const selectedLengthId = ref<string | null>(null)

const selectedLength = computed(
  () =>
    LENGTH_OPTIONS.find((item) => item.id === selectedLengthId.value) ?? null,
)

// ③ 加工方式
const selectedProcessId = ref<string | null>(null)

const selectedProcess = computed(
  () =>
    PROCESS_OPTIONS.find((item) => item.id === selectedProcessId.value) ?? null,
)

// ④ 圖解說明：孔位
// 欄位與預設值都照 Notion 圖解說明那句話：
//   「總長 300 cm 的沖孔位置：左右兩端邊緣各留 5 cm，
//     中間共有 4 段等距的孔位，間距皆為 72.5 cm（5 + 72.5×4 + 5 = 300cm）」
// 4 段等距 = 5 個孔。原文說的是「左右兩端邊緣各留」，不是「端距」，
// 所以欄位就叫「左右兩端邊緣各留」，一進來圖就跟 Notion 一致。
const HOLE_DEFAULTS = {
  count: 5,
  edgeCm: 5,
  pitchCm: 72.5,
}

// 排列方式固定為「兩端各留 + 中間等距」這一種（見上方註解），
// 所以不需要 holeLayout 這個狀態，等要開放兩種排法時再加回來。
//
// 孔徑 Notion 沒給任何數字，圖上也只畫圓圈沒標尺寸，欄位先不顯示。
// 圖面改用固定的示意孔徑（見 sideHoles），要開放時把這行與欄位一起復原。
// const holeDiaMm = ref<number | undefined>(undefined)
const holeCount = ref<number | undefined>(HOLE_DEFAULTS.count)
const holeEdgeCm = ref<number | undefined>(HOLE_DEFAULTS.edgeCm)
const holePitchCm = ref<number | undefined>(HOLE_DEFAULTS.pitchCm)

// 三個欄位是連動的，改壞了不容易自己湊回來，所以給一鍵還原
const resetHoles = () => {
  holeCount.value = HOLE_DEFAULTS.count
  holeEdgeCm.value = HOLE_DEFAULTS.edgeCm
  holePitchCm.value = HOLE_DEFAULTS.pitchCm
}

// 已經是預設值時按鈕沒作用，直接 disabled 免得客戶按了沒反應以為壞了
const isHoleDefault = computed(
  () =>
    holeCount.value === HOLE_DEFAULTS.count &&
    holeEdgeCm.value === HOLE_DEFAULTS.edgeCm &&
    holePitchCm.value === HOLE_DEFAULTS.pitchCm,
)

const attachmentFiles = ref<File[]>([])
const note = ref('')

// ---- 幾何計算（移植自 pages/quote-builder.vue 的孔位側視圖）----

// 圖面一律用 cm 計算，Notion 的圖解說明也是 cm
const totalLength = lengthCm

// 三個數字裡只有兩個是自由的（邊緣×2 + 間距×(孔數−1) = 總長），
// 所以改一格就得自動補另一格，欄位才會跟圖上的標註一致。
// 欄位精度是小數第一位，寫回前先四捨五入，避免出現系統自己填的值卻被自己擋下來。
const roundToField = (value: number) => Number(value.toFixed(1))
// 孔徑欄位停用中，圖上的孔用固定示意半徑（原圖也沒標孔徑）
const HOLE_PREVIEW_RADIUS = 5

// 欄位只能填到小數第一位，四捨五入的誤差最多 0.05cm。
// 算式是「邊緣×2 + 間距×(孔數−1)」，所以誤差會從兩處放大：
//   邊緣被進位 → 誤差 ×2（兩端各一次）
//   間距被進位 → 誤差 ×(孔數−1)（每一段各一次）
// 兩者都要算進去，否則系統自己算出來又寫回欄位的值會被自己擋下來
//（例如 2 孔時邊緣 113.75 進位成 113.8，兩端合計就差 0.1）。
// 另加 0.001 吸收浮點運算本身的誤差（72.5×4 這種）。
const closureTolerance = (holeCount: number) =>
  0.05 * (2 + Math.max(holeCount - 1, 0)) + 0.001
// 只有一個孔時沒有間距可累積誤差，單純吸收浮點誤差就好
const EDGE_EPSILON = 0.001

// ---- 欄位連動：改一格，自動補另一格 ----
// 使用者改哪一格，那一格就是他要的，由另一格讓步。孔數永遠照使用者填的。
// 算不出合法值（例如孔太多塞不下）就不寫回，讓驗證去顯示錯誤訊息。

// 由間距推邊緣：邊緣 = (總長 − 間距×(孔數−1)) ÷ 2
const edgeFromPitch = (n: number, pitch: number) => {
  if (n === 1) {
    // 一個孔時沒有間距可言，孔置中就是兩端各留一半
    return totalLength / 2
  }

  return (totalLength - pitch * (n - 1)) / 2
}

// 由邊緣推間距：間距 = (總長 − 邊緣×2) ÷ (孔數−1)
const pitchFromEdge = (n: number, edge: number) =>
  n <= 1 ? 0 : (totalLength - edge * 2) / (n - 1)

const setHoleEdge = (raw: string | number) => {
  if (raw === '') {
    holeEdgeCm.value = undefined

    return
  }

  const edge = Number(raw)
  const n = holeCount.value ?? 0

  // 只有一個孔時沒有第二格可以讓步——孔要置中，邊緣就只能是總長的一半，
  // 所以直接把欄位固定成合法值，不採用使用者填的數字
  if (n === 1) {
    holeEdgeCm.value = roundToField(totalLength / 2)

    return
  }

  holeEdgeCm.value = edge

  const pitch = pitchFromEdge(n, edge)

  if (n > 1 && pitch > 0) {
    holePitchCm.value = roundToField(pitch)
  }
}

const setHolePitch = (raw: string | number) => {
  if (raw === '') {
    holePitchCm.value = undefined

    return
  }

  const pitch = Number(raw)
  holePitchCm.value = pitch

  const n = holeCount.value ?? 0
  const edge = edgeFromPitch(n, pitch)

  if (n > 0 && edge > 0) {
    holeEdgeCm.value = roundToField(edge)
  }
}

const setHoleCount = (raw: string | number) => {
  if (raw === '') {
    holeCount.value = undefined

    return
  }

  const n = Number(raw)
  holeCount.value = n

  if (n <= 0) {
    return
  }

  if (n === 1) {
    holeEdgeCm.value = roundToField(totalLength / 2)

    return
  }

  // 孔數變動時優先保留間距（加工比較在意的數字），由邊緣吸收差額
  const pitch = holePitchCm.value ?? 0
  const edge = edgeFromPitch(n, pitch)

  if (pitch > 0 && edge > 0) {
    holeEdgeCm.value = roundToField(edge)

    return
  }

  // 間距太大導致邊緣變成負數時，改為保留邊緣、重算間距
  const keptEdge = holeEdgeCm.value ?? 0
  const fallbackPitch = pitchFromEdge(n, keptEdge)

  if (fallbackPitch > 0) {
    holePitchCm.value = roundToField(fallbackPitch)
  }
}

// ---- 圖面用的「合法排法」----
// 圖一律畫對稱、等距的結果，不照使用者的原始數字硬畫。
// 原因：邊緣與間距湊不滿總長時，直接用 edge + index×pitch 會讓尾端多出一截
//（例如 4 孔 / 邊緣 5 / 間距 72.5 會畫成左 5cm、右 77.5cm），
// 圖上就出現一個左右不等、最後一段被撐大的排法——那正是規則不允許的東西。
// 所以圖只呈現合法狀態：數字對得起來就照填的畫，對不起來就按孔數自動置中，
// 讓客戶看得到目標長什麼樣，再照錯誤訊息把數字改成一致。
const drawnLayout = computed(() => {
  const n = holeCount.value ?? 0

  if (n <= 0) {
    return { edge: 0, pitch: 0, positions: [] as number[] }
  }

  const edge = holeEdgeCm.value ?? 0
  const pitch = holePitchCm.value ?? 0
  // 只有一個孔時無所謂間距，孔必須落在正中間
  const isBalanced =
    n === 1
      ? Math.abs(edge * 2 - totalLength) <= EDGE_EPSILON
      : edge > 0 &&
        pitch > 0 &&
        Math.abs(edge * 2 + (n - 1) * pitch - totalLength) <=
          closureTolerance(n)

  // 填的數字在容差內對得起來，就照使用者填的間距畫。
  // 但邊緣改用「總長減去孔群長度後左右均分」算出來，不直接沿用輸入值——
  // 容差是為了讓四捨五入過的間距（41.4 之類）能通過，若把那點誤差全丟給尾端，
  // 圖上就會出現頭尾差一點點的排法。均分後兩端必然完全相等。
  if (isBalanced) {
    const spread = n === 1 ? 0 : pitch * (n - 1)
    const balancedEdge = (totalLength - spread) / 2

    return {
      edge: balancedEdge,
      pitch: n === 1 ? 0 : pitch,
      positions: Array.from(
        { length: n },
        (_, index) => balancedEdge + index * pitch,
      ),
    }
  }

  // 對不起來就退回「照孔數自動置中」：沿用使用者填的間距（沒填才自動平均），
  // 邊緣由總長減去孔群長度後左右均分，這樣兩端必然等長
  const usablePitch =
    n === 1 ? 0 : pitch > 0 && pitch * (n - 1) < totalLength ? pitch : 0
  const spread = usablePitch > 0 ? usablePitch * (n - 1) : 0
  const evenPitch = usablePitch > 0 ? usablePitch : totalLength / (n + 1)
  const evenSpread = usablePitch > 0 ? spread : evenPitch * (n - 1)
  const balancedEdge = (totalLength - evenSpread) / 2

  return {
    edge: balancedEdge,
    pitch: n === 1 ? 0 : evenPitch,
    positions: Array.from(
      { length: n },
      (_, index) => balancedEdge + index * evenPitch,
    ),
  }
})

const holePositions = computed(() => drawnLayout.value.positions)

// 圖上的標註一律取自 drawnLayout，不是使用者的原始輸入，
// 這樣標註跟畫出來的孔永遠一致
const displayEdge = computed(() => drawnLayout.value.edge)
const displayPitch = computed(() => drawnLayout.value.pitch)

// 兩端邊緣共用同一個值，所以尾距恆等於頭距，不另外用「總長 − 末孔」去算
// ——那樣算會在數字對不起來時顯示出不對稱的尾距（例如 77.5cm）
const tailDistance = computed(() => drawnLayout.value.edge)

// 原圖寫的是「5cm」「72.5cm」，不是「5.0cm」，所以整數不補小數位
const formatCm = (value: number) => Number(value.toFixed(1)).toString()

// ---- 側視圖版面（比照 Notion image 12.png 的比例與標註方式）----
// 矩形做成扁長的 8:1，跟原圖一致；左側留 96 給「3" = 7.5cm」那個兩行標註
const PLATE_X = 96
const PLATE_WIDTH = 600
const PLATE_Y = 40
const PLATE_HEIGHT = 75
const PLATE_RIGHT = PLATE_X + PLATE_WIDTH
const PLATE_BOTTOM = PLATE_Y + PLATE_HEIGHT
// 標註全部畫在矩形正下方同一條基線上，不分層
const DIM_LINE_Y = PLATE_BOTTOM + 22
const TICK_HEIGHT = 6
// 一段至少要這麼寬才放得下數字，否則只畫線不寫字，免得孔多時擠成一團
const MIN_LABEL_WIDTH = 42

const sideScale = PLATE_WIDTH / totalLength

const sideHoles = computed(() =>
  holePositions.value.map((pos) => ({
    cx: PLATE_X + pos * sideScale,
    r: HOLE_PREVIEW_RADIUS,
  })),
)

// 標註區段：左端距 → 每一段節距 → 右端距，全部標出來（原圖是四段都寫）
const dimSegments = computed(() => {
  const holes = sideHoles.value

  if (!holes.length) {
    return []
  }

  const segments: {
    x1: number
    x2: number
    label: string
    isEnd: boolean
  }[] = []

  segments.push({
    x1: PLATE_X,
    x2: holes[0].cx,
    label: `${formatCm(displayEdge.value)}cm`,
    isEnd: true,
  })

  for (let index = 0; index < holes.length - 1; index += 1) {
    segments.push({
      x1: holes[index].cx,
      x2: holes[index + 1].cx,
      label: `${formatCm(displayPitch.value)}cm`,
      isEnd: false,
    })
  }

  segments.push({
    x1: holes[holes.length - 1].cx,
    x2: PLATE_RIGHT,
    label: `${formatCm(tailDistance.value)}cm`,
    isEnd: true,
  })

  return segments.map((segment, index) => {
    const width = segment.x2 - segment.x1
    const fits = width >= MIN_LABEL_WIDTH

    // 端距通常很窄（5cm 只有 10 個單位），但原圖有標，
    // 所以窄的時候改把字推到圖外側，不是整個不寫
    if (!fits && segment.isEnd) {
      const isLeft = index === 0

      return {
        ...segment,
        mid: isLeft ? segment.x1 - 4 : segment.x2 + 4,
        anchor: isLeft ? 'end' : 'start',
        showLabel: true,
      }
    }

    return {
      ...segment,
      mid: (segment.x1 + segment.x2) / 2,
      anchor: 'middle',
      // 中間的節距段太窄就只留線與刻度，免得孔多時文字擠成一團
      showLabel: fits,
    }
  })
})

// ---- 驗證：只做防呆，不做數值範圍檢查 ----
// Notion 的「限制條件」欄位是空的，擋太嚴會擋到真客戶。
// 下面三個檢查是物理上不可能的情形，不是主觀限制。

const sizeError = computed(() => (selectedSize.value ? '' : '請選擇尺寸'))

const lengthError = computed(() =>
  selectedLength.value ? '' : '請選擇數量與長度',
)

const processError = computed(() =>
  selectedProcess.value ? '' : '請選擇加工方式',
)

const holeCountError = computed(() =>
  typeof holeCount.value === 'number' && holeCount.value > 0
    ? ''
    : '請輸入孔數',
)

// 下面兩個檢查都要用到孔徑，孔徑欄位停用中所以一併停用。
// 要開放孔徑時把這兩段與 holeError 裡的引用一起復原。
//
// // 孔徑不可超過面寬，否則孔會吃穿整片扁鐵
// const holeDiaFitError = computed(() => {
//   const diaCm = (holeDiaMm.value ?? 0) / 10
//   const width = faceWidthCm.value
//
//   if (diaCm <= 0 || width <= 0) {
//     return ''
//   }
//
//   return diaCm >= width
//     ? `孔徑 ${holeDiaMm.value}mm 不小於面寬 ${width}cm，孔會吃穿整片扁鐵`
//     : ''
// })
//
// // 節距小於孔徑時孔會相交
// const holePitchError = computed(() => {
//   const n = holeCount.value ?? 0
//   const diaCm = (holeDiaMm.value ?? 0) / 10
//
//   if (n <= 1 || diaCm <= 0) {
//     return ''
//   }
//
//   const pitch = displayPitch.value
//
//   return pitch > 0 && pitch < diaCm
//     ? `節距 ${pitch.toFixed(1)}cm 小於孔徑 ${holeDiaMm.value}mm，孔會重疊`
//     : ''
// })

// 兩端邊緣必須等長、每一段間距也必須相同（Notion 原文就是這樣描述的）。
// 兩端等長靠欄位結構就保證了：只有一個「邊緣」欄位、一個「間距」欄位。
// 但光有欄位不夠——三個數字加起來不等於總長時，孔就排不滿或排出材料外，
// 等於最後一段被撐大或壓縮（4 孔 / 5 / 72.5 會變成尾端 77.5），所以要擋。
//   Notion 的算式：5 + 72.5×4 + 5 = 300cm
const holePositionError = computed(() => {
  const n = holeCount.value ?? 0

  if (n <= 0) {
    return ''
  }

  const edge = holeEdgeCm.value ?? 0
  const pitch = holePitchCm.value ?? 0

  if (n > 1 && pitch <= 0) {
    return '請輸入間距'
  }

  // 邊緣上限：兩端留白加上孔群本身的長度不能超過材料
  const maxEdge = (totalLength - (n > 1 ? pitch * (n - 1) : 0)) / 2

  if (maxEdge <= 0) {
    // 光是孔跟孔之間就已經占滿或超過材料，連邊緣都留不出來
    const fitPitch = (totalLength - edge * 2) / (n - 1)

    return fitPitch > 0
      ? `間距 ${formatCm(pitch)}cm × ${n - 1} 段 = ${formatCm(pitch * (n - 1))}cm，已經占滿總長 ${totalLength}cm。${n} 孔且兩端各留 ${formatCm(edge)}cm 時，間距最多 ${formatCm(fitPitch)}cm`
      : `間距 ${formatCm(pitch)}cm × ${n - 1} 段 = ${formatCm(pitch * (n - 1))}cm，超過總長 ${totalLength}cm，請減少孔數或縮小間距`
  }

  if (edge > maxEdge + closureTolerance(n)) {
    return `兩端各留 ${formatCm(edge)}cm 太長：${n} 孔、間距 ${formatCm(pitch)}cm 時最多只能留 ${formatCm(maxEdge)}cm`
  }

  const used = edge * 2 + (n - 1) * pitch
  const diff = used - totalLength

  if (Math.abs(diff) <= closureTolerance(n)) {
    return ''
  }

  const formula = `${formatCm(edge)} + ${formatCm(pitch)}×${n - 1} + ${formatCm(edge)} = ${formatCm(used)}cm`
  const state = diff > 0 ? '超過' : '不足'

  // 直接把可行的間距算給客戶，不然他得自己解方程式
  if (n > 1) {
    const fixPitch = (totalLength - edge * 2) / (n - 1)

    if (fixPitch > 0) {
      return `${formula}，${state}總長 ${totalLength}cm。${n} 孔且兩端各留 ${formatCm(edge)}cm 時，間距要填 ${formatCm(fixPitch)}cm 才會等距`
    }

    return `${formula}，${state}總長 ${totalLength}cm。兩端各留 ${formatCm(edge)}cm 太長，${n} 個孔排不下`
  }

  // 只有一個孔時，孔一定在正中間才能兩端等長
  return `${formula}，${state}總長 ${totalLength}cm。只有 1 個孔時，兩端各留要填 ${formatCm(totalLength / 2)}cm 孔才會在正中間`
})

const holeError = computed(
  () => holeCountError.value || holePositionError.value,
)

// ---- 步驟控制（比照 pages/products/steel-plate-bending.vue）----

const isStepComplete = (step: Step) => {
  if (step === 'size') {
    return !sizeError.value
  }

  if (step === 'length') {
    return !lengthError.value
  }

  if (step === 'process') {
    return !processError.value
  }

  return !holeError.value
}

// 步驟只有在前面每一步都填完後才可點，避免跳過必填
const isStepReachable = (step: Step) => {
  const index = steps.findIndex((item) => item.id === step)

  return steps.slice(0, index).every((previous) => isStepComplete(previous.id))
}

// 換步驟時把 <main> 捲回頂端，不然會停在上一步的位置
const goToStep = async (step: Step) => {
  if (!isStepReachable(step)) {
    return
  }

  currentStep.value = step
  await nextTick()
  document
    .querySelector('main')
    ?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
}

const stepIndex = computed(() =>
  steps.findIndex((step) => step.id === currentStep.value),
)

const goPrevious = () => {
  const previous = steps[stepIndex.value - 1]

  if (previous) {
    goToStep(previous.id)
  }
}

// 選卡片後自動進入下一步，比照鋼板彎折
const selectSize = (sizeId: string) => {
  selectedSizeId.value = sizeId
  goToStep('length')
}

const selectLength = (lengthId: string) => {
  selectedLengthId.value = lengthId
  goToStep('process')
}

const selectProcess = (processId: string) => {
  selectedProcessId.value = processId
  goToStep('holes')
}

// 欄位是兩欄排的，目前三個欄位（各留、孔數、間距）是奇數，
// 最後會空半格露出 UIFieldGroup 當格線用的灰底，補一格白的蓋掉

// ---- 加入詢價 ----

const { addItem } = useQuoteCart()

const isAddedAlertOpen = ref(false)
const addedAlertText = ref('')

const canAddToCart = computed(() =>
  steps.every((step) => isStepComplete(step.id)),
)

const summaryText = computed(() => selectedSize.value?.title ?? '扁鐵')

const holeSummary = computed(() => {
  const count = holePositions.value.length

  if (!count) {
    return ''
  }

  // 用 Notion 的講法描述，不用「端距」這種術語
  return `${count} 孔、左右兩端邊緣各留 ${formatCm(displayEdge.value)}cm、間距 ${formatCm(displayPitch.value)}cm`
})

// 數字排不出合法排法時，各處一律顯示這一句。
// 不再逐項說明哪裡不對——正常操作下欄位會自動連動，會走到這裡的多半是
// 手動改到極端值，講「調整或重置」比講算式更快解決問題。
const HOLE_ERROR_TEXT = '參數輸入錯誤，請調整欄位或按「重置」還原預設值。'

// 步驟三的卡片標題說明＝Notion 圖解說明那句原文，但數字全部即時反映欄位。
// 取 displayEdge / displayPitch 而不是原始輸入：這兩個是圖面實際畫出來的值，
// 數字湊不滿總長時圖會改畫自動置中的排法，敘述必須跟圖講同一件事。
const holeDescription = computed(() => {
  // 排不出合法排法時，標題不報一組跟客戶輸入無關的數字，直接講錯誤
  if (holePositionError.value) {
    return HOLE_ERROR_TEXT
  }

  const count = holeCount.value ?? 0

  if (count <= 0) {
    return '請填寫下方孔位數值，圖面會依填寫的內容即時繪製。'
  }

  const edge = formatCm(displayEdge.value)

  // 1 孔沒有「段」也沒有間距，套原句會變成「共有 0 段」「間距皆為 0cm」
  if (count === 1) {
    return `總長 ${totalLength} cm 的沖孔位置：孔位在正中間，距左右兩端各 ${edge} cm。`
  }

  const segments = count - 1
  const pitch = formatCm(displayPitch.value)
  const used = formatCm(displayEdge.value * 2 + displayPitch.value * segments)

  return `總長 ${totalLength} cm 的沖孔位置：左右兩端邊緣各留 ${edge} cm，中間共有 ${segments} 段等距的孔位，間距皆為 ${pitch} cm（${edge} + ${pitch}×${segments} + ${edge} = ${used}cm）。`
})

const addToCart = () => {
  if (!canAddToCart.value) {
    return
  }

  const parts = [
    `面寬 ${faceWidthCm.value}cm`,
    `厚度 ${thicknessMm.value}mm`,
    `長度 ${lengthCm}cm`,
    selectedProcess.value?.title ?? '',
    holeSummary.value,
  ].filter(Boolean)

  const detail = parts.join('、')
  const summary = summaryText.value
  // 只記檔名，檔案本身沒有後端可傳
  const attachmentName = attachmentFiles.value
    .map((file) => file.name)
    .join('、')
  const itemNote = note.value.trim()

  addItem({
    category: '扁鐵',
    summary,
    detail,
    quantity,
    attachmentName,
    note: itemNote,
  })

  const attachmentCount = attachmentFiles.value.length

  addedAlertText.value = `${summary}\n${detail}\n數量 ${quantity} 支${
    attachmentCount ? `\n參考圖檔 ${attachmentCount} 個：${attachmentName}` : ''
  }${itemNote ? `\n備註：${itemNote}` : ''}`

  // 清掉這一筆，回到第一步方便接著填下一筆。
  // 孔位還原成 Notion 的預設值，不是清空——下一筆通常也是同樣的排法
  selectedSizeId.value = null
  selectedLengthId.value = null
  selectedProcessId.value = null
  resetHoles()
  attachmentFiles.value = []
  note.value = ''

  isAddedAlertOpen.value = true
  goToStep('size')
}

// 提示關掉後才跳首頁，讓使用者先看到加了什麼。
// 用 watch 而不是 @timeout，這樣點背景或按 Esc 提早關掉也會跳。
watch(isAddedAlertOpen, (isOpen, wasOpen) => {
  if (wasOpen && !isOpen) {
    navigateTo('/')
  }
})
</script>

<template>
  <div class="mx-auto w-[min(100%,1180px)] p-6 max-md:p-4">
    <UIPageHeader
      title="扁鐵"
      description="依序選擇尺寸與規格、數量與長度、加工方式，最後設定沖孔位置。"
      class="mb-4"
    />

    <!-- 步驟列：顯示目前進度，也可點回已完成的步驟 -->
    <nav class="mb-4" aria-label="填寫步驟">
      <ol class="m-0 flex list-none flex-wrap items-center gap-2 p-0">
        <li
          v-for="(step, index) in steps"
          :key="step.id"
          class="flex items-center gap-2"
        >
          <button
            class="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold transition-colors"
            :class="[
              currentStep === step.id
                ? 'border-brand-500 bg-brand-500 text-white'
                : isStepReachable(step.id)
                  ? 'border-nurse-200 text-brand-700 hover:bg-brand-50 bg-white'
                  : 'border-nurse-200 text-nurse-500 cursor-not-allowed bg-white',
            ]"
            type="button"
            :disabled="!isStepReachable(step.id)"
            :aria-current="currentStep === step.id ? 'step' : undefined"
            @click="goToStep(step.id)"
          >
            <span
              class="grid size-5 shrink-0 place-items-center rounded-full text-xs"
              :class="
                currentStep === step.id
                  ? 'text-brand-700 bg-white'
                  : 'bg-nurse-200 text-brand-700'
              "
            >
              {{ index + 1 }}
            </span>
            {{ step.title }}
          </button>
          <ChevronRight
            v-if="index < steps.length - 1"
            class="text-nurse-500 shrink-0"
            :size="16"
            aria-hidden="true"
          />
        </li>
      </ol>
    </nav>

    <UIPageContent>
      <!-- 步驟一：尺寸與規格。面寬與厚度寫在卡片上 -->
      <UIBoxCard
        v-if="currentStep === 'size'"
        title="選擇尺寸與規格"
        description='常用尺寸範圍：6分 ~ 5"（吋）。點選後自動進入下一步。'
      >
        <div class="flex flex-col gap-5">
          <div
            class="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1"
          >
            <UISelectableCard
              v-for="size in FLAT_BAR_SIZES"
              :key="size.id"
              :title="size.title"
              :description="`面寬 ${size.faceWidthCm} cm、厚度 ${size.thicknessMm} m/m`"
              :selected="selectedSizeId === size.id"
              @select="selectSize(size.id)"
            />
          </div>
        </div>
      </UIBoxCard>

      <!-- 步驟二：數量與長度。Notion 只給了 300cm × 20 支這一組，
           所以只有一張卡；仍要點過才算填完，不做「按下一步就過」的空步驟 -->
      <UIBoxCard
        v-else-if="currentStep === 'length'"
        title="選擇數量與長度"
        description="目前只提供這一種組合。點選後自動進入下一步。"
      >
        <div class="flex flex-col gap-5">
          <div
            class="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1"
          >
            <UISelectableCard
              v-for="option in LENGTH_OPTIONS"
              :key="option.id"
              :title="option.title"
              :description="option.description"
              :selected="selectedLengthId === option.id"
              @select="selectLength(option.id)"
            />
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <UIFormButton variant="secondary" @click="goPrevious">
              上一步
            </UIFormButton>
          </div>
        </div>
      </UIBoxCard>

      <!-- 步驟三：加工方式 -->
      <UIBoxCard
        v-else-if="currentStep === 'process'"
        title="選擇加工方式"
        description="點選後自動進入下一步。"
      >
        <div class="flex flex-col gap-5">
          <div
            class="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1"
          >
            <UISelectableCard
              v-for="option in PROCESS_OPTIONS"
              :key="option.id"
              :title="option.title"
              :description="option.description"
              :selected="selectedProcessId === option.id"
              @select="selectProcess(option.id)"
            />
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <UIFormButton variant="secondary" @click="goPrevious">
              上一步
            </UIFormButton>
          </div>
        </div>
      </UIBoxCard>

      <!-- 步驟四：圖解說明（孔位） -->
      <div v-else class="flex flex-col gap-6">
        <UIBoxCard title="圖解說明" :description="holeDescription">
          <template #header-action>
            <UIFormButton
              variant="outline"
              size="sm"
              icon="rotate-ccw"
              text="重置"
              :disabled="isHoleDefault"
              @click="resetHoles"
            />
          </template>

          <div class="flex flex-col gap-5">
            <!-- 欄位名稱用 Notion 原文的講法（「左右兩端邊緣各留」「間距」），
                 不用「端距」「節距」這種術語。排列方式與孔徑欄位已停用，見 script -->
            <UIFieldGroup :col="12">
              <UIField title="左右兩端邊緣各留" :md="6">
                <UIFormInputUnit
                  :model-value="holeEdgeCm ?? ''"
                  type="number"
                  min="0"
                  step="0.5"
                  suffix="cm"
                  placeholder="例如 5"
                  @update:model-value="setHoleEdge($event)"
                />
              </UIField>

              <UIField title="孔數" :md="6">
                <UIFormInputUnit
                  :model-value="holeCount ?? ''"
                  type="number"
                  min="1"
                  step="1"
                  suffix="孔"
                  placeholder="例如 5"
                  @update:model-value="setHoleCount($event)"
                />
              </UIField>

              <UIField title="間距" :md="6">
                <UIFormInputUnit
                  :model-value="holePitchCm ?? ''"
                  type="number"
                  min="0"
                  step="0.5"
                  suffix="cm"
                  placeholder="例如 72.5"
                  @update:model-value="setHolePitch($event)"
                />
              </UIField>

              <!-- 三個欄位是奇數，補一格白的蓋掉格線灰底 -->
              <div class="col-span-full bg-white max-md:hidden md:col-span-6" />
            </UIFieldGroup>

            <!-- 孔位側視圖，隨上方欄位即時重畫。
                 數字排不出合法排法時整張圖不畫——圖只能畫對稱等距的結果，
                 硬畫出來的排法跟客戶填的數字不同，反而會誤導 -->
            <figure
              class="border-nurse-200 m-0 flex flex-col gap-2 rounded-lg border bg-white p-4"
            >
              <!-- 版面比照 Notion image 12.png：扁長矩形、標註全在同一條基線、
                   黑白工程圖風格。座標由上方的 PLATE_* 常數算出 -->
              <svg
                v-if="!holePositionError"
                viewBox="0 0 780 190"
                class="mx-auto h-auto w-full"
                role="img"
                aria-label="沖孔位置側視圖"
              >
                <!-- 扁鐵本體 -->
                <rect
                  :x="PLATE_X"
                  :y="PLATE_Y"
                  :width="PLATE_WIDTH"
                  :height="PLATE_HEIGHT"
                  fill="#ffffff"
                  stroke="var(--color-brand-900)"
                  stroke-width="2.5"
                />

                <circle
                  v-for="(hole, index) in sideHoles"
                  :key="`hole-${index}`"
                  :cx="hole.cx"
                  :cy="PLATE_Y + PLATE_HEIGHT / 2"
                  :r="hole.r"
                  fill="#ffffff"
                  stroke="var(--color-brand-900)"
                  stroke-width="2.5"
                />

                <!-- 總長標註 -->
                <text
                  :x="PLATE_X + PLATE_WIDTH / 2"
                  :y="PLATE_Y - 14"
                  text-anchor="middle"
                  font-size="17"
                  font-weight="bold"
                  fill="var(--color-brand-900)"
                >
                  {{ totalLength }}cm
                </text>

                <!-- 面寬標註：原圖是「3" = 」換行「7.5cm」兩行，放在矩形左外側 -->
                <text
                  v-if="selectedSize"
                  :x="PLATE_X - 16"
                  text-anchor="end"
                  font-size="15"
                  font-weight="bold"
                  fill="var(--color-brand-900)"
                >
                  <tspan :x="PLATE_X - 16" :y="PLATE_Y + PLATE_HEIGHT / 2 - 4">
                    {{ selectedSize.title.replace(' 扁鐵', '') }} =
                  </tspan>
                  <tspan :x="PLATE_X - 16" :y="PLATE_Y + PLATE_HEIGHT / 2 + 15">
                    {{ faceWidthCm }}cm
                  </tspan>
                </text>

                <!-- 端距 / 各段節距 / 尾距：全部畫在同一條基線，段端加刻度短豎線 -->
                <g v-if="dimSegments.length">
                  <template
                    v-for="(segment, index) in dimSegments"
                    :key="`dim-${index}`"
                  >
                    <line
                      :x1="segment.x1"
                      :y1="DIM_LINE_Y"
                      :x2="segment.x2"
                      :y2="DIM_LINE_Y"
                      stroke="var(--color-brand-900)"
                      stroke-width="2"
                    />
                    <line
                      :x1="segment.x1"
                      :y1="DIM_LINE_Y - TICK_HEIGHT"
                      :x2="segment.x1"
                      :y2="DIM_LINE_Y + TICK_HEIGHT"
                      stroke="var(--color-brand-900)"
                      stroke-width="2"
                    />
                    <text
                      v-if="segment.showLabel"
                      :x="segment.mid"
                      :y="DIM_LINE_Y + 22"
                      :text-anchor="segment.anchor"
                      font-size="15"
                      font-weight="bold"
                      fill="var(--color-brand-900)"
                    >
                      {{ segment.label }}
                    </text>
                  </template>

                  <!-- 最後一段的右端刻度 -->
                  <line
                    :x1="PLATE_RIGHT"
                    :y1="DIM_LINE_Y - TICK_HEIGHT"
                    :x2="PLATE_RIGHT"
                    :y2="DIM_LINE_Y + TICK_HEIGHT"
                    stroke="var(--color-brand-900)"
                    stroke-width="2"
                  />
                </g>

                <text
                  v-else
                  :x="PLATE_X + PLATE_WIDTH / 2"
                  :y="DIM_LINE_Y + 22"
                  text-anchor="middle"
                  font-size="14"
                  fill="var(--color-nurse-600)"
                >
                  請填寫孔數
                </text>
              </svg>

              <!-- 圖沒畫的時候，這裡是圖框內唯一的內容，要說明為什麼沒有圖 -->
              <figcaption
                v-if="holePositionError"
                class="text-danger-600 m-0 py-6 text-center text-sm font-bold"
              >
                {{ HOLE_ERROR_TEXT }}
              </figcaption>
              <figcaption v-else class="text-nurse-500 m-0 text-center text-xs">
                孔的大小為示意，未按比例（Notion
                原圖也未標註孔徑）。此圖依您填寫的數值即時繪製，實際加工以雙方確認的圖面為準。
              </figcaption>
            </figure>

            <!-- 上傳與備註放在 UIFieldGroup 外面：這兩個都比一般欄位高，
                 塞進格線裡那一列會比其他列高一截 -->
            <div class="grid gap-2">
              <span class="text-brand-800 text-sm font-bold">
                上傳參考圖示<span class="text-nurse-500 font-normal">
                  （選填）
                </span>
              </span>
              <UIFormFileUpload
                v-model="attachmentFiles"
                accept="image/*,application/pdf,.pdf,.dwg,.dxf"
                hint="支援圖片、PDF、DWG、DXF，可一次選多個"
              />
            </div>

            <div class="grid gap-2">
              <span class="text-brand-800 text-sm font-bold">
                備註說明<span class="text-nurse-500 font-normal">
                  （選填）
                </span>
              </span>
              <UIFormTextarea
                v-model="note"
                :rows="3"
                :maxlength="200"
                placeholder="有其他需求或說明可以寫在這裡。"
              />
              <span class="text-nurse-500 text-xs"
                >{{ note.length }} / 200</span
              >
            </div>

            <div class="flex flex-col gap-3">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <UIFormButton variant="secondary" @click="goPrevious">
                  上一步
                </UIFormButton>
                <UIFormButton
                  text="加入詢價"
                  icon="Plus"
                  :disabled="!canAddToCart"
                  @click="addToCart"
                />
              </div>
            </div>
          </div>
        </UIBoxCard>
      </div>
    </UIPageContent>

    <UIAlert
      v-model="isAddedAlertOpen"
      title="已加入詢價單"
      :text="addedAlertText"
      icon="success"
      :show-confirm-button="false"
      :timer="1500"
    />
  </div>
</template>
