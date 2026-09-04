<template>
  <ShowcasePage
    title="網格"
    description="使用 UIGrid 與 UIGridItem 建立響應式欄位配置。"
  >
    <ShowcaseSection
      title="響應式網格"
      component-name="UIGrid / UIGridItem"
      description="手機版整行，平板兩欄，桌面四欄。未設定的斷點會維持整行佔滿。"
      usage='<UIGrid>
  <UIGridItem sm="12" md="6" lg="3">
    這是一個網格項目
  </UIGridItem>
</UIGrid>'
    >
      <UIGrid>
        <UIGridItem sm="12" md="6" lg="3">
          <div
            class="border-nurse-200 bg-brand-50 text-brand-700 rounded-lg border p-4 text-center font-bold"
          >
            第一個網格項目
          </div>
        </UIGridItem>
        <UIGridItem sm="12" md="6" lg="3">
          <div
            class="border-nurse-200 bg-brand-50 text-brand-700 rounded-lg border p-4 text-center font-bold"
          >
            第二個網格項目
          </div>
        </UIGridItem>
        <UIGridItem sm="12" md="6" lg="3">
          <div
            class="border-nurse-200 bg-brand-50 text-brand-700 rounded-lg border p-4 text-center font-bold"
          >
            第三個網格項目
          </div>
        </UIGridItem>
        <UIGridItem sm="12" md="6" lg="3">
          <div
            class="border-nurse-200 bg-brand-50 text-brand-700 rounded-lg border p-4 text-center font-bold"
          >
            第四個網格項目
          </div>
        </UIGridItem>
      </UIGrid>
    </ShowcaseSection>

    <ShowcaseSection
      title="自訂欄數與預設寬度"
      component-name="UIGrid"
      description="UIGrid 預設為 12 欄，也可以指定父層欄數；UIGridItem 未設定尺寸時會整行佔滿。"
      usage='<UIGrid col="4">
  <UIGridItem>整行佔滿</UIGridItem>
  <UIGridItem sm="2">佔 2 欄</UIGridItem>
</UIGrid>'
    >
      <UIGrid col="4">
        <UIGridItem>
          <div
            class="border-nurse-200 bg-desert-100 text-brand-700 rounded-lg border p-4 text-center font-bold"
          >
            未設定尺寸，整行佔滿
          </div>
        </UIGridItem>
        <UIGridItem sm="2">
          <div
            class="border-nurse-200 bg-desert-100 text-brand-700 rounded-lg border p-4 text-center font-bold"
          >
            4 欄中的 2 欄
          </div>
        </UIGridItem>
      </UIGrid>
    </ShowcaseSection>
  </ShowcasePage>
</template>
