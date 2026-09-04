<script setup lang="ts">
const draggableItems = ref([
  { id: 1, text: '預約確認通知' },
  { id: 2, text: '服務前提醒' },
  { id: 3, text: '服務後滿意度調查' },
  { id: 4, text: '會員優惠訊息' },
])
</script>

<template>
  <ShowcasePage title="清單" description="">
    <ShowcaseSection
      title="資訊呈現清單"
      component-name="UIFieldGroup + UIField"
      description="用於呈現資訊的清單，適合展示多個欄位的資料。"
      usage="<UIFieldGroup col='12'><UIField title='欄位名稱' sm='6'>欄位內容</UIField></UIFieldGroup>"
    >
      <UIFieldGroup col="12">
        <UIField title="欄位名稱" sm="6"
          >欄位內容欄位內容欄位內容欄位內容欄位內容欄位內容欄位內容欄位內容欄位內容欄位內容</UIField
        >
        <UIField title="欄位名稱" sm="6">欄位內容</UIField>
        <UIField title="欄位名稱">欄位內容</UIField>
        <UIField title="欄位名稱">欄位內容</UIField>
        <UIField title="欄位名稱">欄位內容</UIField>
      </UIFieldGroup>
    </ShowcaseSection>

    <ShowcaseSection
      title="直向清單"
      component-name="UIListGroup + UIListItem"
      description="以直向排列呈現連續內容；UIListItem 可直接傳入文字，也可以透過 default slot 放入其他元件。"
      usage="<UIListGroup>
  <UIListItem variant='primary' text='Primary 標題' />
  <UIListItem text='單純文字' />
  <UIListItem><UIFormButton text='子元件內容' /></UIListItem>
</UIListGroup>"
    >
      <UIListGroup>
        <UIListItem variant="primary" text="標題列" />
        <UIListItem text="單純使用文字的清單項目" />
        <UIListItem>
          <div class="flex w-full items-center justify-between gap-3">
            <span>使用 default slot 放入子元件</span>
            <UIFormButton text="檢視" size="sm" />
          </div>
        </UIListItem>
        <UIListItem>
          <div class="flex w-full items-center justify-between gap-3">
            <span>也可以放入狀態或其他內容</span>
            <span class="text-brand-600 text-sm font-bold">已完成</span>
          </div>
        </UIListItem>
        <UIListItem text="偶數項目會套用淡灰色背景" />
      </UIListGroup>
    </ShowcaseSection>

    <ShowcaseSection
      title="可拖曳排序清單"
      component-name="UIListDraggable"
      description="以 v-model 綁定項目陣列，從每列左側的拖曳把手調整順序；可用 item slot 自訂列內容。"
      usage="<UIListDraggable v-model='items'>
  <template #item='{ item }'>
    {{ item.text }}
  </template>
</UIListDraggable>"
    >
      <UIListDraggable v-model="draggableItems" />
    </ShowcaseSection>
  </ShowcasePage>
</template>
