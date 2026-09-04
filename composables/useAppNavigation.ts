import {
  AppWindow,
  CalendarDays,
  FilePlus2,
  Home,
  Images,
  LayoutGrid,
  LibraryBig,
  ListChecks,
  MessageCircleMore,
  MousePointerClick,
  Palette,
  PanelsTopLeft,
  Rows3,
  Ruler,
  Table2,
  TextCursorInput,
  ChartPie,
} from '@lucide/vue'
import type { Component } from 'vue'

export interface AppNavigationItem {
  title: string
  to: string
  icon: Component
  children?: readonly AppNavigationItem[]
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
    ],
  },
  {
    title: '空白範例頁',
    to: '/example',
    icon: FilePlus2,
  },

  {
    title: '清單表格範例頁',
    to: '/example/list-table',
    icon: FilePlus2,
  },

  {
    title: '表單欄位範例頁',
    to: '/example/form',
    icon: FilePlus2,
  },

  {
    title: '圖表範例頁',
    to: '/example/chart',
    icon: ChartPie,
  },

  {
    title: '角鐵詢價工具',
    to: '/quote-builder',
    icon: Ruler,
  },
]

export const useAppNavigation = () => {
  const homeItem = mainNavigation[0]
  const uiWorkspace = mainNavigation[1]
  const pageItems = mainNavigation.filter(
    (item) => item.to !== '/' && !item.children?.length,
  )
  const workspaceItems = mainNavigation.filter((item) => item.children?.length)

  return {
    homeItem,
    mainNavigation,
    pageItems,
    uiWorkspace,
    workspaceItems,
  }
}
