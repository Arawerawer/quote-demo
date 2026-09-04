<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'

const pageSize = defineModel<number>({ default: 10 })

const props = withDefaults(
  defineProps<{
    currentPage: number
    totalPages: number
    totalItems: number
    pageSizeOptions?: number[]
  }>(),
  {
    pageSizeOptions: () => [10, 20, 50, 100],
  },
)

const availablePageSizes = computed(() =>
  props.pageSizeOptions.filter((size) => Number.isFinite(size) && size > 0),
)
</script>

<template>
  <div
    class="text-brand-700 border-nurse-200 flex min-h-10 w-fit max-w-full items-center justify-between rounded-lg border bg-white text-sm font-bold max-sm:w-full"
  >
    <!-- 太多字...隱藏  -->
    <span class="min-w-0 flex-1 truncate px-3.5 max-sm:px-3 max-sm:text-xs">
      目前第 {{ currentPage }} 頁 / 共 {{ totalPages }} 頁 / 共
      {{ totalItems }} 筆資料
    </span>

    <label
      class="border-nurse-100 hover:bg-brand-50 relative inline-flex shrink-0 items-center overflow-hidden rounded-tr-lg rounded-br-lg border-l"
    >
      <span class="sr-only">每頁顯示筆數</span>
      <select
        v-model.number="pageSize"
        class="font-inherit text-brand-700 min-h-10 max-w-full cursor-pointer appearance-none border-0 bg-transparent py-0 pr-9 pl-3.5 focus:outline-0 max-sm:pr-8 max-sm:pl-3 max-sm:text-xs"
        aria-label="每頁顯示筆數"
      >
        <option v-for="size in availablePageSizes" :key="size" :value="size">
          顯示 {{ size }} 筆
        </option>
      </select>
      <ChevronDown
        class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
        :size="17"
        :stroke-width="2.5"
        aria-hidden="true"
      />
    </label>
  </div>
</template>
