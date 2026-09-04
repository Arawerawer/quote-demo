<script setup lang="ts">
import { CircleAlert } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    label?: string
    star?: boolean
    merge?: boolean
    groupClass?: string
    boxClass?: string
    warning?: boolean
    warningText?: string
    row?: boolean
  }>(),
  {
    label: '',
    star: false,
    merge: false,
    groupClass: '',
    boxClass: '',
    warning: false,
    warningText: '',
    row: false,
  },
)

const hasWarning = computed(() => props.warning || props.warningText !== '')
</script>

<template>
  <div
    class="form-group flex flex-col gap-1"
    :class="[
      { 'form-group--warning': hasWarning, 'form-group--row': row },
      groupClass,
    ]"
  >
    <slot name="slot-before" />

    <div v-if="label" class="form-text form-group__label">
      <p
        class="m-0 flex min-h-5 items-center gap-1 text-sm font-bold"
        :class="hasWarning ? 'text-rose-700' : ''"
      >
        {{ label === 'default' ? '\u00A0' : label }}
        <span v-if="star" class="text-rose-500" aria-hidden="true">*</span>
        <slot name="slot-label" />
      </p>
    </div>

    <div
      :class="[{ 'form-box w-full': !merge, 'form-merge': merge }, boxClass]"
    >
      <slot />
    </div>

    <div v-if="warningText" class="form-text form-group__warning">
      <p
        class="m-0 flex items-center gap-1.25 text-[13px] leading-normal text-rose-700"
      >
        <CircleAlert :size="15" :stroke-width="2.5" aria-hidden="true" />
        {{ warningText }}
      </p>
    </div>

    <slot name="slot-after" />
  </div>
</template>

<style scoped lang="scss">
.form-group {
  &--warning :deep(.form-control) {
    border-color: var(--color-rose-500);
    color: var(--color-rose-700);

    input,
    select,
    textarea {
      color: var(--color-rose-700);
    }

    &:focus {
      box-shadow: 0 0 0 2px var(--color-rose-50);
    }
  }

  &--warning :deep(.form-radio:not(.form-radio--disabled)),
  &--warning :deep(.form-checkbox:not(.form-checkbox--disabled)) {
    color: var(--color-rose-700);
  }

  &--warning :deep(.form-radio__control),
  &--warning :deep(.form-checkbox__control) {
    border-color: var(--color-rose-500);
  }

  &--warning :deep(.form-radio input:checked + .form-radio__control span),
  &--warning :deep(.form-checkbox input:checked + .form-checkbox__control) {
    background: var(--color-rose-500);
  }

  &--warning :deep(.form-range input) {
    background: var(--color-rose-200);
  }

  &--warning :deep(.form-range output) {
    color: var(--color-rose-700);
    background: var(--color-rose-50);
  }

  :deep(.form-group__optional) {
    color: var(--color-brand-600);
    font-size: 12px;
    font-weight: 400;
  }

  &--row {
    flex-direction: row;
    align-items: center;

    .form-group__label {
      flex: 0 0 auto;
      margin-right: 0.5rem;
      padding-left: 0.5rem;
    }

    .form-box {
      flex: 1 1 auto;
    }
  }
}

// .form-merge 保留給未來多欄位合併使用，目前不設定任何樣式。
</style>
