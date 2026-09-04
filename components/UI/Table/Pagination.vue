<script setup lang="ts">
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from '@lucide/vue'

const model = defineModel<number>({ default: 1 })
const props = withDefaults(
  defineProps<{
    totalPages: number
    maxVisiblePages?: number
    showPageJump?: boolean
    pageJumpSize?: number
  }>(),
  {
    maxVisiblePages: 6,
    showPageJump: false,
    pageJumpSize: 5,
  },
)

const pageCount = computed(() => Math.max(1, Math.floor(props.totalPages)))
const jumpSize = computed(() => Math.max(1, Math.floor(props.pageJumpSize)))
const visiblePageCount = computed(() =>
  Math.max(1, Math.min(Math.floor(props.maxVisiblePages), pageCount.value)),
)
const currentPage = computed(() =>
  Math.max(1, Math.min(Math.floor(model.value), pageCount.value)),
)
const firstVisiblePage = computed(() => {
  const offset = Math.floor((visiblePageCount.value - 1) / 2)
  const preferredStart = currentPage.value - offset
  const lastStart = pageCount.value - visiblePageCount.value + 1

  return Math.max(1, Math.min(preferredStart, lastStart))
})
const pages = computed(() =>
  Array.from(
    { length: visiblePageCount.value },
    (_, index) => firstVisiblePage.value + index,
  ),
)

const selectPage = (page: number) => {
  model.value = Math.max(1, Math.min(page, pageCount.value))
}
</script>

<template>
  <nav
    class="border-nurse-200 flex w-fit max-w-full overflow-hidden rounded-lg border bg-white"
    aria-label="表格換頁"
  >
    <button
      v-if="showPageJump"
      class="border-nurse-200 text-brand-700 hover:bg-brand-50 hover:text-brand-900 focus-visible:outline-brand-300 inline-grid size-10 shrink-0 place-items-center border-0 border-r bg-white text-sm font-bold transition-colors last:border-r-0 focus-visible:relative focus-visible:z-1 focus-visible:outline-3 focus-visible:-outline-offset-3 disabled:cursor-not-allowed disabled:opacity-[0.45]"
      type="button"
      :disabled="currentPage === 1"
      :aria-label="`往前 ${jumpSize} 頁`"
      @click="selectPage(currentPage - jumpSize)"
    >
      <ChevronsLeft :size="18" aria-hidden="true" />
    </button>

    <button
      class="border-nurse-200 text-brand-700 hover:bg-brand-50 hover:text-brand-900 focus-visible:outline-brand-300 inline-grid size-10 shrink-0 place-items-center border-0 border-r bg-white text-sm font-bold transition-colors last:border-r-0 focus-visible:relative focus-visible:z-1 focus-visible:outline-3 focus-visible:-outline-offset-3 disabled:cursor-not-allowed disabled:opacity-[0.45]"
      type="button"
      :disabled="currentPage === 1"
      aria-label="上一頁"
      @click="selectPage(currentPage - 1)"
    >
      <ChevronLeft :size="18" aria-hidden="true" />
    </button>

    <button
      v-for="page in pages"
      :key="page"
      class="border-nurse-200 text-brand-700 hover:bg-brand-50 hover:text-brand-900 focus-visible:outline-brand-300 inline-grid size-10 shrink-0 place-items-center border-0 border-r bg-white text-sm font-bold transition-colors last:border-r-0 focus-visible:relative focus-visible:z-1 focus-visible:outline-3 focus-visible:-outline-offset-3 disabled:cursor-not-allowed disabled:opacity-[0.45]"
      :class="page === currentPage ? 'bg-brand-500! text-white!' : ''"
      type="button"
      :aria-label="`第 ${page} 頁`"
      :aria-current="page === currentPage ? 'page' : undefined"
      @click="selectPage(page)"
    >
      {{ page }}
    </button>

    <button
      class="border-nurse-200 text-brand-700 hover:bg-brand-50 hover:text-brand-900 focus-visible:outline-brand-300 inline-grid size-10 shrink-0 place-items-center border-0 border-r bg-white text-sm font-bold transition-colors last:border-r-0 focus-visible:relative focus-visible:z-1 focus-visible:outline-3 focus-visible:-outline-offset-3 disabled:cursor-not-allowed disabled:opacity-[0.45]"
      type="button"
      :disabled="currentPage === pageCount"
      aria-label="下一頁"
      @click="selectPage(currentPage + 1)"
    >
      <ChevronRight :size="18" aria-hidden="true" />
    </button>

    <button
      v-if="showPageJump"
      class="border-nurse-200 text-brand-700 hover:bg-brand-50 hover:text-brand-900 focus-visible:outline-brand-300 inline-grid size-10 shrink-0 place-items-center border-0 border-r bg-white text-sm font-bold transition-colors last:border-r-0 focus-visible:relative focus-visible:z-1 focus-visible:outline-3 focus-visible:-outline-offset-3 disabled:cursor-not-allowed disabled:opacity-[0.45]"
      type="button"
      :disabled="currentPage === pageCount"
      :aria-label="`往後 ${jumpSize} 頁`"
      @click="selectPage(currentPage + jumpSize)"
    >
      <ChevronsRight :size="18" aria-hidden="true" />
    </button>
  </nav>
</template>
