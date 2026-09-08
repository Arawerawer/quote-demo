<script setup lang="ts">
import type { SteelIconName } from '~/components/UI/Steel/Icon.vue'

// 取 sidebar 的項目，但排掉「首頁」本身——首頁不用出現在首頁的選項裡
const { sidebarItems } = useAppNavigation()

// 路由對圖示的表放在這裡而不是 useAppNavigation，因為只有首頁卡片用得到；
// sidebar 收合後圖示只有 18px，等角投影會糊掉，那邊維持原本的 lucide 線圖示
const steelIcons: Record<string, SteelIconName> = {
  '/products/steel-plate-bending': 'bending',
  '/products/c-channel': 'c-channel',
  '/products/angle-steel': 'angle',
  '/products/flat-bar': 'flat-bar',
  '/products/h-beam': 'h-beam',
  '/products/corrugated-sheet': 'corrugated',
  '/products/connector-plate': 'connector',
}

const productItems = computed(() =>
  sidebarItems
    .filter((item) => item.to !== '/')
    .map((item) => ({ ...item, steelIcon: steelIcons[item.to] })),
)
</script>

<template>
  <div class="mx-auto w-[min(100%,1180px)] p-6 max-md:p-4">
    <UIPageHeader
      title="線上詢價"
      description="請選擇要詢價的品項。"
      :show-breadcrumb="false"
      class="mb-4"
    />

    <UIPageContent>
      <!-- 直接寫三欄，不走 UIGridItem 的 12 欄換算 -->
      <div class="grid grid-cols-3 gap-3 max-sm:grid-cols-2">
        <NuxtLink
          v-for="item in productItems"
          :key="item.to"
          :to="item.to"
          class="group text-brand-900 border-nurse-200 hover:border-brand-500 hover:bg-brand-50 hover:ring-brand-300 flex h-20 items-center justify-center gap-2 rounded-lg border bg-white p-3 text-center no-underline transition-all duration-200 hover:ring-2"
        >
          <UISteelIcon
            v-if="item.steelIcon"
            :name="item.steelIcon"
            :size="32"
            class="text-brand-500 shrink-0"
          />
          <strong class="text-base">{{ item.title }}</strong>
        </NuxtLink>
      </div>
    </UIPageContent>
  </div>
</template>
