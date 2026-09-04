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
    step?: number
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
    step: 60,
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
    v-model="model"
    class="scheme-light"
    :class="useFormControlStyles(size, controlStatus, true)"
    type="time"
    :min="min"
    :max="max"
    :step="step"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :aria-invalid="controlStatus === 'error' || undefined"
  />
</template>
