<script setup lang="ts">
export interface FormRadioOption {
  label: string
  value: string | number
  disabled?: boolean
}

const model = defineModel<string | number>({ required: true })
const generatedName = useId()

withDefaults(
  defineProps<{
    options: FormRadioOption[]
    name?: string
    direction?: 'horizontal' | 'vertical'
    disabled?: boolean
    warning?: boolean
  }>(),
  {
    name: undefined,
    direction: 'horizontal',
    disabled: false,
    warning: false,
  },
)
</script>

<template>
  <div
    class="flex gap-x-5 gap-y-3.5"
    :class="direction === 'vertical' ? 'flex-col' : 'flex-wrap'"
    role="radiogroup"
  >
    <UIFormRadio
      v-for="option in options"
      :key="option.value"
      v-model="model"
      :name="name || generatedName"
      :value="option.value"
      :label="option.label"
      :disabled="disabled || option.disabled"
      :warning="warning"
    />
  </div>
</template>
