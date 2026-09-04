<script setup lang="ts">
import type { Component } from 'vue'
import {
  AppWindow,
  CalendarDays,
  Images,
  LayoutGrid,
  MessageCircleMore,
  MousePointerClick,
  Palette,
  PanelsTopLeft,
  Rows3,
  Table2,
  TextCursorInput,
} from '@lucide/vue'

const categories: readonly {
  title: string
  description: string
  to: string
  icon: Component
}[] = [
  {
    title: '按鈕',
    description: '操作、選項與下拉選單。',
    to: '/UI/buttons',
    icon: MousePointerClick,
  },
  {
    title: '顏色',
    description: '品牌、語意與中性色彩 token。',
    to: '/UI/colors',
    icon: Palette,
  },
  {
    title: '表單',
    description: '輸入、選項與數值控制。',
    to: '/UI/forms',
    icon: TextCursorInput,
  },
  {
    title: '表格',
    description: '原生表格的統一樣式包裝器。',
    to: '/UI/tables',
    icon: Table2,
  },
  {
    title: '選擇器',
    description: '可重複使用的卡片選項。',
    to: '/UI/selections',
    icon: CalendarDays,
  },
  {
    title: '視窗',
    description: '尺寸、操作區、鎖定與長內容。',
    to: '/UI/modals',
    icon: AppWindow,
  },
  {
    title: '回饋狀態',
    description: 'Alert、空狀態、載入與骨架。',
    to: '/UI/feedback',
    icon: MessageCircleMore,
  },
  {
    title: '內容',
    description: '標題、資料列與狀態。',
    to: '/UI/content',
    icon: Rows3,
  },
  {
    title: '版面',
    description: '導覽、流程與頁尾容器。',
    to: '/UI/layout',
    icon: PanelsTopLeft,
  },

  {
    title: '圖片',
    description: '圖片上傳、預覽與空狀態顯示。',
    to: '/UI/images',
    icon: Images,
  },
  {
    title: '網格',
    description: '響應式欄位配置與網格項目。',
    to: '/UI/grid',
    icon: LayoutGrid,
  },
]
</script>

<template>
  <ShowcasePage
    title="UI 元件總覽"
    description="專案現有元件的互動目錄。依功能分類查看實際狀態、props 與基本使用方式。"
  >
    <div class="grid grid-cols-2 gap-4 max-md:grid-cols-1">
      <UIButtonIconBlock
        v-for="category in categories"
        :key="category.to"
        :to="category.to"
        :title="category.title"
        :subtitle="category.subtitle"
        :description="category.description"
        :icon="category.icon"
      />
    </div>
  </ShowcasePage>
</template>
