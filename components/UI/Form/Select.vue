<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import type {
  FormControlSize,
  FormControlStatus,
} from '../../../composables/useFormControlStyles'

export interface FormSelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

const model = defineModel<string | number>({ default: '' })

const props = withDefaults(
  defineProps<{
    options: FormSelectOption[]
    placeholder?: string
    required?: boolean
    disabled?: boolean
    warning?: boolean
    status?: FormControlStatus
    size?: FormControlSize
  }>(),
  {
    placeholder: '請選擇',
    required: false,
    disabled: false,
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
  <span class="form-select relative block">
    <select
      v-model="model"
      class="appearance-none pr-9.5 font-normal"
      :class="useFormControlStyles(size, controlStatus)"
      :required="required"
      :disabled="disabled"
      :aria-invalid="controlStatus === 'error' || undefined"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
    <ChevronDown
      class="text-brand-600 pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
      :size="17"
      :stroke-width="2.5"
      aria-hidden="true"
    />
  </span>
</template>
