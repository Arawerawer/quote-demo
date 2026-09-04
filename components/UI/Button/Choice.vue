<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text: string
    state?: 'default' | 'selected' | 'disabled'
    statusText?: string
  }>(),
  {
    state: 'default',
    statusText: '',
  },
)

const stateClasses = {
  default:
    'border-nurse-200 bg-white text-brand-900 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600',
  selected: 'border-brand-600 bg-brand-500 text-white',
  disabled: 'cursor-not-allowed border-nurse-100 bg-nurse-50 text-nurse-300',
} as const

defineEmits<{ select: [] }>()
</script>

<template>
  <button
    class="flex min-h-11 items-center justify-center gap-[5px] rounded-lg border p-2 font-medium transition-[color,background-color,border-color] duration-[160ms]"
    :class="stateClasses[props.state]"
    type="button"
    :disabled="state === 'disabled'"
    :aria-pressed="state === 'selected'"
    @click="$emit('select')"
  >
    <span :class="state === 'disabled' ? 'line-through' : ''">{{ text }}</span>
    <small
      v-if="statusText"
      class="bg-nurse-300 rounded px-1 py-0.5 text-[8px] leading-[1.2] text-white"
      >{{ statusText }}</small
    >
  </button>
</template>
