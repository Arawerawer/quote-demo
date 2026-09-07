<script setup lang="ts">
// 取 sidebar 的項目，但排掉「首頁」本身——首頁不用出現在首頁的選項裡
const { sidebarItems } = useAppNavigation()
const productItems = computed(() =>
  sidebarItems.filter((item) => item.to !== '/'),
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
          class="group text-brand-900 border-nurse-200 hover:border-brand-500 hover:bg-brand-50 hover:ring-brand-300 flex h-24 items-center justify-center rounded-lg border bg-white p-3 text-center no-underline transition-all duration-200 hover:ring-2"
        >
          <strong class="text-base">{{ item.title }}</strong>
        </NuxtLink>
      </div>
    </UIPageContent>
  </div>
</template>
