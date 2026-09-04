<script setup lang="ts">
import type {
  FormControlSize,
  FormControlStatus,
} from '../../../composables/useFormControlStyles'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    placeholder?: string
    rows?: number
    maxlength?: number
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    warning?: boolean
    resize?: 'none' | 'vertical' | 'horizontal' | 'both'
    status?: FormControlStatus
    size?: FormControlSize
  }>(),
  {
    placeholder: '',
    rows: 4,
    maxlength: undefined,
    required: false,
    disabled: false,
    readonly: false,
    warning: false,
    resize: 'vertical',
    status: 'default',
    size: 'md',
  },
)

const controlStatus = computed<FormControlStatus>(() =>
  props.warning ? 'error' : props.status,
)
</script>

<template>
  <textarea
    v-model="model"
    class="block min-h-26 py-2 leading-[1.6]"
    :class="useFormControlStyles(size, controlStatus, true)"
    :placeholder="placeholder"
    :rows="rows"
    :maxlength="maxlength"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :style="{ resize }"
    :aria-invalid="controlStatus === 'error' || undefined"
  />
</template>
