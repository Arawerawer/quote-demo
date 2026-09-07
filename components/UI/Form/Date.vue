<script setup lang="ts">
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
  },
)

const controlStatus = computed<FormControlStatus>(() =>
  props.warning ? 'error' : props.status,
)

const inputRef = ref<HTMLInputElement | null>(null)

// 唯一的日曆開啟入口：原生 indicator 已在 CSS 停用，
// 只有這裡會叫起 picker，因此不會重複 toggle 造成閃爍
const openPicker = () => {
  const input = inputRef.value
  if (!input || props.disabled || props.readonly) return

  try {
    input.showPicker()
  } catch {
    // 舊版瀏覽器沒有 showPicker 時會 throw；
    // 此時 input 已聚焦，退回鍵盤輸入，不中斷流程
  }
}
</script>

<template>
  <div class="form-date relative w-full">
    <input
      ref="inputRef"
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
      @click="openPicker"
    />
    <UIIcon
      name="CalendarDays"
      :size="18"
      class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
      :class="disabled ? 'text-nurse-300' : 'text-nurse-400'"
    />
  </div>
</template>

<style scoped>
/* 整個欄位可點開日曆，開啟動作由 script 的 showPicker() 單一入口負責 */
.form-date input[type='date'] {
  cursor: pointer;
}

/* 完全停用原生 indicator：避免它與 showPicker() 形成第二條開啟路徑，
   兩條路徑同時觸發會讓 picker 被 toggle 兩次而閃爍 */
.form-date input[type='date']::-webkit-calendar-picker-indicator {
  display: none;
}

.form-date input[type='date']:disabled,
.form-date input[type='date']:read-only {
  cursor: inherit;
}
</style>
