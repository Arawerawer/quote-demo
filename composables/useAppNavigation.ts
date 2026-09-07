import {
  AppWindow,
  CalendarDays,
  ClipboardList,
  Columns3,
  FilePlus2,
  FoldHorizontal,
  Home,
  Images,
  LayoutGrid,
  LibraryBig,
  Link2,
  ListChecks,
  MessageCircleMore,
  Minus,
  MousePointerClick,
  Palette,
  PanelsTopLeft,
  Rows3,
  Ruler,
  Spline,
  Table2,
  TextCursorInput,
  Waves,
  ChartPie,
} from '@lucide/vue'
import type { Component } from 'vue'

export interface AppNavigationItem {
  title: string
  to: string
  icon: Component
  children?: readonly AppNavigationItem[]
  /** true = 不顯示在 sidebar，但路由與麵包屑照常可用 */
  hidden?: boolean
  /**
   * true = 頁面內容還沒做完（目前是「待補」空頁）。
   * 只影響 ProductRelatedList 的推薦卡片（標「即將開放」且不可點），
   * sidebar 與路由完全不受影響。哪一頁做完就把這行刪掉。
   */
  comingSoon?: boolean
}

const mainNavigation: readonly AppNavigationItem[] = [
  {
    title: '首頁',
    to: '/',
    icon: Home,
  },
  {
    title: 'UI 介面',
    to: '/UI',
    icon: LibraryBig,
    hidden: true,
    children: [
      {
        title: '元件總覽',
        to: '/UI',
        icon: LayoutGrid,
      },
      { title: '顏色', to: '/UI/colors', icon: Palette },
      { title: '按鈕', to: '/UI/buttons', icon: MousePointerClick },
      { title: '表格', to: '/UI/tables', icon: Table2 },
      { title: '表單', to: '/UI/forms', icon: TextCursorInput },
      { title: '清單', to: '/UI/list', icon: ListChecks },
      { title: '選擇器', to: '/UI/selections', icon: CalendarDays },
      { title: '視窗', to: '/UI/modals', icon: AppWindow },
      { title: '回饋', to: '/UI/feedback', icon: MessageCircleMore },
      { title: '版面', to: '/UI/layout', icon: PanelsTopLeft },
      { title: '內容', to: '/UI/content', icon: Rows3 },
      { title: '圖片', to: '/UI/images', icon: Images },
      { title: '鋼材圖示', to: '/UI/steel-icons', icon: FoldHorizontal },
    ],
  },
  {
    title: '空白範例頁',
    to: '/example',
    icon: FilePlus2,
    hidden: true,
  },

  {
    title: '清單表格範例頁',
    to: '/example/list-table',
    icon: FilePlus2,
    hidden: true,
  },

  {
    title: '表單欄位範例頁',
    to: '/example/form',
    icon: FilePlus2,
    hidden: true,
  },

  {
    title: '圖表範例頁',
    to: '/example/chart',
    icon: ChartPie,
    hidden: true,
  },

  {
    title: '角鐵詢價工具',
    to: '/quote-builder',
    icon: Ruler,
    hidden: true,
  },

  {
    title: '鋼板彎折',
    to: '/products/steel-plate-bending',
    icon: FoldHorizontal,
  },

  {
    title: 'C 型鋼',
    to: '/products/c-channel',
    icon: Spline,
    comingSoon: true,
  },

  {
    title: '角鐵',
    to: '/products/angle-steel',
    icon: Ruler,
    comingSoon: true,
  },

  {
    title: '扁鐵',
    to: '/products/flat-bar',
    icon: Minus,
    comingSoon: true,
  },

  {
    title: 'H 型鋼',
    to: '/products/h-beam',
    icon: Columns3,
    comingSoon: true,
  },

  {
    title: '水槽鋼瓦',
    to: '/products/corrugated-sheet',
    icon: Waves,
    comingSoon: true,
  },

  {
    title: '連接板',
    to: '/products/connector-plate',
    icon: Link2,
    comingSoon: true,
  },

  // 入口是右上角的「詢價單」按鈕，不佔 sidebar 位置
  {
    title: '詢價單',
    to: '/quote-cart',
    icon: ClipboardList,
    hidden: true,
  },
]

export const useAppNavigation = () => {
  const homeItem = mainNavigation[0]
  const uiWorkspace = mainNavigation[1]
  const pageItems = mainNavigation.filter(
    (item) => item.to !== '/' && !item.children?.length,
  )
  const workspaceItems = mainNavigation.filter((item) => item.children?.length)
  // sidebar 只顯示沒標 hidden 的項目；hidden 項目的路由與麵包屑不受影響
  const sidebarItems = mainNavigation.filter((item) => !item.hidden)

  return {
    homeItem,
    mainNavigation,
    pageItems,
    sidebarItems,
    uiWorkspace,
    workspaceItems,
  }
}
