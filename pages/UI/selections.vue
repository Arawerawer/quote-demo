<script setup lang="ts">
const selectedOption = ref('標準方案')

const options = [
  { title: '標準方案', description: '提供完整的基本設定與操作選項。' },
  { title: '進階方案', description: '提供更多可調整的自訂設定。' },
]
</script>

<template>
  <ShowcasePage
    title="選擇器"
    description="用於方案或內容選項的互動元件，範例會即時反映目前值。"
  >
    <ShowcaseSection
      title="可選卡片"
      component-name="UISelectableCard"
      description="適合呈現方案或內容選項；duration 與 price 皆可省略。點擊時觸發 select event。"
      usage='<UISelectableCard title="標準方案" description="基本設定" :selected="true" @select="select" />'
    >
      <div class="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <UISelectableCard
          v-for="option in options"
          :key="option.title"
          v-bind="option"
          :selected="selectedOption === option.title"
          @select="selectedOption = option.title"
        />
      </div>
      <p class="text-brand-600 mt-4 mb-0 text-[13px]">
        目前選擇：{{ selectedOption }}
      </p>
    </ShowcaseSection>
  </ShowcasePage>
</template>
