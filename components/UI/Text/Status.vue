<script setup lang="ts">
const props = defineProps<{
  title: string
  message: string
}>()

const messageLines = computed(() => props.message.split(/\\n|\r?\n/))
</script>

<template>
  <div class="py-8 pb-4 text-center" role="status">
    <svg
      class="text-status__icon mx-auto block size-20 overflow-visible"
      viewBox="0 0 80 80"
      aria-hidden="true"
    >
      <circle
        class="text-status__circle"
        cx="40"
        cy="40"
        r="37"
        pathLength="1"
      />
      <path class="text-status__check" d="m24 41 10 10 22-23" pathLength="1" />
    </svg>
    <h1 class="text-brand-700 mt-4 mb-2.5 text-2xl font-bold">{{ title }}</h1>
    <p class="text-brand-700 m-0 mt-6 leading-[1.6]">
      <template v-for="(line, index) in messageLines" :key="`${line}-${index}`">
        {{ line }}<br v-if="index < messageLines.length - 1" />
      </template>
    </p>
  </div>
</template>

<style scoped lang="scss">
.text-status__circle,
.text-status__check {
  fill: transparent;
  stroke: var(--color-brand-500);
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}

.text-status__circle {
  transform: rotate(-90deg);
  transform-origin: center;
  animation: text-status-draw 500ms ease-out forwards;
}

.text-status__check {
  fill: none;
  animation: text-status-draw 300ms 540ms ease-out forwards;
}

@keyframes text-status-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .text-status__circle,
  .text-status__check {
    animation: none;
    stroke-dashoffset: 0;
  }
}
</style>
