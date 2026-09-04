<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text?: string
    variant?:
      | 'default'
      | 'primary'
      | 'secondary'
      | 'cancel'
      | 'warning'
      | 'danger'
      | 'title'
  }>(),
  {
    text: '',
    variant: 'default',
  },
)

const variantClasses: Record<NonNullable<typeof props.variant>, string> = {
  default: 'ui-list-item--default border-nurse-200 bg-white text-neutral-900',
  primary: 'ui-list-item--primary border-brand-600 bg-brand-500 text-white',
  secondary:
    'ui-list-item--secondary border-emerald-700 bg-emerald-600 text-white',
  cancel:
    'ui-list-item--cancel border-secondary-700 bg-secondary-600 text-white',
  warning: 'ui-list-item--warning border-warning-600 bg-warning-500 text-white',
  danger: 'ui-list-item--danger border-danger-600 bg-danger-500 text-white',
  title: 'ui-list-item--title border-brand-600 bg-brand-500 text-white',
}
</script>

<template>
  <div
    class="ui-list-item flex min-h-11 min-w-0 items-center border-b px-3 py-2 text-left text-base last:border-b-0"
    :class="variantClasses[props.variant]"
  >
    <slot>{{ text }}</slot>
  </div>
</template>
