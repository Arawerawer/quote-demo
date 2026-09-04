<script setup lang="ts">
import { Check } from '@lucide/vue'

const model = defineModel<boolean>({ default: false })

withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
    warning?: boolean
    bordered?: boolean
    ariaLabel?: string
  }>(),
  {
    label: '',
    disabled: false,
    warning: false,
    bordered: false,
    ariaLabel: undefined,
  },
)
</script>

<template>
  <label
    class="form-checkbox group relative inline-flex items-center gap-2.25 text-[15px]"
    :class="[
      bordered ? 'h-11 w-full rounded-lg border px-3' : 'w-fit',
      disabled
        ? 'form-checkbox--disabled text-nurse-400 cursor-not-allowed'
        : warning
          ? 'form-checkbox--warning cursor-pointer text-rose-600'
          : 'text-brand-900 cursor-pointer',
      bordered
        ? disabled
          ? 'border-nurse-200 bg-nurse-50'
          : warning
            ? 'border-rose-500 bg-white'
            : 'border-nurse-200 has-checked:border-brand-500 bg-white'
        : '',
    ]"
  >
    <input
      v-model="model"
      class="peer sr-only"
      type="checkbox"
      :disabled="disabled"
      :aria-label="ariaLabel"
    />
    <span
      class="form-checkbox__control grid size-5 shrink-0 place-items-center rounded-[5px] border-[1.5px] bg-white text-white transition-[border-color,background-color,box-shadow] duration-160"
      :class="[
        disabled
          ? 'border-nurse-200 bg-nurse-100'
          : warning
            ? 'border-rose-500 group-hover:border-rose-600'
            : 'border-nurse-400 group-hover:border-brand-500',
        warning
          ? 'peer-checked:border-rose-500 peer-checked:bg-rose-500 peer-focus-visible:ring-3 peer-focus-visible:ring-rose-50'
          : 'peer-checked:border-brand-500 peer-checked:bg-brand-500 peer-focus-visible:ring-brand-50 peer-focus-visible:ring-3',
      ]"
      aria-hidden="true"
    >
      <Check v-if="model" :size="13" :stroke-width="3" />
    </span>
    <span v-if="label || $slots.default"
      ><slot>{{ label }}</slot></span
    >
  </label>
</template>
