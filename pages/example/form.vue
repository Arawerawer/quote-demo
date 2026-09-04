<script setup lang="ts">
const title = ref('')
const category = ref('')
const selectedDate = ref('')
const selectedTime = ref('')
const content = ref('')
const city = ref('')
const address = ref('')
const preferredContact = ref('email')
const enabledOptions = reactive<Record<string, boolean>>({
  email: false,
  sms: false,
  push: false,
})
const selectedMap = reactive<Record<string, boolean>>({
  dashboard: false,
  chart: false,
  report: false,
})
const isSelectionModalOpen = ref(false)
const savedMessage = ref('')

const categoryOptions = [
  { label: '系統公告', value: 'announcement' },
  { label: '活動消息', value: 'event' },
  { label: '功能更新', value: 'update' },
]

const cityOptions = [
  { label: '台北市', value: 'taipei' },
  { label: '新北市', value: 'new-taipei' },
  { label: '台中市', value: 'taichung' },
  { label: '高雄市', value: 'kaohsiung' },
]

const contactOptions = [
  { label: 'Email', value: 'email' },
  { label: '簡訊', value: 'sms' },
  { label: '電話', value: 'phone' },
]

const selectionOptions = [
  { label: '首頁儀表板', value: 'dashboard' },
  { label: '感測器圖表', value: 'chart' },
  { label: '分析報告', value: 'report' },
]

const selectedSummary = computed(() =>
  selectionOptions
    .filter((option) => selectedMap[option.value])
    .map((option) => option.label)
    .join('、'),
)

const save = () => {
  savedMessage.value = '表單資料已完成展示儲存。'
}

const goBack = () => navigateTo('/example')
</script>

<template>
  <div class="mx-auto w-[min(100%,1180px)] p-6 pb-28 max-md:p-4 max-md:pb-32">
    <UIPageHeader
      title="表單欄位範例"
      description="使用表單元件庫與網格元件建立常見的資料編輯頁面。"
      class="mb-4"
    />

    <form @submit.prevent="save">
      <UIPageContent class="flex flex-col gap-6">
        <UIGrid>
          <UIGridItem sm="12" md="6">
            <UIFormGroup label="標題" star>
              <UIFormInput v-model="title" placeholder="請輸入標題" required />
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem sm="12" md="6">
            <UIFormGroup label="分類" star>
              <UIFormSelect
                v-model="category"
                :options="categoryOptions"
                required
              />
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem sm="12" md="6">
            <UIFormGroup label="日期" star>
              <UIFormDate v-model="selectedDate" required />
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem sm="12" md="6">
            <UIFormGroup label="時間" star>
              <UIFormTime v-model="selectedTime" required />
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem>
            <UIFormGroup label="內容" star>
              <UIFormTextarea
                v-model="content"
                :rows="6"
                placeholder="請輸入內容"
                required
              />
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem>
            <UIFormGroup label="選擇項目" star>
              <div class="inline-field">
                <UIFormInput
                  class="min-w-0 flex-1"
                  :model-value="selectedSummary"
                  placeholder="請選擇項目"
                  readonly
                  required
                />
                <UIFormButton
                  type="button"
                  variant="secondary"
                  @click="isSelectionModalOpen = true"
                >
                  選擇
                </UIFormButton>
              </div>
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem>
            <UIFormGroup label="地址" star>
              <div class="inline-field">
                <UIFormSelect
                  v-model="city"
                  class="w-36 shrink-0"
                  :options="cityOptions"
                  placeholder="選擇縣市"
                  required
                />
                <UIFormInput
                  v-model="address"
                  placeholder="請輸入詳細地址"
                  required
                />
              </div>
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem sm="12" md="6">
            <UIFormGroup label="勾選選項">
              <div class="flex flex-col gap-3 py-2">
                <UIFormCheckbox
                  v-model="enabledOptions.email"
                  label="接收 Email 通知"
                />
                <UIFormCheckbox
                  v-model="enabledOptions.sms"
                  label="接收簡訊通知"
                />
                <UIFormCheckbox
                  v-model="enabledOptions.push"
                  label="啟用推播通知"
                />
              </div>
            </UIFormGroup>
          </UIGridItem>

          <UIGridItem sm="12" md="6">
            <UIFormGroup label="單選項目">
              <div class="flex flex-col gap-3 py-2">
                <UIFormRadioGroup
                  v-model="preferredContact"
                  :options="contactOptions"
                  direction="vertical"
                />
                <UIFormRadio
                  v-model="preferredContact"
                  value="other"
                  label="其他"
                />
              </div>
            </UIFormGroup>
          </UIGridItem>
        </UIGrid>

        <div class="border-nurse-200 border-t pt-6">
          <div class="mb-4">
            <h2 class="text-brand-900 m-0 text-xl font-bold">欄位錯誤狀態</h2>
            <p class="text-nurse-600 m-0 mt-1 text-sm">
              使用 warning 與 warning-text 顯示錯誤欄位及欄位下方的提示訊息。
            </p>
          </div>

          <UIGrid>
            <UIGridItem sm="12" md="6">
              <UIFormGroup
                label="標題"
                star
                warning
                warning-text="請輸入標題。"
              >
                <UIFormInput placeholder="請輸入標題" warning />
              </UIFormGroup>
            </UIGridItem>

            <UIGridItem sm="12" md="6">
              <UIFormGroup
                label="分類"
                star
                warning
                warning-text="請選擇一個分類。"
              >
                <UIFormSelect
                  :options="categoryOptions"
                  warning
                  placeholder="請選擇分類"
                />
              </UIFormGroup>
            </UIGridItem>

            <UIGridItem>
              <UIFormGroup
                label="內容"
                star
                warning
                warning-text="內容不可為空，請至少輸入一段文字。"
              >
                <UIFormTextarea placeholder="請輸入內容" warning />
              </UIFormGroup>
            </UIGridItem>
          </UIGrid>
        </div>

        <p
          v-if="savedMessage"
          class="bg-brand-50 text-brand-700 m-0 rounded-lg px-4 py-3 text-sm font-bold"
          role="status"
        >
          {{ savedMessage }}
        </p>
      </UIPageContent>

      <UIPageFooterButtonBox>
        <UIButtonPageBottom variant="secondary" type="button" @click="goBack">
          返回
        </UIButtonPageBottom>
        <UIButtonPageBottom type="submit">儲存</UIButtonPageBottom>
      </UIPageFooterButtonBox>
    </form>

    <UIModal v-model="isSelectionModalOpen" title="選擇項目" size="sm">
      <div class="flex flex-col gap-4 py-2">
        <UIFormCheckbox
          v-for="option in selectionOptions"
          :key="option.value"
          v-model="selectedMap[option.value]"
          :label="option.label"
        />
      </div>
      <template #footer>
        <UIFormButton variant="outline" @click="isSelectionModalOpen = false">
          取消
        </UIFormButton>
        <UIFormButton @click="isSelectionModalOpen = false">確認</UIFormButton>
      </template>
    </UIModal>
  </div>
</template>
