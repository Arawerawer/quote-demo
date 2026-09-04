<script setup lang="ts">
import { ImageOff } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    src?: string | null
    alt?: string
    aspectRatio?: string
    objectFit?: 'cover' | 'contain'
  }>(),
  {
    src: null,
    alt: '',
    aspectRatio: '4 / 3',
    objectFit: 'cover',
  },
)

const loadFailed = ref(false)
const showImage = computed(() => Boolean(props.src) && !loadFailed.value)

watch(
  () => props.src,
  () => {
    loadFailed.value = false
  },
)
</script>

<template>
  <div
    class="border-nurse-200 bg-nurse-50 relative grid w-full place-items-center overflow-hidden rounded-2xl border"
    :style="{ aspectRatio }"
  >
    <img
      v-if="showImage"
      :src="src || undefined"
      :alt="alt"
      class="absolute inset-0 size-full"
      :class="objectFit === 'contain' ? 'object-contain' : 'object-cover'"
      @error="loadFailed = true"
    />

    <div
      v-else
      class="text-nurse-500 flex flex-col items-center justify-center gap-2 p-5 text-center"
      role="status"
    >
      <ImageOff :size="32" :stroke-width="1.6" aria-hidden="true" />
      <span class="text-sm font-bold">無圖片</span>
    </div>
  </div>
</template>
