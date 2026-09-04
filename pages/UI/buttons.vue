<script setup lang="ts">
import { Images, UserRound } from '@lucide/vue'
import type { NavMenuConfig } from '~/components/UI/Button/NavMenu.vue'

const selectedChoice = ref('下午')
const lastAction = ref('尚未操作')

const setAction = (message: string) => {
  lastAction.value = message
}

const demoDropdown: NavMenuConfig = {
  items: [
    { text: '編輯資料', onClick: () => setAction('點擊：編輯資料') },
    { text: '查看紀錄', onClick: () => setAction('點擊：查看紀錄') },
    {
      text: '刪除帳號',
      onClick: () => setAction('點擊：刪除帳號'),
      isRed: true,
    },
  ],
}
</script>

<template>
  <ShowcasePage
    title="按鈕"
    description="主要操作、單選狀態與可選下拉行為。所有範例都可直接互動。"
  >
    <ShowcaseSection
      title="按鈕"
      component-name="UIFormButton"
      description="主要使用於輸入框旁邊，以 variant 選擇語意色彩，以 appearance 切換實心或外框樣式；secondary 使用綠色，cancel 使用灰色。"
      usage='<UIFormButton variant="primary">主要操作</UIFormButton>
    <UIFormButton icon="Search" text="搜尋" />
    <UIFormButton variant="cancel">取消</UIFormButton>
    <UIFormButton variant="danger" appearance="outline">刪除資料</UIFormButton>'
    >
      <div class="grid gap-6">
        <UIFormGroup label="實心按鈕">
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <UIFormButton variant="primary">Primary</UIFormButton>
            <UIFormButton variant="secondary">Secondary</UIFormButton>
            <UIFormButton variant="cancel">Cancel</UIFormButton>
            <UIFormButton variant="warning">Warning</UIFormButton>
            <UIFormButton variant="danger">Danger</UIFormButton>
          </div>
        </UIFormGroup>

        <UIFormGroup label="外框按鈕">
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <UIFormButton variant="primary" appearance="outline"
              >Primary</UIFormButton
            >
            <UIFormButton variant="secondary" appearance="outline"
              >Secondary</UIFormButton
            >
            <UIFormButton variant="cancel" appearance="outline"
              >Cancel</UIFormButton
            >
            <UIFormButton variant="warning" appearance="outline"
              >Warning</UIFormButton
            >
            <UIFormButton variant="danger" appearance="outline"
              >Danger</UIFormButton
            >
          </div>
        </UIFormGroup>

        <UIFormGroup label="Disabled">
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <UIFormButton variant="primary" disabled>Primary</UIFormButton>
            <UIFormButton variant="secondary" disabled>Secondary</UIFormButton>
            <UIFormButton variant="warning" disabled>Warning</UIFormButton>
            <UIFormButton variant="danger" disabled>Danger</UIFormButton>
          </div>
        </UIFormGroup>

        <UIFormGroup label="範例：搜尋">
          <div class="inline-field">
            <UIFormInput placeholder="輸入查詢代碼" />
            <UIFormButton icon="Search" text="查詢" />
          </div>
        </UIFormGroup>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="按鈕圖示"
      component-name="UIFormButton icon"
      description="使用 Lucide 圖示名稱顯示按鈕圖示，可切換圖示位置，也能使用沒有文字的正方形圖示按鈕。"
      usage='<UIFormButton icon="Search" text="查詢" />
<UIFormButton icon="ArrowRight" icon-position="right" text="下一步" />
<UIFormButton icon="Trash-2" icon-only aria-label="刪除" variant="danger" />'
    >
      <div class="flex flex-wrap items-center gap-3">
        <UIFormButton icon="Search" text="查詢" />
        <UIFormButton
          icon="ArrowRight"
          icon-position="right"
          text="下一步"
          variant="secondary"
        />
        <UIFormButton
          icon="Trash-2"
          icon-only
          aria-label="刪除"
          variant="danger"
          appearance="outline"
        />
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="按鈕尺寸"
      component-name="UIFormButton"
      description="支援 sm、md、lg 三種尺寸，預設為 md。"
      usage='<UIFormButton text="小型" size="sm" />
<UIFormButton text="中型" size="md" />
<UIFormButton text="大型" size="lg" />'
    >
      <div class="flex flex-wrap items-center justify-center gap-3">
        <UIFormButton text="小型" size="sm" />
        <UIFormButton text="中型" size="md" />
        <UIFormButton text="大型" size="lg" />
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="按鈕群組溢出"
      component-name="UIFormButtonGroup"
      description="以 sm、md、lg、xl 指定各螢幕尺寸可見的按鈕數量；其餘按鈕會收進垂直三點選單，並保留按鈕圖示。"
      usage='<UIFormButtonGroup :sm="1" :md="2" :lg="4" :xl="6" :gap="12">
  <UIFormButton text="編輯" icon="Pencil" />
  <UIFormButton text="複製" icon="Copy" variant="secondary" />
  <UIFormButton text="刪除" icon="Trash-2" variant="danger" />
</UIFormButtonGroup>'
    >
      <div class="max-w-[800px]">
        <UIFormButtonGroup :sm="1" :md="2" :lg="4" :xl="6" :gap="12">
          <UIFormButton text="編輯" icon="Pencil" />
          <UIFormButton text="複製" icon="Copy" variant="secondary" />
          <UIFormButton text="匯出" icon="Download" variant="outline" />
          <UIFormButton text="刪除" icon="Trash-2" variant="danger" />
          <UIFormButton text="編輯" icon="Pencil" />
          <UIFormButton text="複製" icon="Copy" variant="secondary" />
          <UIFormButton text="匯出" icon="Download" variant="outline" />
          <UIFormButton text="刪除" icon="Trash-2" variant="danger" />
        </UIFormButtonGroup>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="頁面操作按鈕"
      component-name="UIButtonPageBottom"
      description="用於頁面底部的主要與次要操作，內容由預設 slot 提供。"
      usage='<UIButtonPageBottom variant="primary">確認變更</UIButtonPageBottom>'
    >
      <div class="flex flex-wrap items-center justify-center gap-3 py-20">
        <UIButtonPageBottom
          variant="primary"
          @click="setAction('點擊：確認變更')"
          >確認變更</UIButtonPageBottom
        >
        <UIButtonPageBottom
          variant="secondary"
          @click="setAction('點擊：返回上一步')"
          >返回上一步</UIButtonPageBottom
        >
      </div>
      <p class="text-brand-600 mt-3.5 mb-0 text-[13px]">{{ lastAction }}</p>
    </ShowcaseSection>

    <ShowcaseSection
      title="圖示區塊按鈕"
      component-name="UIButtonIconBlock"
      description="適合總覽或功能入口，可傳入標題、次標題、說明、圖示與前往位置。"
      usage='<UIButtonIconBlock title="圖片" subtitle="2 個元件" description="圖片上傳與顯示。" :icon="Images" to="/UI/images" />'
    >
      <div class="mx-auto w-[min(100%,480px)]">
        <UIButtonIconBlock
          title="圖片"
          subtitle="2 個元件"
          description="圖片上傳、預覽與空狀態顯示。"
          :icon="Images"
          to="/UI/buttons"
        />
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="展示頁頁籤"
      component-name="UIButtonPageTab"
      description="用於 UI 展示頁分類導覽；active 狀態會標示目前頁面並自動捲入可視範圍。"
      usage='<UIButtonPageTab title="按鈕" to="/UI/buttons" active />'
    >
      <div class="flex flex-wrap items-center justify-center gap-2 py-10">
        <UIButtonPageTab title="總覽" to="/UI/buttons" />
        <UIButtonPageTab title="按鈕" to="/UI/buttons" active />
        <UIButtonPageTab title="圖片" to="/UI/buttons" />
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="選項按鈕"
      component-name="UIButtonChoice"
      description="提供 default、selected、disabled 三種狀態，使用 select event 更新選擇。"
      usage='<UIButtonChoice text="下午" state="selected" @select="selectPeriod" />'
    >
      <div class="grid grid-cols-3 gap-3">
        <UIButtonChoice
          text="上午"
          :state="selectedChoice === '上午' ? 'selected' : 'default'"
          @select="selectedChoice = '上午'"
        />
        <UIButtonChoice
          text="下午"
          :state="selectedChoice === '下午' ? 'selected' : 'default'"
          @select="selectedChoice = '下午'"
        />
        <UIButtonChoice text="晚上" state="disabled" status-text="已滿" />
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="導覽／下拉按鈕"
      component-name="UIButtonNavMenu"
      description="文字、圖示、點擊函式與下拉設定均可自訂；項目可設定為危險色。"
      tone="brand"
      usage='<UIButtonNavMenu text="王小明" :icon="UserRound" has-dropdown :dropdown="menuConfig" />'
    >
      <div class="flex flex-wrap items-center justify-center gap-3 py-20">
        <UIButtonNavMenu
          text="王小明"
          :icon="UserRound"
          has-dropdown
          :dropdown="demoDropdown"
        />
        <UIButtonNavMenu
          text="一般操作"
          :on-click="() => setAction('點擊：一般操作')"
        />
      </div>
    </ShowcaseSection>
  </ShowcasePage>
</template>
