<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <section class="border-nurse-200 overflow-hidden rounded-2xl border bg-white">
    <header class="border-nurse-200 border-b p-5">
      <h2 class="text-brand-900 m-0 text-xl leading-[1.45] font-bold">
        {{ title }}
      </h2>
      <p class="text-brand-600 mt-1 mb-0 text-sm leading-[1.6]">
        {{ description }}
      </p>
    </header>

    <div class="bg-desert-50 px-6 py-7 max-md:px-4 max-md:py-5">
      <slot />
    </div>
  </section>
</template>
