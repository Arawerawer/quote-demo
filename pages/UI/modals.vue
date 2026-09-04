<script setup lang="ts">
type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'

const sizeModalOpen = ref(false)
const longModalOpen = ref(false)
const requiredModalOpen = ref(false)
const activeSize = ref<ModalSize>('md')

const sizes: Array<{ label: string; value: ModalSize }> = [
  { label: 'SM', value: 'sm' },
  { label: 'MD', value: 'md' },
  { label: 'LG', value: 'lg' },
  { label: 'XL', value: 'xl' },
  { label: '全螢幕', value: 'fullscreen' },
]

const openSizeModal = (size: ModalSize) => {
  activeSize.value = size
  sizeModalOpen.value = true
}
</script>

<template>
  <ShowcasePage
    title="視窗"
    description="不同尺寸、操作區、強制確認與長內容捲動的彈出視窗。"
  >
    <ShowcaseSection
      title="視窗尺寸"
      component-name="UIModal"
      description="提供 384px、576px、768px、1024px 四種明顯級距，以及保留視窗安全間距的 fullscreen。"
      usage='<UIModal v-model="isOpen" title="標題" size="lg">內容</UIModal>'
    >
      <div class="flex flex-wrap justify-center gap-3 py-6">
        <UIFormButton
          v-for="item in sizes"
          :key="item.value"
          variant="outline"
          @click="openSizeModal(item.value)"
        >
          {{ item.label }}
        </UIFormButton>
      </div>

      <UIModal
        v-model="sizeModalOpen"
        :title="`${activeSize.toUpperCase()} 尺寸 Modal`"
        :size="activeSize"
      >
        <p class="text-brand-700 m-0 leading-[1.7]">
          Modal 內容會依照指定尺寸顯示，手機寬度下仍會自動保留安全間距。
        </p>
        <template #footer>
          <UIFormButton variant="outline" @click="sizeModalOpen = false"
            >取消</UIFormButton
          >
          <UIFormButton @click="sizeModalOpen = false">確認</UIFormButton>
        </template>
      </UIModal>
    </ShowcaseSection>

    <ShowcaseSection
      title="底部操作區"
      component-name="UIModal #footer"
      description="使用具名 footer template 放置操作按鈕，元件會自動置中並處理間距。"
      usage="<template #footer><UIFormButton>確認</UIFormButton></template>"
    >
      <p class="text-brand-600 m-0 text-center text-sm leading-[1.7]">
        上方尺寸示範已包含 footer slot，可查看取消與確認按鈕的排列。
      </p>
    </ShowcaseSection>

    <ShowcaseSection
      title="不可取消的確認視窗"
      component-name="UIModal"
      description="關閉遮罩、ESC 與右上角關閉按鈕，使用者必須透過指定操作完成流程。"
      usage='<UIModal :close-on-backdrop="false" :close-on-escape="false" :show-close="false" />'
    >
      <div class="flex justify-center py-6">
        <UIFormButton warning @click="requiredModalOpen = true"
          >開啟強制確認</UIFormButton
        >
      </div>

      <UIModal
        v-model="requiredModalOpen"
        title="重要操作確認"
        size="sm"
        :close-on-backdrop="false"
        :close-on-escape="false"
        :show-close="false"
      >
        <p class="text-brand-700 m-0 leading-[1.7]">
          此視窗無法透過遮罩、ESC 或右上角按鈕關閉，必須完成下方確認操作。
        </p>
        <template #footer>
          <UIFormButton @click="requiredModalOpen = false"
            >我已確認</UIFormButton
          >
        </template>
      </UIModal>
    </ShowcaseSection>

    <ShowcaseSection
      title="長內容捲動"
      component-name="UIModal"
      description="面板不會超出視窗；內容過長時只捲動內容區，標題與 footer 保持可見。"
      usage='<UIModal v-model="isOpen" size="lg"><LongContent /></UIModal>'
    >
      <div class="flex justify-center py-6">
        <UIFormButton @click="longModalOpen = true">開啟長內容</UIFormButton>
      </div>

      <UIModal v-model="longModalOpen" title="服務條款" size="lg">
        <div class="text-brand-700 grid gap-4 text-sm leading-[1.8]">
          <p v-for="index in 12" :key="index" class="m-0">
            第 {{ index }} 段內容：這是一段用來測試 Modal
            內容高度的展示文字。當內容超過可用視窗高度時，捲軸只會出現在內容區域。
          </p>
        </div>
        <template #footer>
          <UIFormButton variant="outline" @click="longModalOpen = false"
            >關閉</UIFormButton
          >
          <UIFormButton @click="longModalOpen = false">同意條款</UIFormButton>
        </template>
      </UIModal>
    </ShowcaseSection>
  </ShowcasePage>
</template>
