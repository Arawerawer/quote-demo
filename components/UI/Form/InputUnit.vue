<script setup lang="ts">
import type {
  FormControlSize,
  FormControlStatus,
} from '../../../composables/useFormControlStyles'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    type?: string
    placeholder?: string
    prefix?: string
    suffix?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    warning?: boolean
    status?: FormControlStatus
    size?: FormControlSize
  }>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '',
    prefix: '',
    suffix: '',
    required: false,
    disabled: false,
    readonly: false,
    warning: false,
    status: 'default',
    size: 'md',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const controlStatus = computed<FormControlStatus>(() =>
  props.warning ? 'error' : props.status,
)

const model = computed({
  get: () => props.modelValue,
  set: (value: string | number) => emit('update:modelValue', value),
})
</script>

<template>
  <div
    class="form-control flex items-center overflow-hidden"
    :class="[
      useFormControlStyles(size, controlStatus),
      controlStatus === 'error'
        ? 'border-rose-500 focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-50'
        : controlStatus === 'warning'
          ? 'border-desert-500 focus-within:border-desert-600 focus-within:ring-desert-100 focus-within:ring-2'
          : 'border-nurse-200 focus-within:border-brand-500 focus-within:ring-brand-50 focus-within:ring-2',
      disabled ? 'bg-nurse-100 text-nurse-500 cursor-not-allowed' : '',
      readonly ? 'bg-nurse-50 text-nurse-500 cursor-default' : '',
    ]"
  >
    <span v-if="prefix" class="text-nurse-600 shrink-0 pl-3" aria-hidden="true">
      {{ prefix }}
    </span>
    <input
      v-bind="$attrs"
      v-model="model"
      class="text-brand-900 placeholder:text-nurse-300 disabled:text-nurse-500 read-only:text-nurse-500 min-w-0 flex-1 border-0 bg-transparent px-0 py-0 outline-none read-only:cursor-default focus:ring-0 disabled:cursor-not-allowed"
      :class="{ 'pl-2': prefix, 'pr-2': suffix }"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :aria-invalid="controlStatus === 'error' || undefined"
    />
    <span v-if="suffix" class="text-nurse-600 shrink-0" aria-hidden="true">
      {{ suffix }}
    </span>
  </div>
</template>
