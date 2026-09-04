<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <header class="flex max-w-full flex-col gap-3">
    <UIPageBreadcrumb :title="title" />

    <div class="w-full min-w-0">
      <div class="flex w-full items-center gap-3">
        <h1
          class="text-nurse-900 min-w-0 flex-1 text-4xl leading-tight font-black max-md:text-3xl"
        >
          {{ title }}
        </h1>

        <div
          v-if="$slots.actions || $slots.default"
          class="flex min-w-0 shrink-0 justify-end gap-2 max-md:w-1/2 md:w-max"
        >
          <slot />
        </div>
      </div>

      <p class="text-nurse-600 m-0 text-base leading-7" v-if="description">
        {{ description }}
      </p>
    </div>
  </header>
</template>
