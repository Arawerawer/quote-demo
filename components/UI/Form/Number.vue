<script setup lang="ts">
import type {
  FormControlSize,
  FormControlStatus,
} from '../../../composables/useFormControlStyles'

const model = defineModel<number | undefined>({ default: undefined })

const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
    placeholder?: string
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
    step: 1,
    placeholder: '',
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
</script>

<template>
  <input
    v-model.number="model"
    :class="useFormControlStyles(size, controlStatus, true)"
    type="number"
    :min="min"
    :max="max"
    :step="step"
    :placeholder="placeholder"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :aria-invalid="controlStatus === 'error' || undefined"
  />
</template>
