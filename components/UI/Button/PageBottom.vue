<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary'
    type?: 'button' | 'submit'
  }>(),
  {
    variant: 'primary',
    type: 'button',
  },
)
</script>

<template>
  <button
    class="border-brand-600 inline-flex min-h-13 items-center justify-center rounded-full border px-5 py-3.5 text-base leading-[1.4] font-bold transition-[transform,background-color] duration-[160ms] active:scale-[0.98]"
    :class="
      props.variant === 'primary'
        ? 'bg-brand-500 hover:border-brand-700 hover:bg-brand-600 text-white'
        : 'text-brand-600 hover:border-brand-600 hover:bg-nurse-50 bg-white'
    "
    :type="type"
  >
    <slot />
  </button>
</template>
