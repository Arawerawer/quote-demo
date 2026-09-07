<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import type {
  FormControlSize,
  FormControlStatus,
} from '../../../composables/useFormControlStyles'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    min?: string
    max?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    warning?: boolean
    status?: FormControlStatus
    size?: FormControlSize
    /** 面板最大高度，用於空間不足時判斷往上或往下開 */
    maxMenuHeight?: number
  }>(),
  {
    min: undefined,
    max: undefined,
    required: false,
    disabled: false,
    readonly: false,
    warning: false,
    status: 'default',
    size: 'md',
    maxMenuHeight: 340,
  },
)

const controlStatus = computed<FormControlStatus>(() =>
  props.warning ? 'error' : props.status,
)

/**
 * 桌機用自製日曆、手機保留原生 <input type="date">。
 *
 * 原因：原生 input 點擊時年／月／日 segment 會被瀏覽器畫上系統藍反白，
 * 那是畫在 shadow DOM 內部的 selection highlight，CSS 進不去改不掉。
 * 但這個症狀只出現在桌機；手機的原生日期滾輪體驗比自製日曆好，
 * 所以只在桌機換掉，手機維持原生。
 */
const isTouchDevice = ref(false)

const rootElement = ref<HTMLElement>()
const menuElement = ref<HTMLElement>()
const nativeInput = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const menuPosition = ref<Record<string, string>>({})

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六']

// ---- 日期工具：一律走「本地時間」，不要用 toISOString()（那是 UTC，會差一天）----

const toIsoDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseIsoDate = (value: string) => {
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!matched) return null

  const date = new Date(
    Number(matched[1]),
    Number(matched[2]) - 1,
    Number(matched[3]),
  )
  return Number.isNaN(date.getTime()) ? null : date
}

const selectedDate = computed(() => parseIsoDate(model.value))

/** 面板目前顯示的月份，以該月一號代表 */
const viewMonth = ref(new Date())

const syncViewMonth = () => {
  const base = selectedDate.value ?? new Date()
  viewMonth.value = new Date(base.getFullYear(), base.getMonth(), 1)
}

const monthLabel = computed(
  () =>
    `${viewMonth.value.getFullYear()}年${String(viewMonth.value.getMonth() + 1).padStart(2, '0')}月`,
)

/** 觸發器顯示的文字，維持與原生一致的 yyyy/mm/dd */
const displayText = computed(() => {
  const date = selectedDate.value
  if (!date) return ''
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
})

const isOutOfRange = (iso: string) => {
  if (props.min && iso < props.min) return true
  if (props.max && iso > props.max) return true
  return false
}

const todayIso = computed(() => toIsoDate(new Date()))

/**
 * 月曆格子：固定補滿前後月，讓每個月都是完整的整週，
 * 高度才不會因月份而跳動。
 */
const calendarDays = computed(() => {
  const year = viewMonth.value.getFullYear()
  const month = viewMonth.value.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const gridStart = new Date(year, month, 1 - firstWeekday)
  const days = []

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + index,
    )
    const iso = toIsoDate(date)

    days.push({
      iso,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: iso === todayIso.value,
      isSelected: iso === model.value,
      isDisabled: isOutOfRange(iso),
    })
  }

  return days
})

// ---- 面板開闔與定位（沿用 UIFormMultiSelect 的做法）----

function updateMenuPosition() {
  if (!rootElement.value) return

  const rect = rootElement.value.getBoundingClientRect()
  const viewportPadding = 12
  const availableBelow = window.innerHeight - rect.bottom - viewportPadding
  const availableAbove = rect.top - viewportPadding
  const opensAbove =
    availableBelow < Math.min(props.maxMenuHeight, 240) &&
    availableAbove > availableBelow
  const menuWidth = Math.min(
    Math.max(rect.width, 280),
    window.innerWidth - viewportPadding * 2,
  )

  menuPosition.value = {
    left: `${Math.max(viewportPadding, Math.min(rect.left, window.innerWidth - menuWidth - viewportPadding))}px`,
    width: `${menuWidth}px`,
    ...(opensAbove
      ? { bottom: `${window.innerHeight - rect.top + 6}px` }
      : { top: `${rect.bottom + 6}px` }),
  }
}

function openMenu() {
  if (props.disabled || props.readonly) return

  syncViewMonth()
  isOpen.value = true
  nextTick(updateMenuPosition)
}

function closeMenu() {
  isOpen.value = false
}

function toggleMenu() {
  if (isOpen.value) closeMenu()
  else openMenu()
}

function shiftMonth(offset: number) {
  viewMonth.value = new Date(
    viewMonth.value.getFullYear(),
    viewMonth.value.getMonth() + offset,
    1,
  )
}

function selectDay(iso: string, isDisabled: boolean) {
  if (isDisabled) return

  model.value = iso
  closeMenu()
}

function selectToday() {
  if (isOutOfRange(todayIso.value)) return

  model.value = todayIso.value
  closeMenu()
}

function clearSelection() {
  model.value = ''
  closeMenu()
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeMenu()
    return
  }

  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openMenu()
  }
}

function handleDocumentPointerDown(event: PointerEvent) {
  const target = event.target as Node
  if (
    !rootElement.value?.contains(target) &&
    !menuElement.value?.contains(target)
  ) {
    closeMenu()
  }
}

/** 手機才會走到這裡：原生 input 的日曆由 showPicker() 單一入口叫起 */
const openNativePicker = () => {
  const input = nativeInput.value
  if (!input || props.disabled || props.readonly) return

  try {
    input.showPicker()
  } catch {
    // 舊版瀏覽器沒有 showPicker 時會 throw；
    // 此時 input 已聚焦，退回鍵盤輸入，不中斷流程
  }
}

onMounted(() => {
  // 在 onMounted 才判斷，避免 SSR 與瀏覽器結果不一致造成 hydration mismatch
  isTouchDevice.value = window.matchMedia('(pointer: coarse)').matches

  document.addEventListener('pointerdown', handleDocumentPointerDown)
  window.addEventListener('resize', updateMenuPosition)
  window.addEventListener('scroll', updateMenuPosition, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  window.removeEventListener('resize', updateMenuPosition)
  window.removeEventListener('scroll', updateMenuPosition, true)
})
</script>

<template>
  <div ref="rootElement" class="form-date relative w-full">
    <!-- 手機：原生 input，保留系統日期滾輪 -->
    <input
      v-if="isTouchDevice"
      ref="nativeInput"
      v-model="model"
      class="pr-10 scheme-light"
      :class="useFormControlStyles(size, controlStatus, true)"
      type="date"
      :min="min"
      :max="max"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :aria-invalid="controlStatus === 'error' || undefined"
      @click="openNativePicker"
    />

    <!-- 桌機：自製觸發器 + 日曆面板 -->
    <template v-else>
      <div
        class="relative flex w-full items-center pr-10 text-left"
        :class="[
          useFormControlStyles(size, controlStatus),
          isOpen ? 'border-brand-500 ring-brand-50 ring-2' : '',
          disabled ? 'bg-nurse-100 text-nurse-500 cursor-not-allowed' : '',
          readonly ? 'bg-nurse-50 text-nurse-500' : 'cursor-pointer',
        ]"
        role="combobox"
        :tabindex="disabled ? -1 : 0"
        :aria-expanded="isOpen"
        :aria-disabled="disabled || undefined"
        :aria-invalid="controlStatus === 'error' || undefined"
        aria-haspopup="dialog"
        @click="toggleMenu"
        @keydown="handleTriggerKeydown"
      >
        <span v-if="displayText" class="truncate">{{ displayText }}</span>
        <span v-else class="text-nurse-300 truncate">年/月/日</span>
      </div>

      <Teleport to="body">
        <div
          v-if="isOpen"
          ref="menuElement"
          class="border-nurse-200 fixed z-50 flex flex-col overflow-hidden rounded-lg border bg-white shadow-[0_12px_28px_rgba(0,29,69,0.16)]"
          :style="menuPosition"
          role="dialog"
          aria-label="選擇日期"
        >
          <div class="border-nurse-100 flex items-center border-b px-2 py-2">
            <span class="text-brand-900 flex-1 px-1 text-sm font-bold">{{
              monthLabel
            }}</span>
            <button
              class="text-brand-600 hover:bg-brand-50 focus-visible:outline-brand-500 grid size-8 place-items-center rounded-md focus-visible:outline-2"
              type="button"
              aria-label="上個月"
              @click="shiftMonth(-1)"
            >
              <ChevronLeft :size="18" :stroke-width="2.5" aria-hidden="true" />
            </button>
            <button
              class="text-brand-600 hover:bg-brand-50 focus-visible:outline-brand-500 grid size-8 place-items-center rounded-md focus-visible:outline-2"
              type="button"
              aria-label="下個月"
              @click="shiftMonth(1)"
            >
              <ChevronRight :size="18" :stroke-width="2.5" aria-hidden="true" />
            </button>
          </div>

          <div class="p-2">
            <div class="mb-1 grid grid-cols-7">
              <span
                v-for="label in WEEKDAY_LABELS"
                :key="label"
                class="text-nurse-500 grid h-8 place-items-center text-xs"
                >{{ label }}</span
              >
            </div>
            <div class="grid grid-cols-7 gap-y-0.5">
              <button
                v-for="cell in calendarDays"
                :key="cell.iso"
                class="grid h-9 place-items-center rounded-md text-sm transition-colors duration-160"
                :class="[
                  cell.isSelected
                    ? 'bg-brand-500 font-bold text-white'
                    : cell.isDisabled
                      ? 'text-nurse-300 cursor-not-allowed'
                      : cell.isCurrentMonth
                        ? 'text-brand-900 hover:bg-brand-50'
                        : 'text-nurse-400 hover:bg-brand-50',
                  cell.isToday && !cell.isSelected
                    ? 'ring-brand-300 ring-1 ring-inset'
                    : '',
                ]"
                type="button"
                :disabled="cell.isDisabled"
                :aria-current="cell.isToday ? 'date' : undefined"
                :aria-selected="cell.isSelected"
                @click="selectDay(cell.iso, cell.isDisabled)"
              >
                {{ cell.day }}
              </button>
            </div>
          </div>

          <div
            class="border-nurse-100 flex items-center justify-between border-t px-2 py-1.5"
          >
            <button
              class="text-brand-600 hover:bg-brand-50 focus-visible:outline-brand-500 rounded-md px-2 py-1 text-sm focus-visible:outline-2"
              type="button"
              @click="clearSelection"
            >
              清除
            </button>
            <button
              class="text-brand-600 hover:bg-brand-50 focus-visible:outline-brand-500 rounded-md px-2 py-1 text-sm focus-visible:outline-2"
              type="button"
              @click="selectToday"
            >
              今天
            </button>
          </div>
        </div>
      </Teleport>

      <!-- 原生驗證的掛載點：自製觸發器不是表單控制項，required 要靠這個 -->
      <input
        v-if="required"
        class="sr-only"
        tabindex="-1"
        :value="model"
        required
        aria-hidden="true"
      />
    </template>

    <UIIcon
      name="CalendarDays"
      :size="18"
      class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
      :class="disabled ? 'text-nurse-300' : 'text-nurse-400'"
    />
  </div>
</template>

<style scoped>
/* 注意：碰 shadow DOM 的規則不能寫在這裡，scoped 會讓它們失效，
   已移到 assets/styles/main.css 的 @layer components，理由寫在那邊。 */

.form-date input[type='date'] {
  cursor: pointer;
}

.form-date input[type='date']:disabled,
.form-date input[type='date']:read-only {
  cursor: inherit;
}
</style>
