<template>
  <div
    class="ui-list-group border-nurse-200 bg-nurse-200 overflow-hidden rounded-lg border"
  >
    <slot />
  </div>
</template>

<style scoped>
.ui-list-group :deep(.ui-list-item--default:nth-child(even)) {
  background: var(--color-nurse-50);
}
</style>
