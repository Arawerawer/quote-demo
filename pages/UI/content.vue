<script setup lang="ts">
import { CalendarDays, Clock3, UserRound } from '@lucide/vue'
</script>

<template>
  <ShowcasePage
    title="內容呈現"
    description="標題、鍵值資料與成功狀態等通用內容元件。"
  >
    <ShowcaseSection
      title="內容卡片"
      component-name="UIBoxCard"
      description="包含標題、說明與內容插槽的區塊卡片。"
      usage='<UIBoxCard title="選擇服務" description="請選擇一項服務方案">內容</UIBoxCard>'
    >
      <UIBoxCard title="選擇服務" description="請選擇一項最適合您的服務方案。">
        <p class="text-brand-700 m-0 text-sm">
          子元件或其他內容可以直接放在這裡。
        </p>
      </UIBoxCard>
    </ShowcaseSection>

    <ShowcaseSection
      title="資料文字列"
      component-name="UITextItem"
      description="適合放在 dl 中，可切換水平／垂直排列並加粗內容。"
      usage='<UITextItem title="設計師" content="林設計師" content-strong />'
    >
      <dl class="m-0 grid max-w-130 gap-4">
        <UITextItem title="設計師" content="林設計師" content-strong />
        <UITextItem title="服務方案" content="剪髮造型" />
        <UITextItem title="備註" content="抵達前請先來電" layout="vertical" />
      </dl>
    </ShowcaseSection>

    <ShowcaseSection
      title="狀態文字標籤"
      component-name="UITextStatusTag"
      description="統一顯示狀態文字，可依 status 自動套用顏色，也能用 color 覆寫為 primary、secondary、warning 或 danger。"
      usage='<UITextStatusTag status="inactive" color="warning" />'
    >
      <div class="flex flex-wrap items-center gap-3">
        <UITextStatusTag status="active" />
        <UITextStatusTag status="complete" />
        <UITextStatusTag status="inactive" />
        <UITextStatusTag status="active" size="md" />
        <UITextStatusTag status="active" color="warning" />
        <UITextStatusTag status="active" color="danger" />
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="圖示文字項目"
      component-name="UITextIconItem"
      description="將圖示與文字統一排列，適合日期、時段、人員等摘要資訊。"
      usage='<UITextIconItem :icon="CalendarDays" text="2026 年 8 月 12 日" />'
    >
      <div class="text-brand-600 flex flex-wrap gap-x-6 gap-y-3 text-sm">
        <UITextIconItem :icon="CalendarDays" text="2026 年 8 月 12 日" />
        <UITextIconItem :icon="Clock3" text="11:30・60 分鐘" />
        <UITextIconItem :icon="UserRound" text="王設計師" />
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="Lucide 圖示"
      component-name="UIIcon"
      description="只要傳入 Lucide 的圖示名稱即可使用，頁面不需要自行引入圖示元件。"
      usage='<UIIcon name="Search" />
<UIIcon name="CalendarDays" :size="20" />
<UIFormButton icon="Download" text="下載" />'
    >
      <div class="text-brand-600 flex flex-wrap items-center gap-5">
        <div class="flex items-center gap-2 text-sm">
          <UIIcon name="Search" :size="20" />
          Search
        </div>
        <div class="flex items-center gap-2 text-sm">
          <UIIcon name="CalendarDays" :size="20" />
          CalendarDays
        </div>
        <div class="flex items-center gap-2 text-sm">
          <UIIcon name="Download" :size="20" />
          Download
        </div>
      </div>
      <a
        class="text-brand-600 hover:text-brand-800 mt-5 inline-flex text-sm font-bold underline underline-offset-4"
        href="https://lucide.dev/icons/"
        target="_blank"
        rel="noreferrer"
      >
        查詢 Lucide 圖示名稱
      </a>
    </ShowcaseSection>

    <ShowcaseSection
      title="成功狀態文字"
      component-name="UITextStatus"
      description="帶有動態勾選圖示，message 可用換行字元拆分成多行。"
      usage='<UITextStatus title="操作完成" message="資料已更新。\n變更已成功套用。" />'
    >
      <UITextStatus
        title="操作完成"
        :message="'資料已更新。\n變更已成功套用。'"
      />
    </ShowcaseSection>
  </ShowcasePage>
</template>
