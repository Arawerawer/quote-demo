<script setup lang="ts">
import type { Component } from 'vue'

withDefaults(
  defineProps<{
    icon: Component
    text: string
    iconSize?: number
  }>(),
  {
    iconSize: 16,
  },
)
</script>

<template>
  <span class="inline-flex min-w-0 items-center gap-2">
    <component
      :is="icon"
      :size="iconSize"
      class="shrink-0"
      aria-hidden="true"
    />
    <span>{{ text }}</span>
  </span>
</template>
