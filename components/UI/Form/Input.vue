<script setup lang="ts">
import type {
  FormControlSize,
  FormControlStatus,
} from '../../../composables/useFormControlStyles'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    type?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    warning?: boolean
    status?: FormControlStatus
    size?: FormControlSize
  }>(),
  {
    type: 'text',
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
    v-model="model"
    :class="useFormControlStyles(size, controlStatus, true)"
    :type="type"
    :placeholder="placeholder"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :aria-invalid="controlStatus === 'error' || undefined"
  />
</template>
