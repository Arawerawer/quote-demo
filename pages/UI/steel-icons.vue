<script setup lang="ts">
import type { SteelIconName } from '~/components/UI/Steel/Icon.vue'

const icons: { name: SteelIconName; title: string }[] = [
  { name: 'bending', title: '鋼板彎折' },
  { name: 'c-channel', title: 'C 型鋼' },
  { name: 'angle', title: '角鐵' },
  { name: 'flat-bar', title: '扁鐵' },
  { name: 'h-beam', title: 'H 型鋼' },
  { name: 'corrugated', title: '水槽鋼瓦' },
  { name: 'connector', title: '連接板' },
]
</script>

<template>
  <div class="mx-auto w-[min(100%,1180px)] p-6 max-md:p-4">
    <UIPageHeader
      title="鋼材圖示"
      description="七個品項的等角投影圖示，統一用 brand-500，實際套用在首頁卡片。"
      class="mb-4"
    />

    <UIPageContent class="flex flex-col gap-8">
      <!-- 放大檢視，方便看細節有沒有畫歪 -->
      <section class="flex flex-col gap-3">
        <h2 class="text-brand-900 m-0 text-lg font-bold">放大檢視</h2>

        <div
          class="grid grid-cols-7 gap-3 max-md:grid-cols-4 max-sm:grid-cols-3"
        >
          <div
            v-for="icon in icons"
            :key="icon.name"
            class="flex flex-col items-center gap-2"
          >
            <div
              class="bg-nurse-100 text-brand-500 grid h-24 w-full place-items-center rounded-xl"
            >
              <UISteelIcon :name="icon.name" :size="64" />
            </div>
            <span class="text-nurse-700 text-xs">{{ icon.title }}</span>
          </div>
        </div>
      </section>

      <!-- 首頁卡片實際尺寸 -->
      <section class="flex flex-col gap-3">
        <h2 class="text-brand-900 m-0 text-lg font-bold">首頁卡片實際尺寸</h2>

        <div class="grid grid-cols-3 gap-3 max-sm:grid-cols-2">
          <div
            v-for="icon in icons"
            :key="icon.name"
            class="text-brand-900 border-nurse-200 flex h-24 items-center justify-center gap-3 rounded-lg border bg-white p-3"
          >
            <UISteelIcon
              :name="icon.name"
              :size="44"
              class="text-brand-500 shrink-0"
            />
            <strong class="text-base">{{ icon.title }}</strong>
          </div>
        </div>
      </section>
    </UIPageContent>
  </div>
</template>
