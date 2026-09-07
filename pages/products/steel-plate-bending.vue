<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'

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
  { id: 'spec', title: '填尺寸' },
]

const currentStep = ref<Step>('cut')
const selectedGroupId = ref<string | null>(null)
const selectedShapeId = ref<string | null>(null)
// 以 `${shapeId}-${代號}` 為 key 存各段尺寸，切換形狀時不互相污染
const segmentValues = ref<Record<string, string>>({})

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
const isStepReachable = (step: Step) =>
  step === 'cut' ||
  (step === 'shape' && Boolean(selectedGroupId.value)) ||
  (step === 'spec' && Boolean(selectedShapeId.value))

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

// 只做標記，不自動跳下一步——由使用者按「下一步」決定何時前進
const selectGroup = (groupId: string) => {
  selectedGroupId.value = groupId
  selectedShapeId.value = null
}

const selectShape = (shapeId: string) => {
  selectedShapeId.value = shapeId
}

const segmentKey = (shapeId: string, segment: string) => `${shapeId}-${segment}`

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

const { addItem } = useQuoteCart()

// 加入成功的提示，1.5 秒自動關；不放確認鈕才不會擋住接著填下一筆
const isAddedAlertOpen = ref(false)
const addedAlertText = ref('')

// 該形狀所有要填的代號（含展開總長）
const activeSegments = computed(() => {
  const shape = selectedShape.value

  if (!shape) {
    return []
  }

  return shape.developed ? [...shape.segments, shape.developed] : shape.segments
})

// 至少填一格才給加入，避免整筆空白進詢價單。
// 這只是防呆，不做數值範圍檢查——Notion 的限制條件是打問號的。
const canAddToCart = computed(() =>
  activeSegments.value.some((segment) => segmentValue(segment) !== ''),
)

// 欄位是兩欄排的，總數為奇數時最後會空半格，
// 露出 UIFieldGroup 當格線用的灰底；補一格白的蓋掉。
const hasFieldFiller = computed(() => activeSegments.value.length % 2 === 1)

const addToCart = () => {
  const group = selectedGroup.value
  const shape = selectedShape.value

  if (!group || !shape || !canAddToCart.value) {
    return
  }

  const detail = activeSegments.value
    .filter((segment) => segmentValue(segment) !== '')
    .map((segment) => `${segment} ${segmentValue(segment)}cm`)
    .join('、')

  const summary = `${group.title} ${shape.title}`

  addItem({
    category: '鋼板彎折',
    summary,
    detail,
  })

  // 清掉這一種已填的尺寸，回到第一步方便接著填下一筆
  for (const segment of activeSegments.value) {
    delete segmentValues.value[segmentKey(shape.id, segment)]
  }

  addedAlertText.value = `${summary}\n${detail}`
  isAddedAlertOpen.value = true

  goToStep('cut')
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
      title="鋼板彎折"
      description="依序選擇彎折刀數與形狀，最後依圖面標示輸入各段尺寸。"
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
              選好刀數後，按右上角「下一步」繼續。
            </p>
          </div>

          <UIFormButton
            text="下一步"
            icon="ChevronRight"
            icon-position="right"
            :disabled="!selectedGroupId"
            @click="goToStep('shape')"
          />
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
        description="選好形狀後，按右下角「下一步」繼續。"
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

          <div class="flex flex-wrap items-center justify-between gap-3">
            <UIFormButton variant="secondary" @click="goToStep('cut')">
              上一步
            </UIFormButton>
            <UIFormButton
              text="下一步"
              icon="ChevronRight"
              icon-position="right"
              :disabled="!selectedShapeId"
              @click="goToStep('spec')"
            />
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
          title="輸入尺寸"
          description="欄位即為圖面上的字母標示，Notion 未定義其他欄位，故只列這些。"
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

              <div
                v-if="hasFieldFiller"
                class="col-span-full bg-white max-md:hidden md:col-span-6"
              />
            </UIFieldGroup>

            <div class="flex flex-wrap items-center justify-between gap-3">
              <UIFormButton variant="secondary" @click="goToStep('shape')">
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
