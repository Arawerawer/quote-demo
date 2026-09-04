<script setup lang="ts">
import { ReceiptText } from '@lucide/vue'

withDefaults(
  defineProps<{
    tone?: 'light' | 'dark'
  }>(),
  {
    tone: 'light',
  },
)

const { homeItem } = useAppNavigation()
</script>

<template>
  <NuxtLink
    class="flex min-w-0 items-center gap-1 no-underline"
    :class="tone === 'light' ? 'text-white' : 'text-brand-800'"
    :to="homeItem.to"
    aria-label="返回首頁"
  >
    <ReceiptText :size="24" :stroke-width="2" aria-hidden="true" />
    <strong class="px-2 leading-[1.4] max-sm:px-0 max-sm:text-sm">Logo</strong>
  </NuxtLink>
</template>
