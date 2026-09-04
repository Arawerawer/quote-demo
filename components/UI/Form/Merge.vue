<script setup lang="ts">
import type { FormControlStatus } from '../../../composables/useFormControlStyles'

const props = withDefaults(
  defineProps<{
    warning?: boolean
    status?: FormControlStatus
  }>(),
  {
    warning: false,
    status: 'default',
  },
)

const mergeStatus = computed<FormControlStatus>(() =>
  props.warning ? 'error' : props.status,
)

const statusClasses: Record<FormControlStatus, string> = {
  default:
    'border-nurse-200 focus-within:border-brand-500 focus-within:ring-brand-50',
  error:
    'border-rose-500 focus-within:border-rose-600 focus-within:ring-rose-50',
  warning:
    'border-desert-500 focus-within:border-desert-600 focus-within:ring-desert-100',
}
</script>

<template>
  <div
    class="form-merge relative flex w-full items-stretch overflow-hidden rounded-lg border bg-white transition-[border-color,box-shadow] duration-160 focus-within:ring-2"
    :class="statusClasses[mergeStatus]"
  >
    <slot />
  </div>
</template>

<style lang="scss">
.form-merge {
  > * {
    min-width: 0;
    flex: 1 1 0%;
  }

  > .form-button {
    flex: 0 0 auto;
  }

  > .form-control,
  > .form-select > .form-control,
  > .form-multiselect > .form-control,
  > .form-radio,
  > .form-checkbox,
  > .form-button {
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }

  > .form-control:focus,
  > .form-select > .form-control:focus,
  > .form-multiselect > .form-control:focus,
  > .form-button:focus {
    outline: 0;
    box-shadow: none;
  }

  > * + .form-control,
  > * + .form-select,
  > * + .form-multiselect,
  > * + .form-radio,
  > * + .form-checkbox,
  > * + .form-button {
    border-left: 1px solid var(--color-nurse-200);
  }
}
</style>
