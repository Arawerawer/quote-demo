<script setup lang="ts">
import type { Component } from 'vue'
import * as lucideIcons from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number | string
    strokeWidth?: number | string
  }>(),
  {
    size: 18,
    strokeWidth: 2.5,
  },
)

const iconName = computed(() => {
  const normalizedName = props.name
    .trim()
    .replace(/[-_\s]+([a-zA-Z0-9])/g, (_, character: string) =>
      character.toUpperCase(),
    )

  return normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1)
})

const icon = computed<Component | undefined>(() => {
  const candidate = lucideIcons[iconName.value as keyof typeof lucideIcons]
  return typeof candidate === 'object' || typeof candidate === 'function'
    ? (candidate as Component)
    : undefined
})
</script>

<template>
  <component
    :is="icon"
    v-if="icon"
    :size="size"
    :stroke-width="strokeWidth"
    aria-hidden="true"
  />
</template>
