<script setup lang="ts">
import { Eye, EyeOff } from '@lucide/vue'
import type {
  FormControlSize,
  FormControlStatus,
} from '../../../composables/useFormControlStyles'

const model = defineModel<string>({ default: '' })
const isVisible = ref(false)

const props = withDefaults(
  defineProps<{
    placeholder?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    autocomplete?: string
    warning?: boolean
    status?: FormControlStatus
    size?: FormControlSize
  }>(),
  {
    placeholder: '',
    required: false,
    disabled: false,
    readonly: false,
    autocomplete: 'current-password',
    warning: false,
    status: 'default',
    size: 'md',
  },
)

const controlStatus = computed<FormControlStatus>(() =>
  props.warning ? 'error' : props.status,
)
</script>

<template>
  <div class="relative">
    <input
      v-model="model"
      :class="[useFormControlStyles(size, controlStatus, true), 'pr-11']"
      :type="isVisible ? 'text' : 'password'"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :autocomplete="autocomplete"
      :aria-invalid="controlStatus === 'error' || undefined"
    />
    <button
      class="text-brand-600 hover:not-disabled:bg-brand-50 focus-visible:outline-brand-300 disabled:text-nurse-400 absolute top-1/2 right-1.25 grid size-8.5 -translate-y-1/2 place-items-center rounded-md border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-1 disabled:cursor-not-allowed"
      type="button"
      :disabled="disabled"
      :aria-label="isVisible ? '隱藏密碼' : '顯示密碼'"
      :aria-pressed="isVisible"
      @click="isVisible = !isVisible"
    >
      <EyeOff v-if="isVisible" :size="19" aria-hidden="true" />
      <Eye v-else :size="19" aria-hidden="true" />
    </button>
  </div>
</template>
