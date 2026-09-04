<script setup lang="ts">
withDefaults(
  defineProps<{
    hideVerticalBorders?: boolean
  }>(),
  {
    hideVerticalBorders: false,
  },
)
</script>

<template>
  <div
    class="ui-table"
    :class="{ 'ui-table--hide-vertical-borders': hideVerticalBorders }"
  >
    <slot />
  </div>
</template>

<style scoped>
.ui-table {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--color-nurse-200);
  border-radius: 8px;
  background: white;
}

.ui-table :deep(table) {
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
  color: var(--color-brand-900);
  font-size: 0.875rem;
  line-height: 1.6;
}

.ui-table :deep(caption) {
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-nurse-200);
  color: var(--color-brand-700);
  font-weight: 700;
  text-align: left;
}

.ui-table :deep(th),
.ui-table :deep(td) {
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-nurse-200);
  text-align: left;
  vertical-align: middle;
}

.ui-table :deep(th + th),
.ui-table :deep(td + td) {
  border-left: 1px solid var(--color-nurse-200);
}

.ui-table :deep(th + th) {
  border-left-color: var(--color-brand-600);
}

.ui-table--hide-vertical-borders :deep(th + th),
.ui-table--hide-vertical-borders :deep(td + td) {
  border-left: 0;
}

.ui-table :deep(th) {
  background: var(--color-brand-500);
  color: var(--color-white);
  font-weight: 700;
  white-space: nowrap;
}

.ui-table :deep(tbody tr) {
  transition: background-color 150ms ease;
  &:nth-child(2n-1) {
    background: var(--color-desert-50);
  }
}

.ui-table :deep(tbody tr:hover) {
  background: var(--color-brand-50);
}

.ui-table :deep(tbody tr:last-child td),
.ui-table :deep(tfoot tr:last-child td) {
  border-bottom: 0;
}

.ui-table :deep(tfoot td) {
  background: var(--color-desert-100);
  color: var(--color-brand-700);
  font-weight: 700;
  border-top: 1px solid var(--color-nurse-200);
}

.ui-table :deep([data-align='center']) {
  text-align: center;
}

.ui-table :deep([data-align='right']) {
  text-align: right;
}
</style>
