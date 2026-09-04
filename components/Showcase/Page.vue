<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="mx-auto w-[min(100%,1180px)] p-6 max-md:p-4">
    <UIPageHeader :title="title" :description="description" class="mb-4" />
    <div class="grid gap-6">
      <slot />
    </div>
  </div>
</template>
