<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'text' | 'card' | 'circle'
    width?: string
    height?: string
  }>(),
  {
    variant: 'text',
    width: '100%',
    height: '',
  },
)

const variantClasses = {
  text: 'h-4 rounded-lg',
  card: 'h-[174px] rounded-2xl',
  circle: 'size-10 rounded-full',
} as const
</script>

<template>
  <span
    class="skeleton block"
    :class="variantClasses[props.variant]"
    :style="{ width, height: height || undefined }"
    aria-hidden="true"
  />
</template>

<style scoped lang="scss">
@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-nurse-100) 25%,
    var(--color-nurse-50) 50%,
    var(--color-nurse-100) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.4s ease-in-out infinite;
}
</style>
