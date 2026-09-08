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
    <!-- 頂欄不進 PDF（詢價單的「匯出 PDF」走瀏覽器列印） -->
    <UIPageTopNav class="screen-only" />

    <main
      ref="mainContent"
      class="bg-desert-50 min-h-0 min-w-0 flex-1 overflow-y-scroll"
    >
      <NuxtPage />
    </main>
  </div>
</template>
