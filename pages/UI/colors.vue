<script setup lang="ts">
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

const palettes = [
  {
    title: 'Brand',
    token: 'brand',
    description: '主要品牌與操作色彩。',
  },
  {
    title: 'Secondary',
    token: 'secondary',
    description: '次要操作與中性輔助色彩。',
  },
  {
    title: 'Warning',
    token: 'warning',
    description: '需要留意的操作與狀態色彩。',
  },
  {
    title: 'Danger',
    token: 'danger',
    description: '刪除、錯誤與高風險操作色彩。',
  },
  {
    title: 'Desert',
    token: 'desert',
    description: '頁面背景、文字與溫和的中性色彩。',
  },
  {
    title: 'Nurse',
    token: 'nurse',
    description: '邊框、停用與冷調中性色彩。',
  },
  {
    title: 'Rose',
    token: 'rose',
    description: '既有表單警告與錯誤狀態色彩。',
  },
] as const

const colorVariable = (token: string, shade: number) =>
  `--color-${token}-${shade}`
</script>

<template>
  <ShowcasePage
    title="顏色"
    description="專案的 Tailwind 色彩 token。每個色票直接使用對應的 CSS 變數渲染。"
  >
    <ShowcaseSection
      v-for="palette in palettes"
      :key="palette.token"
      :title="palette.title"
      :component-name="`--color-${palette.token}-*`"
      :description="palette.description"
    >
      <div class="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-11">
        <div
          v-for="shade in shades"
          :key="shade"
          class="border-nurse-200 overflow-hidden rounded-lg border bg-white"
        >
          <div
            class="h-20"
            :style="{
              backgroundColor: `var(${colorVariable(palette.token, shade)})`,
            }"
          />
          <div class="grid gap-1 p-1.5">
            <span class="text-brand-800 text-sm font-bold">{{ shade }}</span>
            <code class="text-brand-600 text-[10px] tracking-[-0.05em]">
              {{ colorVariable(palette.token, shade) }}
            </code>
          </div>
        </div>
      </div>
    </ShowcaseSection>
  </ShowcasePage>
</template>
