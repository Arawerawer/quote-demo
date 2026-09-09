<script setup lang="ts">
import type {
  BendingSource,
  QuoteCartItem,
  QuoteDiagramImage,
} from '~/composables/useQuoteCart'

// 鋼板彎折的填寫流程。抽成元件是為了讓「品項頁」與「詢價單的修改彈窗」
// 共用同一套流程——複製第二份的話兩邊遲早會走鐘。
const props = withDefaults(
  defineProps<{
    /**
     * 'create' = 品項頁的新增流程：步驟依序解鎖、送出後清空欄位回第一步。
     * 'edit'   = 詢價單彈窗的修改流程：每一步都能自由點、送出後不清空
     *            （彈窗會直接關掉，清空反而會讓關閉動畫期間畫面閃一下）。
     */
    mode?: 'create' | 'edit'
    /** 編輯模式的初始值；新增模式不傳 */
    initialState?: BendingSource
    /** 編輯模式的初始備註 */
    initialNote?: string
    /**
     * 編輯模式原本的參考圖檔名。File 物件無法從 QuoteCartItem 還原，
     * 所以編輯時只顯示「原本附了這些檔案」，沒有重選就沿用這個字串。
     */
    initialAttachmentName?: string
    /** 主要送出鈕的文字 */
    submitText?: string
    /**
     * true 時主要送出鈕旁邊多一顆「送出詢價」（只詢這一項，不進清單）。
     * 只有品項頁要，編輯彈窗裡再開一條送出流程會很亂。
     */
    showInstantSubmit?: boolean
  }>(),
  {
    mode: 'create',
    initialState: undefined,
    initialNote: '',
    initialAttachmentName: '',
    submitText: '加入詢價',
    showInstantSubmit: false,
  },
)

const emit = defineEmits<{
  /** 主要動作：新增模式 = 加入清單，編輯模式 = 覆蓋原本那筆 */
  submit: [payload: Omit<QuoteCartItem, 'id'>]
  /** 「送出詢價」：只詢這一項，不進清單。只有 showInstantSubmit 時才會 emit */
  instant: [payload: Omit<QuoteCartItem, 'id'>]
}>()

// 資料完全依照 Notion「順裕鐵材 / 鋼板彎折形狀」整理：
// 每個刀數群組沿用 Notion 原圖，參數代號（A、B、C…）與圖上標示一致。
// Notion 原圖沒有替形狀命名，因此這裡只用「第 N 種」對應圖面由左至右的順序，不自行取名。
interface BendShape {
  id: string
  title: string
  /** 由 Notion 原圖裁切出的單一形狀圖 */
  image: string
  /** 該形狀的彎折段參數代號，順序同 Notion 圖面標示 */
  segments: string[]
  /** 展開圖總長（寬）的代號；盤形無展開圖 */
  developed?: string
}

interface BendGroup {
  id: string
  title: string
  cuts: string
  /** 該刀數共用的展開圖（同樣由原圖裁切）；盤形沒有 */
  developedImage?: string
  shapes: BendShape[]
}

const IMG = '/images/products/bending'

const bendGroups: BendGroup[] = [
  {
    id: 'cut-1',
    title: '一刀',
    cuts: '共 1 種形狀',
    developedImage: `${IMG}/cut-1/developed.png`,
    shapes: [
      {
        id: 'c1-s1',
        title: '第 1 種',
        image: `${IMG}/cut-1/shape-1.png`,
        segments: ['A', 'B'],
        developed: 'C',
      },
    ],
  },
  {
    id: 'cut-2',
    title: '兩刀',
    cuts: '共 2 種形狀',
    developedImage: `${IMG}/cut-2/developed.png`,
    shapes: [
      {
        id: 'c2-s1',
        title: '第 1 種',
        image: `${IMG}/cut-2/shape-1.png`,
        segments: ['A', 'B', 'C'],
        developed: 'D',
      },
      {
        id: 'c2-s2',
        title: '第 2 種',
        image: `${IMG}/cut-2/shape-2.png`,
        segments: ['A', 'B', 'C'],
        developed: 'D',
      },
    ],
  },
  {
    id: 'cut-3',
    title: '三刀',
    cuts: '共 2 種形狀',
    developedImage: `${IMG}/cut-3/developed.png`,
    shapes: [
      {
        id: 'c3-s1',
        title: '第 1 種',
        image: `${IMG}/cut-3/shape-1.png`,
        segments: ['A', 'B', 'C', 'D'],
        developed: 'E',
      },
      {
        id: 'c3-s2',
        title: '第 2 種',
        image: `${IMG}/cut-3/shape-2.png`,
        segments: ['A', 'B', 'C', 'D'],
        developed: 'E',
      },
    ],
  },
  {
    id: 'cut-4',
    title: '四刀',
    cuts: '共 4 種形狀',
    developedImage: `${IMG}/cut-4/developed.png`,
    shapes: [
      {
        id: 'c4-s1',
        title: '第 1 種',
        image: `${IMG}/cut-4/shape-1.png`,
        segments: ['A', 'B', 'C', 'D', 'E'],
        developed: 'F',
      },
      {
        id: 'c4-s2',
        title: '第 2 種',
        image: `${IMG}/cut-4/shape-2.png`,
        segments: ['A', 'B', 'C', 'D', 'E'],
        developed: 'F',
      },
      {
        id: 'c4-s3',
        title: '第 3 種',
        image: `${IMG}/cut-4/shape-3.png`,
        segments: ['A', 'B', 'C', 'D', 'E'],
        developed: 'F',
      },
      {
        id: 'c4-s4',
        title: '第 4 種',
        image: `${IMG}/cut-4/shape-4.png`,
        segments: ['A', 'B', 'C', 'D', 'E'],
        developed: 'F',
      },
    ],
  },
  {
    id: 'cut-5',
    title: '五刀',
    cuts: '共 5 種形狀',
    shapes: [
      {
        id: 'c5-s1',
        title: '第 1 種',
        image: `${IMG}/cut-5/shape-1.png`,
        segments: ['A', 'B', 'C', 'D', 'E', 'F'],
      },
      {
        id: 'c5-s2',
        title: '第 2 種',
        image: `${IMG}/cut-5/shape-2.png`,
        segments: ['A', 'B', 'C', 'D', 'E', 'F'],
      },
      {
        id: 'c5-s3',
        title: '第 3 種',
        image: `${IMG}/cut-5/shape-3.png`,
        segments: ['A', 'B', 'C', 'D', 'E', 'F'],
      },
      {
        id: 'c5-s4',
        title: '第 4 種',
        image: `${IMG}/cut-5/shape-4.png`,
        segments: ['A', 'B', 'C', 'D', 'E', 'F'],
      },
      {
        id: 'c5-s5',
        title: '第 5 種',
        image: `${IMG}/cut-5/shape-5.png`,
        segments: ['A', 'B', 'C', 'D', 'E', 'F'],
      },
    ],
  },
  {
    id: 'tray',
    title: '盤形',
    cuts: '共 4 種形狀',
    shapes: [
      {
        id: 'tray-s1',
        title: '第 1 種',
        image: `${IMG}/tray/shape-1.png`,
        segments: ['A', 'B', 'C'],
      },
      {
        id: 'tray-s2',
        title: '第 2 種',
        image: `${IMG}/tray/shape-2.png`,
        segments: ['A', 'B', 'C', 'D'],
      },
      {
        id: 'tray-s3',
        title: '第 3 種',
        image: `${IMG}/tray/shape-3.png`,
        segments: ['A', 'B', 'C', 'D'],
      },
      {
        id: 'tray-s4',
        title: '第 4 種',
        image: `${IMG}/tray/shape-4.png`,
        segments: ['A', 'B', 'C', 'D'],
      },
    ],
  },
]

// 一次只顯示一個步驟，選完就整頁換掉，不往下堆疊
type Step = 'cut' | 'shape' | 'spec'

const steps: { id: Step; title: string }[] = [
  { id: 'cut', title: '選刀數' },
  { id: 'shape', title: '選形狀' },
  { id: 'spec', title: '填規格' },
]

// 編輯模式一進來就停在最後一步：使用者是回來改東西的，
// 刀數與形狀早就選好了，從第一步開始等於逼他重看一遍
const currentStep = ref<Step>(props.mode === 'edit' ? 'spec' : 'cut')
const selectedGroupId = ref<string | null>(props.initialState?.groupId ?? null)
const selectedShapeId = ref<string | null>(props.initialState?.shapeId ?? null)
// 以 `${shapeId}-${代號}` 為 key 存各段尺寸，切換形狀時不互相污染
const segmentValues = ref<Record<string, string>>({})

const segmentKey = (shapeId: string, segment: string) => `${shapeId}-${segment}`

// 編輯模式帶進來的 source.segments 是純代號 key（一筆詢價只對應一個形狀），
// 這裡展開回帶 shapeId 前綴的內部格式
if (props.initialState) {
  const { shapeId, segments } = props.initialState

  for (const [segment, value] of Object.entries(segments)) {
    segmentValues.value[segmentKey(shapeId, segment)] = value
  }
}

const selectedGroup = computed(
  () => bendGroups.find((group) => group.id === selectedGroupId.value) ?? null,
)

const selectedShape = computed(
  () =>
    selectedGroup.value?.shapes.find(
      (shape) => shape.id === selectedShapeId.value,
    ) ?? null,
)

// 五刀沒有展開圖也不是盤形，圖面區只有一張圖；
// 這時還維持兩欄的話圖會被擠在左半邊，所以改成單欄整寬
const hasSecondFigure = computed(
  () =>
    Boolean(selectedGroup.value?.developedImage) ||
    selectedGroup.value?.id === 'tray',
)

// 步驟只有在前一步選完後才可點，避免跳過必填
const isStepReachable = (step: Step) => {
  // 編輯模式每一步都能直接點：使用者是回來改某一格的，
  // 不該逼他從第一步重走一遍已經選好的東西
  if (props.mode === 'edit') {
    return true
  }

  return (
    step === 'cut' ||
    (step === 'shape' && Boolean(selectedGroupId.value)) ||
    (step === 'spec' && Boolean(selectedShapeId.value))
  )
}

const root = useTemplateRef<HTMLElement>('root')

// 換步驟時把捲動容器捲回頂端，不然會停在上一步的位置。
// 品項頁的捲動容器是 <main>（專案唯一的捲動容器），但編輯彈窗是
// Teleport 到 body 的 UIModal，捲動容器是 modal 自己那層 overflow-y-auto，
// 這時捲 <main> 完全沒作用，還會去捲背景的頁面。
const scrollContainer = () =>
  props.mode === 'edit'
    ? root.value?.closest('.overflow-y-auto')
    : document.querySelector('main')

const goToStep = async (step: Step) => {
  if (!isStepReachable(step)) {
    return
  }

  currentStep.value = step
  await nextTick()
  scrollContainer()?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
}

// 單選題：選完直接進下一步，不用再按「下一步」。
// 要改回上一步的選擇時，點上方步驟條或「上一步」回來重選即可
const selectGroup = (groupId: string) => {
  selectedGroupId.value = groupId
  selectedShapeId.value = null
  goToStep('shape')
}

const selectShape = (shapeId: string) => {
  selectedShapeId.value = shapeId
  goToStep('spec')
}

const segmentValue = (segment: string) => {
  const shapeId = selectedShapeId.value

  return shapeId
    ? (segmentValues.value[segmentKey(shapeId, segment)] ?? '')
    : ''
}

const setSegmentValue = (segment: string, value: string | number) => {
  const shapeId = selectedShapeId.value

  if (!shapeId) {
    return
  }

  segmentValues.value[segmentKey(shapeId, segment)] = String(value)
}

// 數量、參考圖檔與備註不隨形狀切換保留（每筆詢價各自獨立），
// 所以用單一 ref，而不是像 segmentValues 那樣以 shapeId 做 key
const quantity = ref<number | undefined>(props.initialState?.quantity)
const attachmentFiles = ref<File[]>([])
const note = ref(props.initialNote)

// 該形狀所有要填的代號（含展開總長）
const activeSegments = computed(() => {
  const shape = selectedShape.value

  if (!shape) {
    return []
  }

  return shape.developed ? [...shape.segments, shape.developed] : shape.segments
})

// 數量清空時 model 會是空字串，而 '3' >= 1 會因強制轉型成立，
// 所以要先用 typeof 卡住型別再比大小
const hasQuantity = computed(
  () => typeof quantity.value === 'number' && quantity.value >= 1,
)

// 數量必填、尺寸至少填一格，避免整筆空白進詢價單。
// 這只是防呆，不做數值範圍檢查——Notion 的限制條件是打問號的。
const canAddToCart = computed(
  () =>
    hasQuantity.value &&
    activeSegments.value.some((segment) => segmentValue(segment) !== ''),
)

// 欄位是兩欄排的（各段尺寸 + 數量），總數為奇數時最後會空半格，
// 露出 UIFieldGroup 當格線用的灰底；補一格白的蓋掉。
// 上傳與備註在 UIFieldGroup 外面，不算進來。
const hasFieldFiller = computed(
  () => (activeSegments.value.length + 1) % 2 === 1,
)

// 加入詢價單時要一併帶走的圖面。來源就是步驟三畫面上那兩張圖，
// 分支條件沿用 hasSecondFigure：有展開圖就配展開圖，盤形改配立體示意，
// 五刀兩者都沒有就只有一張。
const diagramImages = computed<QuoteDiagramImage[]>(() => {
  const group = selectedGroup.value
  const shape = selectedShape.value

  if (!group || !shape) {
    return []
  }

  const images: QuoteDiagramImage[] = [
    { src: shape.image, caption: '彎折後外形' },
  ]

  if (group.developedImage) {
    images.push({ src: group.developedImage, caption: '展開圖' })
  } else if (group.id === 'tray') {
    images.push({ src: `${IMG}/bend-tray-3d.png`, caption: '盤形立體示意' })
  }

  return images
})

// 組出要送進詢價單的整包資料。
// detail / summary / diagramImages 全部由目前的欄位算出來，跟 source 一起送，
// 這樣詢價單那邊不可能只更新其中一個而讓圖跟文字對不起來。
const buildPayload = (): Omit<QuoteCartItem, 'id'> | null => {
  const group = selectedGroup.value
  const shape = selectedShape.value

  if (!group || !shape || !canAddToCart.value) {
    return null
  }

  const filled = activeSegments.value.filter(
    (segment) => segmentValue(segment) !== '',
  )

  const detail = filled
    .map((segment) => `${segment} ${segmentValue(segment)}cm`)
    .join('、')

  // source 只存這個形狀的段，key 拿掉 shapeId 前綴——
  // 一筆詢價只對應一個形狀，把切換過程留下的其他形狀也存進去只是髒資料
  const sourceSegments: Record<string, string> = {}

  for (const segment of filled) {
    sourceSegments[segment] = segmentValue(segment)
  }

  // 只記檔名，檔案本身沒有後端可傳。
  // 編輯模式沒有重新選檔就沿用原本的檔名——使用者只是回來改尺寸，
  // 不該因為沒重傳而把附件記錄清掉
  const attachmentName = attachmentFiles.value.length
    ? attachmentFiles.value.map((file) => file.name).join('、')
    : props.initialAttachmentName

  return {
    category: '鋼板彎折',
    summary: `${group.title} ${shape.title}`,
    detail,
    quantity: Number(quantity.value),
    attachmentName,
    note: note.value.trim(),
    // 這個品項頁的圖是 Notion 原圖裁切出來的固定 PNG，不是即時算出來的 svg，
    // 所以走 diagramImages 而不是 diagramSvg
    diagramSvg: '',
    // 要在下面清掉選擇之前取值，清完 computed 會變成空陣列。
    // .value 當下就取成一般陣列，之後 computed 再變也不影響已加入的這筆
    diagramImages: diagramImages.value,
    source: {
      productId: 'bending',
      state: {
        groupId: group.id,
        shapeId: shape.id,
        segments: sourceSegments,
        quantity: Number(quantity.value),
      },
    },
  }
}

// 送出後清掉這一種已填的尺寸，回到第一步方便接著填下一筆。
// 編輯模式不清：彈窗會直接關掉，清空只會讓關閉動畫期間閃一下
const resetForm = () => {
  const shape = selectedShape.value

  if (shape) {
    for (const segment of activeSegments.value) {
      delete segmentValues.value[segmentKey(shape.id, segment)]
    }
  }

  quantity.value = undefined
  attachmentFiles.value = []
  note.value = ''

  goToStep('cut')
}

const handleSubmit = () => {
  const payload = buildPayload()

  if (!payload) {
    return
  }

  emit('submit', payload)

  if (props.mode === 'create') {
    resetForm()
  }
}

// 送出詢價（只詢這一項）。這條路一定會離開本頁，所以不清空欄位
const handleInstant = () => {
  const payload = buildPayload()

  if (payload) {
    emit('instant', payload)
  }
}
</script>

<template>
  <div ref="root" class="flex flex-col gap-4">
    <ProductStepNav
      :steps="steps"
      :current="currentStep"
      :is-reachable="(id) => isStepReachable(id as Step)"
      @select="goToStep($event as Step)"
    />

    <UIPageContent>
      <!-- 步驟一：選刀數。
           沒用 UIBoxCard 是因為它的 header 沒有放按鈕的 slot，
           而「下一步」要跟標題同一列；樣式直接沿用 UIBoxCard 的寫法。 -->
      <section
        v-if="currentStep === 'cut'"
        class="border-nurse-200 overflow-hidden rounded-2xl border bg-white"
      >
        <header
          class="border-nurse-200 flex flex-wrap items-center justify-between gap-3 border-b p-5"
        >
          <div class="min-w-0">
            <h2 class="text-brand-900 m-0 text-xl leading-[1.45] font-bold">
              選擇彎折刀數
            </h2>
            <p class="text-brand-600 mt-1 mb-0 text-sm leading-[1.6]">
              點選刀數後自動進入下一步。
            </p>
          </div>
        </header>

        <div class="bg-desert-50 px-6 py-7 max-md:px-4 max-md:py-5">
          <!-- 直接寫欄數，不走 UIGridItem 的 12 欄換算 -->
          <div
            class="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1"
          >
            <UISelectableCard
              v-for="group in bendGroups"
              :key="group.id"
              :title="group.title"
              :description="group.cuts"
              :selected="selectedGroupId === group.id"
              @select="selectGroup(group.id)"
            />
          </div>
        </div>
      </section>

      <!-- 步驟二：選形狀，卡片直接放該形狀的圖 -->
      <UIBoxCard
        v-else-if="currentStep === 'shape' && selectedGroup"
        :title="`${selectedGroup.title}：選擇形狀`"
        description="點選形狀後自動進入下一步。"
      >
        <div class="flex flex-col gap-5">
          <div
            class="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1"
          >
            <button
              v-for="shape in selectedGroup.shapes"
              :key="shape.id"
              class="group text-brand-900 hover:border-brand-200 hover:bg-brand-50 flex w-full flex-col items-center gap-3 rounded-lg border p-4 transition-all duration-200"
              :class="
                selectedShapeId === shape.id
                  ? 'border-brand-500 bg-brand-50 ring-brand-300 ring-2'
                  : 'border-nurse-200 bg-white'
              "
              type="button"
              @click="selectShape(shape.id)"
            >
              <img
                :src="shape.image"
                :alt="`${selectedGroup.title} ${shape.title} 形狀圖`"
                class="block h-28 w-auto max-w-full object-contain"
              />
              <span class="flex w-full items-center justify-between">
                <strong>{{ shape.title }}</strong>
                <span
                  class="group-hover:border-brand-500 grid size-[22px] shrink-0 place-items-center rounded-full border bg-white"
                  :class="
                    selectedShapeId === shape.id
                      ? 'border-brand-500'
                      : 'border-nurse-500'
                  "
                >
                  <span
                    v-if="selectedShapeId === shape.id"
                    class="bg-brand-400 size-3 rounded-full"
                  />
                </span>
              </span>
              <span class="text-brand-600 w-full text-left text-sm">
                參數：{{ shape.segments.join('、') }}
              </span>
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <UIFormButton variant="secondary" @click="goToStep('cut')">
              上一步
            </UIFormButton>
          </div>
        </div>
      </UIBoxCard>

      <!-- 步驟三：圖面 + 尺寸欄位 -->
      <div
        v-else-if="currentStep === 'spec' && selectedGroup && selectedShape"
        class="flex flex-col gap-6"
      >
        <UIBoxCard
          :title="`${selectedGroup.title} ${selectedShape.title}：圖面`"
          description="左為彎折後外形，右為展開圖，圖上字母即為下方要填的尺寸代號。"
        >
          <div
            class="grid gap-4"
            :class="hasSecondFigure ? 'md:grid-cols-2' : ''"
          >
            <figure
              class="border-nurse-200 m-0 grid place-items-center rounded-lg border bg-white p-6"
            >
              <img
                :src="selectedShape.image"
                :alt="`${selectedGroup.title} ${selectedShape.title} 形狀圖`"
                class="block h-auto max-h-64 w-auto max-w-full object-contain"
              />
              <figcaption class="text-brand-600 mt-3 text-center text-sm">
                彎折後外形
              </figcaption>
            </figure>

            <figure
              v-if="selectedGroup.developedImage"
              class="border-nurse-200 m-0 grid place-items-center rounded-lg border bg-white p-6"
            >
              <img
                :src="selectedGroup.developedImage"
                :alt="`${selectedGroup.title}展開圖`"
                class="block h-auto max-h-64 w-auto max-w-full object-contain"
              />
              <figcaption class="text-brand-600 mt-3 text-center text-sm">
                展開圖
              </figcaption>
            </figure>

            <!-- 盤形沒有展開圖，改附 Notion 的立體示意圖 -->
            <figure
              v-else-if="selectedGroup.id === 'tray'"
              class="border-nurse-200 m-0 grid place-items-center rounded-lg border bg-white p-6"
            >
              <img
                src="/images/products/bending/bend-tray-3d.png"
                alt="盤形立體示意圖"
                class="block h-auto max-h-64 w-auto max-w-full object-contain"
              />
              <figcaption class="text-brand-600 mt-3 text-center text-sm">
                盤形立體示意
              </figcaption>
            </figure>
          </div>
        </UIBoxCard>

        <UIBoxCard
          title="填寫規格"
          description="欄位即為圖面上的字母標示，另需填寫數量；參考圖與備註為選填。"
        >
          <div class="flex flex-col gap-5">
            <UIFieldGroup :col="12">
              <UIField
                v-for="segment in selectedShape.segments"
                :key="segment"
                :title="`${segment} 段長度`"
                :md="6"
              >
                <UIFormInputUnit
                  :model-value="segmentValue(segment)"
                  type="number"
                  suffix="cm"
                  :placeholder="`請輸入 ${segment} 段長度`"
                  @update:model-value="setSegmentValue(segment, $event)"
                />
              </UIField>

              <UIField
                v-if="selectedShape.developed"
                :title="`${selectedShape.developed} 展開總長`"
                :md="6"
              >
                <UIFormInputUnit
                  :model-value="segmentValue(selectedShape.developed)"
                  type="number"
                  suffix="cm"
                  placeholder="展開圖總長"
                  @update:model-value="
                    setSegmentValue(selectedShape.developed, $event)
                  "
                />
              </UIField>

              <UIField title="數量" :md="6">
                <UIFormInputUnit
                  :model-value="quantity ?? ''"
                  type="number"
                  min="1"
                  step="1"
                  suffix="支"
                  placeholder="請輸入數量"
                  @update:model-value="
                    quantity = $event === '' ? undefined : Number($event)
                  "
                />
              </UIField>

              <div
                v-if="hasFieldFiller"
                class="col-span-full bg-white max-md:hidden md:col-span-6"
              />
            </UIFieldGroup>

            <!-- 上傳與備註放在 UIFieldGroup 外面：這兩個都比一般欄位高，
                 塞進格線裡那一列會比其他列高一截 -->
            <div class="grid gap-2">
              <span class="text-brand-800 text-sm font-bold">
                上傳參考圖<span class="text-nurse-500 font-normal">
                  （選填）
                </span>
              </span>
              <!-- 編輯模式：File 物件無法從詢價單還原，只能顯示原本的檔名 -->
              <p
                v-if="mode === 'edit' && initialAttachmentName"
                class="text-nurse-600 m-0 text-xs"
              >
                原本的參考圖檔：{{ initialAttachmentName }}
                <span class="text-nurse-500">
                  （重新選擇會取代原本的；不選則保留）
                </span>
              </p>
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
              <span class="text-nurse-500 text-xs">
                {{ note.length }} / 200
              </span>
            </div>

            <div class="flex flex-col gap-3">
              <p v-if="!hasQuantity" class="text-nurse-500 m-0 text-sm">
                請填寫數量後即可加入詢價。
              </p>

              <div class="flex flex-wrap items-center justify-between gap-3">
                <UIFormButton variant="secondary" @click="goToStep('shape')">
                  上一步
                </UIFormButton>
                <!-- 兩顆送出鈕包在一起，wrap 時才不會有一顆跑去跟「上一步」並排 -->
                <div class="flex flex-wrap items-center gap-2">
                  <UIFormButton
                    :text="submitText"
                    icon="Plus"
                    :appearance="showInstantSubmit ? 'outline' : 'solid'"
                    :disabled="!canAddToCart"
                    @click="handleSubmit"
                  />
                  <UIFormButton
                    v-if="showInstantSubmit"
                    text="送出詢價"
                    icon="Send"
                    :disabled="!canAddToCart"
                    @click="handleInstant"
                  />
                </div>
              </div>
            </div>
          </div>
        </UIBoxCard>
      </div>
    </UIPageContent>
  </div>
</template>
