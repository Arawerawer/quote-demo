<script setup lang="ts">
import type { SteelIconName } from '~/components/UI/Steel/Icon.vue'

/**
 * 詢價單頁的品項推薦區。
 *
 * 品項清單直接讀 useAppNavigation 的 mainNavigation，不另外維護一份，
 * 新增品項頁只要加進 navigation 就會自動出現在這裡。
 */
const props = withDefaults(
  defineProps<{
    /** 要排除的品項標題（已在詢價單裡的），例：['鋼板彎折'] */
    exclude?: string[]
  }>(),
  {
    exclude: () => [],
  },
)

const { mainNavigation } = useAppNavigation()

// UISteelIcon 的圖示名與路由 slug 對不起來（bending vs steel-plate-bending），
// 所以要一張對應表。新增品項頁時記得補一筆，漏掉就不會顯示圖示。
const ICON_BY_SLUG: Record<string, SteelIconName> = {
  'steel-plate-bending': 'bending',
  'c-channel': 'c-channel',
  'angle-steel': 'angle',
  'flat-bar': 'flat-bar',
  'h-beam': 'h-beam',
  'corrugated-sheet': 'corrugated',
  'connector-plate': 'connector',
}

const productItems = computed(() =>
  mainNavigation
    .filter((item) => item.to.startsWith('/products/'))
    .map((item) => ({
      title: item.title,
      to: item.to,
      comingSoon: Boolean(item.comingSoon),
      icon: ICON_BY_SLUG[item.to.replace('/products/', '')],
    }))
    .filter((item) => Boolean(item.icon)),
)

/**
 * 詢價單裡已經有的品項不再推薦——客戶剛加完鋼板彎折，
 * 不需要再看到「鋼板彎折」的推薦卡。
 *
 * 比對用 title，因為 QuoteCartItem.category 存的就是這個字串。
 * 新增品項頁時 addItem 的 category 必須與 navigation 的 title 完全一致，
 * 否則這裡排除不掉。
 */
const relatedItems = computed(() =>
  productItems.value.filter((item) => !props.exclude.includes(item.title)),
)
</script>

<template>
  <div
    v-if="relatedItems.length"
    class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
  >
    <template v-for="item in relatedItems" :key="item.to">
      <!-- 還沒做完的品項不給點，免得點進去看到空白頁 -->
      <div
        v-if="item.comingSoon"
        class="border-nurse-200 relative flex cursor-not-allowed items-center gap-3 rounded-lg border bg-white p-4"
      >
        <UISteelIcon
          :name="item.icon"
          :size="40"
          class="text-nurse-400 shrink-0"
        />
        <span class="text-nurse-500 min-w-0 flex-1 truncate font-bold">
          {{ item.title }}
        </span>
        <span
          class="bg-nurse-100 text-nurse-500 shrink-0 rounded-full px-2 py-0.5 text-xs"
        >
          即將開放
        </span>
      </div>

      <NuxtLink
        v-else
        :to="item.to"
        class="border-nurse-200 text-brand-800 hover:border-brand-300 hover:bg-brand-50 flex items-center gap-3 rounded-lg border bg-white p-4 transition-colors duration-200"
      >
        <UISteelIcon
          :name="item.icon"
          :size="40"
          class="text-brand-600 shrink-0"
        />
        <span class="min-w-0 flex-1 truncate font-bold">{{ item.title }}</span>
        <UIIcon
          name="ChevronRight"
          :size="18"
          class="text-nurse-400 shrink-0"
        />
      </NuxtLink>
    </template>
  </div>
</template>
