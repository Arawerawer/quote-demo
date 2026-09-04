<script setup lang="ts">
import { ArrowLeft, ChevronRight } from '@lucide/vue'

const props = defineProps<{
  title: string
}>()

const route = useRoute()
const router = useRouter()
const { mainNavigation } = useAppNavigation()

const breadcrumbs = computed(() => {
  const homeItem = mainNavigation[0]

  if (route.path === homeItem.to) {
    return [homeItem]
  }

  const currentItem = mainNavigation.find(
    (item) =>
      item.to === route.path ||
      item.children?.some((child) => child.to === route.path),
  )

  if (!currentItem) {
    return [homeItem, { title: props.title, to: route.path }]
  }

  const currentChild = currentItem.children?.find(
    (child) => child.to === route.path,
  )

  return [homeItem, currentItem, ...(currentChild ? [currentChild] : [])]
})

const goBack = () => {
  if (import.meta.client && window.history.length > 1) {
    router.back()
    return
  }

  void navigateTo('/')
}
</script>

<template>
  <nav class="flex min-h-8 items-center gap-1.5" aria-label="麵包屑">
    <button
      class="text-brand-600 hover:bg-brand-100 hover:text-brand-900 mr-2 grid size-8 shrink-0 place-items-center rounded-md border-0 bg-transparent p-0"
      type="button"
      aria-label="返回上一頁"
      title="返回上一頁"
      @click="goBack"
    >
      <ArrowLeft :size="19" aria-hidden="true" />
    </button>

    <template
      v-for="(item, index) in breadcrumbs"
      :key="`${item.to}-${item.title}`"
    >
      <ChevronRight
        v-if="index > 0"
        class="text-nurse-500 shrink-0"
        :size="14"
        aria-hidden="true"
      />
      <span
        v-if="index === breadcrumbs.length - 1"
        class="text-brand-700 truncate text-sm font-bold"
        aria-current="page"
      >
        {{ item.title }}
      </span>
      <NuxtLink
        v-else
        class="text-brand-600 hover:text-brand-900 truncate text-sm font-medium no-underline"
        :to="item.to"
      >
        {{ item.title }}
      </NuxtLink>
    </template>
  </nav>
</template>
