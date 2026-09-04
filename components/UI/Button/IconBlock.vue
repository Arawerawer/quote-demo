<script setup lang="ts">
import type { Component } from 'vue'
import { ChevronRight } from '@lucide/vue'

defineProps<{
  title: string
  description: string
  icon: Component
  to: string
}>()
</script>

<template>
  <NuxtLink
    class="border-nurse-200 text-brand-900 hover:border-brand-300 grid min-h-15 grid-cols-[auto_1fr_auto] items-start gap-4 rounded-[18px] border bg-white p-3 no-underline transition-[transform,border-color] duration-[160ms]"
    :to="to"
  >
    <span
      class="bg-brand-50 text-brand-600 grid size-12 place-items-center rounded-lg"
    >
      <component :is="icon" :size="24" aria-hidden="true" />
    </span>

    <span class="grid">
      <strong class="text-lg">{{ title }}</strong>
      <span class="text-nurse-600 text-[13px]">{{ description }}</span>
    </span>

    <ChevronRight
      :size="20"
      class="text-brand-500 grid h-full place-items-center"
      aria-hidden="true"
    />
  </NuxtLink>
</template>
