<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    text: string
    to?: string
  }>(),
  {
    text: '返回',
    to: undefined,
  },
)
</script>

<template>
  <NuxtLink
    class="text-brand-600 hover:text-brand-500 group flex items-center gap-3 text-sm font-bold no-underline"
    :to="props.to"
  >
    <div
      class="bg-brand-500/20 group-hover:bg-brand-500 grid h-8 w-8 place-items-center rounded-full transition-colors duration-200"
    >
      <ArrowLeft
        :size="20"
        :stroke-width="3"
        class="text-brand-600 inline-block text-sm font-bold no-underline transition-colors duration-200 group-hover:text-white"
      />
    </div>
    {{ props.text }}</NuxtLink
  >
</template>
