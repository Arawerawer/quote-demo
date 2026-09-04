<script setup lang="ts">
const uploadedImage = ref<File | null>(null)

const uploadUsage = `<UIImageUpload v-model="imageFile" />`
const displayUsage = `<UIImageDisplay src="/images/example.jpg" alt="圖片說明" />
<UIImageDisplay />`
</script>

<template>
  <ShowcasePage
    title="圖片"
    description="提供圖片上傳、預覽與無圖片狀態的共用元件。"
  >
    <ShowcaseSection
      title="圖片上傳"
      component-name="UIImageUpload"
      description="可將圖片拖曳至區塊，或點擊開啟檔案選擇器；選取後可重新選擇或移除檔案。"
      :usage="uploadUsage"
    >
      <div class="mx-auto w-[min(100%,620px)]">
        <UIImageUpload v-model="uploadedImage" />
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="圖片顯示"
      component-name="UIImageDisplay"
      description="顯示指定圖片；未提供來源或圖片載入失敗時，會自動顯示無圖片圖示。"
      :usage="displayUsage"
    >
      <div class="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <div class="grid gap-2">
          <strong class="text-brand-700 text-sm">圖片已載入</strong>
          <UIImageDisplay src="/images/logo.png" alt="品牌識別圖" />
        </div>
        <div class="grid gap-2">
          <strong class="text-brand-700 text-sm">無圖片</strong>
          <UIImageDisplay />
        </div>
      </div>
    </ShowcaseSection>
  </ShowcasePage>
</template>
