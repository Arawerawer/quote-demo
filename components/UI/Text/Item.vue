<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    content: string
    titleClass?: string
    contentClass?: string
    contentStrong?: boolean
    layout?: 'horizontal' | 'vertical'
  }>(),
  {
    titleClass: '',
    contentClass: '',
    contentStrong: false,
    layout: 'horizontal',
  },
)
</script>

<template>
  <div
    class="text-item"
    :class="
      layout === 'horizontal'
        ? 'text-item--horizontal flex items-center justify-between gap-5'
        : 'text-item--vertical flex flex-col'
    "
  >
    <dt class="text-item__title text-brand-600 m-0" :class="titleClass">
      {{ title }}
    </dt>
    <dd
      class="text-item__content m-0"
      :class="[
        { 'text-item__content--strong font-bold': contentStrong },
        contentClass,
      ]"
    >
      {{ content }}
    </dd>
  </div>
</template>
