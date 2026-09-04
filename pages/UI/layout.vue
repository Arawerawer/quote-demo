<script setup lang="ts">
const currentStep = ref<1 | 2 | 3>(2)

const setStep = (step: 1 | 2 | 3) => {
  currentStep.value = step
}
</script>

<template>
  <ShowcasePage
    title="版面元件"
    description="頁首、步驟進度、內容容器與頁面底部操作區的組合方式。"
  >
    <ShowcaseSection
      title="頂部導覽"
      component-name="UIPageTopNav"
      description="本頁最上方即為元件的即時範例，包含首頁與 UI 目錄入口。"
      usage="<UIPageTopNav />"
    >
      <p class="text-brand-700 m-0 font-bold">
        ↑ 請直接操作目前視窗最上方的 TopNav。
      </p>
    </ShowcaseSection>

    <ShowcaseSection
      title="流程步驟"
      component-name="UIPageProgressSteps"
      description="current 接受 1、2、3，分別呈現未完成、目前與已完成的步驟狀態。"
      usage='<UIPageProgressSteps :current="2" />'
    >
      <div class="mb-5 grid grid-cols-3 gap-2.5 max-sm:grid-cols-1">
        <UIButtonChoice
          text="步驟 1"
          :state="currentStep === 1 ? 'selected' : 'default'"
          @select="setStep(1)"
        />
        <UIButtonChoice
          text="步驟 2"
          :state="currentStep === 2 ? 'selected' : 'default'"
          @select="setStep(2)"
        />
        <UIButtonChoice
          text="步驟 3"
          :state="currentStep === 3 ? 'selected' : 'default'"
          @select="setStep(3)"
        />
      </div>
      <div class="border-nurse-200 overflow-x-auto rounded-xl border bg-white">
        <UIPageProgressSteps :current="currentStep" />
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="頁面內容容器"
      component-name="UIPageScreenBody"
      description="限制內容最大寬度並提供預設內容與 footer slot。展示環境縮短了最小高度。"
      usage="<UIPageScreenBody><section>內容</section><template #footer>頁尾</template></UIPageScreenBody>"
    >
      <div
        class="screen-body-demo border-nurse-300 overflow-hidden rounded-[14px] border"
      >
        <UIPageScreenBody>
          <div class="bg-desert-50 text-brand-600 min-h-42.5 p-6">
            主要頁面內容
          </div>
          <template #footer
            ><div
              class="border-nurse-200 text-brand-600 border-t bg-white px-6 py-3.5 text-center"
            >
              Footer slot
            </div></template
          >
        </UIPageScreenBody>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="頁尾按鈕容器"
      component-name="UIPageFooterButtonBox"
      description="手機版固定於視窗底部、桌面版回到文件流；目錄中固定模式已限制於展示區。"
      usage="<UIPageFooterButtonBox><UIButtonPageBottom>下一步</UIButtonPageBottom></UIPageFooterButtonBox>"
    >
      <div
        class="footer-button-demo border-nurse-300 overflow-hidden rounded-[14px] border border-dashed"
      >
        <UIPageFooterButtonBox>
          <UIButtonPageBottom variant="secondary">上一步</UIButtonPageBottom>
          <UIButtonPageBottom>下一步</UIButtonPageBottom>
        </UIPageFooterButtonBox>
      </div>
    </ShowcaseSection>
  </ShowcasePage>
</template>

<style scoped lang="scss">
.screen-body-demo :deep(.screen-body) {
  min-height: 240px;
  border: 0;
}

.footer-button-demo {
  :deep(.page-footer-shell),
  :deep(.page-footer) {
    min-height: 0;
  }

  :deep(.page-footer) {
    position: static;
  }

  :deep(.page-footer__inner) {
    width: 100%;
  }
}
</style>
