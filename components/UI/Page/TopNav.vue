<script setup lang="ts">
import { Menu, PanelLeftClose, PanelLeftOpen } from '@lucide/vue'
import type { NavMenuConfig } from '~/components/UI/Button/NavMenu.vue'
import { UserRound } from '@lucide/vue'

const isCollapsed = useState('sidebar-collapsed', () => false)
const isMobileMenuOpen = useState('sidebar-mobile-menu', () => false)

const lastAction = ref('尚未操作')
const setAction = (message: string) => {
  lastAction.value = message
}
const demoDropdown: NavMenuConfig = {
  items: [
    { text: '編輯資料', onClick: () => setAction('點擊：編輯資料') },
    { text: '查看紀錄', onClick: () => setAction('點擊：查看紀錄') },
    {
      text: '登出',
      onClick: async () => {
        await navigateTo('/login')
      },
      isRed: true,
    },
  ],
}
</script>

<template>
  <header
    class="border-brand-800 bg-brand-600 sticky top-0 z-20 flex min-h-12 items-center justify-between border-b px-3 py-2 text-lg font-bold text-white max-sm:px-3"
  >
    <div class="flex min-w-0 items-center gap-2">
      <button
        class="flex size-9 h-11 w-11 shrink-0 items-center justify-center rounded-lg border-0 bg-transparent text-white hover:bg-white/16 max-lg:hidden"
        type="button"
        :aria-label="isCollapsed ? '展開側邊選單' : '收合側邊選單'"
        :title="isCollapsed ? '展開側邊選單' : '收合側邊選單'"
        @click="isCollapsed = !isCollapsed"
      >
        <PanelLeftOpen v-if="isCollapsed" :size="19" aria-hidden="true" />
        <PanelLeftClose v-else :size="19" aria-hidden="true" />
      </button>
      <button
        class="flex size-9 shrink-0 items-center justify-center rounded-lg border-0 bg-transparent text-white hover:bg-white/16 lg:hidden"
        type="button"
        aria-label="開啟側邊選單"
        title="開啟側邊選單"
        @click="isMobileMenuOpen = true"
      >
        <Menu :size="22" aria-hidden="true" />
      </button>
      <UIPageLogo />
    </div>
    <nav aria-label="主要導覽">
      <UIButtonNavMenu
        text="王小明"
        :icon="UserRound"
        has-dropdown
        :dropdown="demoDropdown"
      />
    </nav>
  </header>
</template>
