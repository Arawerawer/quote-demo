<script setup lang="ts">
import { Check, Copy as CopyIcon } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    text?: string
    disabled?: boolean
  }>(),
  {
    text: '',
    disabled: false,
  },
)

const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined

const copyText = async () => {
  if (props.disabled || !props.text) return

  await navigator.clipboard.writeText(props.text)
  copied.value = true

  if (resetTimer) clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    copied.value = false
  }, 2000)
}

onBeforeUnmount(() => {
  if (resetTimer) clearTimeout(resetTimer)
})
</script>

<template>
  <div class="relative">
    <input
      class="form-control border-nurse-200 text-brand-900 read-only:bg-nurse-50 disabled:bg-nurse-100 disabled:text-nurse-500 h-11 w-full rounded-lg border bg-white p-3 pr-11 text-base outline-none read-only:cursor-default disabled:cursor-not-allowed"
      :value="text"
      :disabled="disabled"
      :aria-label="text || '可複製文字'"
    />
    <button
      class="text-brand-600 hover:not-disabled:bg-brand-50 focus-visible:outline-brand-300 disabled:text-nurse-400 absolute top-1/2 right-1.25 grid size-8.5 -translate-y-1/2 place-items-center rounded-md border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-1 disabled:cursor-not-allowed"
      type="button"
      :disabled="disabled || !text"
      :aria-label="copied ? '已複製文字' : '複製文字'"
      @click="copyText"
    >
      <Check v-if="copied" :size="19" aria-hidden="true" />
      <CopyIcon v-else :size="19" aria-hidden="true" />
    </button>
  </div>
</template>
