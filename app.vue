<script setup lang="ts">
const route = useRoute()
const mainContent = useTemplateRef<HTMLElement>('mainContent')

watch(
  () => route.path,
  async () => {
    await nextTick()
    mainContent.value?.scrollTo({ top: 0, left: 0 })
  },
)
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPage v-if="route.meta.hideAppNavigation" />

  <div v-else class="flex h-dvh flex-col overflow-hidden">
    <UIPageTopNav />

    <main
      ref="mainContent"
      class="bg-desert-50 min-h-0 min-w-0 flex-1 overflow-y-scroll"
    >
      <NuxtPage />
    </main>
  </div>
</template>
