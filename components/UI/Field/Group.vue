<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    col?: number | string
  }>(),
  {
    col: 12,
  },
)

const gridColumns = computed(() => {
  const columnCount = Number(props.col)
  return Number.isFinite(columnCount)
    ? Math.min(Math.max(columnCount, 1), 12)
    : 12
})
</script>

<template>
  <div
    class="ui-field-group border-nurse-200 bg-nurse-200 grid gap-px overflow-hidden rounded-lg border"
    :style="{
      gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
    }"
  >
    <slot />
  </div>
</template>
