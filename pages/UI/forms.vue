<script setup lang="ts">
import { Plus, Search } from '@lucide/vue'

const name = ref('王小明')
const email = ref('')
const password = ref('demo-password')
const readonlyValue = ref('系統自動帶入')
const note = ref('')
const location = ref('taipei')
const warningLocation = ref('')
const serviceCategories = ref(['cut', 'color', 'perm'])
const expandedServiceCategories = ref(['cut', 'color', 'perm', 'care'])
const staffSkills = ref<string[]>([])
const customServices = ref<string[]>([])
const footerServices = ref(['cut'])
const manualContact = ref('other')
const contactMethod = ref('email')
const symbolRadio = ref('enabled')
const selectedDate = ref('2026-08-12')
const selectedTime = ref('14:00')
const participantCount = ref(2)
const intensity = ref(40)
const agreed = ref(true)
const newsletter = ref(false)
const symbolCheckbox = ref(true)
const mergeKeyword = ref('王小明')

const locationOptions = [
  { label: '台北門市', value: 'taipei' },
  { label: '台中門市', value: 'taichung' },
  { label: '高雄門市（暫停服務）', value: 'kaohsiung', disabled: true },
]

const serviceOptions = [
  { label: '剪髮服務', value: 'cut', description: '洗髮、剪髮與基礎造型' },
  { label: '染髮服務', value: 'color', description: '單色染、補染與髮根處理' },
  { label: '燙髮服務', value: 'perm', description: '冷燙、溫塑與局部燙髮' },
  { label: '護髮療程', value: 'care', description: '依髮況安排修護流程' },
  {
    label: '頭皮養護',
    value: 'scalp',
    disabled: true,
    description: '目前暫停預約',
  },
]

const simpleServiceOptions = [
  { label: '剪髮服務', value: 'cut' },
  { label: '染髮服務', value: 'color' },
  { label: '燙髮服務', value: 'perm' },
  { label: '護髮療程', value: 'care' },
]

const footerServiceOptions = ref([...simpleServiceOptions])

function addFooterService() {
  const option = { label: '新服務項目', value: 'new-service' }

  if (!footerServiceOptions.value.some((item) => item.value === option.value)) {
    footerServiceOptions.value = [...footerServiceOptions.value, option]
  }
  if (!footerServices.value.includes(option.value)) {
    footerServices.value = [...footerServices.value, option.value]
  }
}

function addFooterServiceAndClose(close: () => void) {
  addFooterService()
  close()
}

const contactOptions = [
  { label: 'Email', value: 'email' },
  { label: '電話', value: 'phone' },
  { label: '簡訊', value: 'sms' },
]
</script>

<template>
  <ShowcasePage
    title="表單"
    description="輸入與勾選元件的常用狀態，包括必填、選填、唯讀及停用。"
  >
    <ShowcaseSection
      title="表單欄位容器"
      component-name="UIFormGroup"
      description="只負責標題、星號、警告、外框 class 與前後 slots，不綁定特定欄位元件。"
      usage='<UIFormGroup label="欄位標題" star warning-text="錯誤訊息">\n  欄位內容\n</UIFormGroup>'
    >
      <div class="form-grid">
        <UIFormGroup label="一般容器" star>
          <div class="group-demo-control">Default slot 內容</div>
        </UIFormGroup>
        <UIFormGroup label="選填容器">
          <template #slot-label>
            <small class="form-group__optional">（選填）</small>
          </template>
          <div class="group-demo-control">可使用 slot-label</div>
        </UIFormGroup>
        <UIFormGroup label="警告容器" star warning-text="此欄位內容有誤">
          <div class="group-demo-control">warning 與 warningText</div>
        </UIFormGroup>
      </div>

      <div class="form-grid">
        <UIFormGroup label="自訂標題內容">
          <template #slot-before
            ><p class="slot-example">slot-before</p></template
          >
          <div class="group-demo-control">Default slot 內容</div>
          <template #slot-after
            ><p class="slot-example">slot-after</p></template
          >
        </UIFormGroup>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="輸入框"
      component-name="UIFormInput"
      description="獨立負責 v-model 與原生輸入狀態；以 status 管理 default、error、warning，並可用 size 調整高度。"
      usage='<UIFormInput v-model="name" placeholder="請輸入姓名" status="error" size="md" />'
    >
      <div class="form-grid">
        <UIFormGroup label="Default">
          <UIFormInput v-model="name" placeholder="請輸入姓名" />
        </UIFormGroup>

        <UIFormGroup label="Warning" warning>
          <UIFormInput
            v-model="email"
            placeholder="輸入格式錯誤"
            status="error"
          />
        </UIFormGroup>

        <UIFormGroup label="Readonly">
          <UIFormInput v-model="readonlyValue" readonly />
        </UIFormGroup>

        <UIFormGroup label="Disabled">
          <UIFormInput model-value="不可編輯" disabled />
        </UIFormGroup>

        <UIFormGroup label="Small">
          <UIFormInput model-value="較小尺寸" size="sm" readonly />
        </UIFormGroup>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="密碼欄位"
      component-name="UIFormPassword"
      description="具備顯示／隱藏密碼按鈕，支援 required、disabled、readonly 與 autocomplete。"
      usage='<UIFormGroup label="密碼" star>\n  <UIFormPassword v-model="password" required />\n</UIFormGroup>'
    >
      <div class="form-grid">
        <UIFormGroup label="密碼" star>
          <UIFormPassword
            v-model="password"
            placeholder="請輸入密碼"
            required
          />
        </UIFormGroup>
        <UIFormGroup label="密碼錯誤" warning>
          <UIFormPassword model-value="wrong-password" warning />
        </UIFormGroup>
        <UIFormGroup label="停用密碼欄位">
          <UIFormPassword model-value="password" disabled />
        </UIFormGroup>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="複製文字"
      component-name="UIFormCopy"
      description="顯示唯讀文字並提供複製按鈕，複製成功後圖示會變為勾勾。"
      usage='<UIFormCopy text="可複製的文字" />'
    >
      <div class="form-grid">
        <UIFormGroup label="可複製文字">
          <UIFormCopy text="copy-this-text" />
        </UIFormGroup>
        <UIFormGroup label="停用複製文字">
          <UIFormCopy text="不可複製的文字" disabled />
        </UIFormGroup>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="多行輸入"
      component-name="UIFormTextarea"
      description="支援 rows、maxlength、resize，以及 default、warning、disabled 狀態。"
      usage='<UIFormTextarea v-model="note" :rows="4" warning />'
    >
      <div class="form-grid form-grid--three">
        <UIFormGroup label="Default">
          <UIFormTextarea v-model="note" placeholder="請輸入特殊需求" />
        </UIFormGroup>
        <UIFormGroup label="Warning" warning>
          <UIFormTextarea model-value="內容格式有誤" warning />
        </UIFormGroup>
        <UIFormGroup label="Disabled">
          <UIFormTextarea model-value="不可編輯的內容" disabled />
        </UIFormGroup>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="下拉選單"
      component-name="UIFormSelect"
      description="透過 options 物件陣列建立選項，支援一般、warning、disabled 狀態。"
      usage='<UIFormSelect v-model="location" :options="locationOptions" warning />'
    >
      <div class="form-grid form-grid--three">
        <div class="field-demo">
          <span>Default</span
          ><UIFormSelect v-model="location" :options="locationOptions" />
        </div>
        <div class="field-demo">
          <span>Warning</span
          ><UIFormSelect
            v-model="warningLocation"
            :options="locationOptions"
            warning
          />
        </div>
        <div class="field-demo">
          <span>Disabled</span
          ><UIFormSelect
            model-value="taipei"
            :options="locationOptions"
            disabled
          />
        </div>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="單選選項"
      component-name="UIFormRadio + UIFormRadioGroup"
      description="可手動組合單一 Radio，或用 options 產生 RadioGroup；bordered 可建立與輸入框一致的整塊點擊區域。純符號模式必須提供 aria-label。"
      usage='<UIFormRadio v-model="method" name="contact" value="email" label="Email" />\n<UIFormRadio v-model="enabled" name="enabled" value="yes" aria-label="啟用" />\n<UIFormRadio bordered label="Email" />\n<UIFormRadioGroup v-model="method" :options="contactOptions" />'
    >
      <div class="option-demo-grid">
        <UIFormGroup label="手動組合">
          <div class="radio-list">
            <UIFormRadio
              v-model="manualContact"
              name="notification-method"
              value="email"
              label="Email"
            />
            <UIFormRadio
              v-model="manualContact"
              name="notification-method"
              value="phone"
              label="電話"
            />
            <UIFormRadio
              v-model="manualContact"
              name="notification-method"
              value="sms"
              warning
              >簡訊</UIFormRadio
            >
          </div>
        </UIFormGroup>
        <UIFormGroup label="Options 群組">
          <UIFormRadioGroup v-model="contactMethod" :options="contactOptions" />
        </UIFormGroup>
        <UIFormGroup label="純 Radio 符號">
          <UIFormRadio
            v-model="symbolRadio"
            name="symbol-radio"
            value="enabled"
            aria-label="啟用功能"
          />
        </UIFormGroup>
        <UIFormGroup label="外框 Radio">
          <div class="flex items-center gap-2">
            <UIFormRadio
              v-model="manualContact"
              name="bordered-radio"
              value="other"
              label="其他"
              bordered
            />
            <UIFormInput placeholder="其他" />
          </div>
        </UIFormGroup>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="多選下拉選單"
      component-name="UIFormMultiSelect"
      description="自訂多選下拉選單，預設完整顯示已選項目並將選單掛到 body，避免受到外容器裁切；支援搜尋、標籤摘要、直接輸入、底部操作、停用與警告狀態。"
      usage='<UIFormMultiSelect
  v-model="services"
  :options="serviceOptions"
  placeholder="選擇服務項目"
  searchable
  clearable
/>

<!-- 使用摘要模式時，指定要顯示的標籤數量 -->
<UIFormMultiSelect
  v-model="services"
  :options="simpleServiceOptions"
  :max-tag-count="2"
  :searchable="false"
/>

<!-- 在欄位內輸入文字；allow-custom-value 可建立新項目 -->
<UIFormMultiSelect
  v-model="services"
  :options="simpleServiceOptions"
  editable
  allow-custom-value
/>

<!-- 下拉選單最下方的 footer slot -->
<UIFormMultiSelect v-model="services" :options="simpleServiceOptions">
  <template #footer="{ close }">
    <button type="button" @click="close">新增服務項目</button>
  </template>
</UIFormMultiSelect>

/>'
    >
      <UIFormGroup label="Default（完整顯示）" class="mb-4">
        <UIFormMultiSelect
          v-model="expandedServiceCategories"
          :options="simpleServiceOptions"
          placeholder="選擇服務項目"
          :searchable="false"
        />
      </UIFormGroup>

      <div class="form-grid form-grid--three">
        <UIFormGroup label="最多顯示 2 個標籤">
          <UIFormMultiSelect
            v-model="serviceCategories"
            :options="serviceOptions"
            placeholder="選擇服務項目"
            :max-tag-count="2"
          />
        </UIFormGroup>
        <UIFormGroup label="Warning" warning>
          <UIFormMultiSelect
            v-model="staffSkills"
            :options="serviceOptions"
            placeholder="至少選擇一項專長"
            warning
            :clearable="false"
          />
        </UIFormGroup>
        <UIFormGroup label="Disabled">
          <UIFormMultiSelect
            :model-value="['cut', 'care']"
            :options="serviceOptions"
            disabled
          />
        </UIFormGroup>
      </div>

      <div class="form-grid">
        <UIFormGroup label="可直接輸入文字">
          <UIFormMultiSelect
            v-model="customServices"
            :options="simpleServiceOptions"
            placeholder="輸入或選擇服務項目"
            editable
            allow-custom-value
          />
        </UIFormGroup>
        <UIFormGroup label="下拉選單底部按鈕">
          <UIFormMultiSelect
            v-model="footerServices"
            :options="footerServiceOptions"
            placeholder="選擇服務項目"
          >
            <template #footer="{ close }">
              <button
                class="text-brand-700 hover:bg-brand-50 flex h-9 w-full items-center justify-center gap-1.5 rounded-md text-sm font-bold transition-colors"
                type="button"
                @click="addFooterServiceAndClose(close)"
              >
                <Plus :size="16" :stroke-width="2.5" aria-hidden="true" />
                新增服務項目
              </button>
            </template>
          </UIFormMultiSelect>
        </UIFormGroup>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="多選選項"
      component-name="UIFormCheckbox"
      description="可獨立組合多個核取項目；bordered 可建立與輸入框一致的整塊點擊區域。不需要文字時省略 label／slot，並提供 aria-label。"
      usage='<UIFormCheckbox v-model="agreed" label="我同意服務條款" />\n<UIFormCheckbox v-model="enabled" aria-label="啟用通知" />\n<UIFormCheckbox bordered label="接收通知" />'
    >
      <div class="check-list">
        <UIFormCheckbox v-model="agreed" label="我同意服務條款" />
        <UIFormCheckbox v-model="newsletter" warning
          >接收通知與最新消息</UIFormCheckbox
        >
        <UIFormCheckbox label="此選項目前不可使用" disabled />
        <div class="symbol-example">
          <span>純 Checkbox 符號</span>
          <UIFormCheckbox v-model="symbolCheckbox" aria-label="啟用通知" />
        </div>
        <UIFormCheckbox v-model="newsletter" label="外框 Checkbox" bordered />
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="合併表單欄位"
      component-name="UIFormMerge"
      description="以單一外框合併多個支援欄位，欄位間以左側分隔線區隔；任一項目取得焦點時，整個容器會顯示焦點狀態。"
      usage='<UIFormMerge>
  <UIFormDate v-model="date" />
  <UIFormTime v-model="time" />
  <UIFormNumber v-model="count" />
</UIFormMerge>'
    >
      <div class="grid gap-5">
        <UIFormGroup label="輸入框、下拉選單與按鈕">
          <UIFormMerge>
            <UIFormInput v-model="mergeKeyword" placeholder="搜尋姓名" />
            <UIFormSelect v-model="location" :options="locationOptions" />
            <UIFormButton
              ><Search :size="17" aria-hidden="true" />查詢</UIFormButton
            >
          </UIFormMerge>
        </UIFormGroup>

        <UIFormGroup label="輸入框 附帶單位">
          <UIFormMerge>
            <span class="unit">單位</span>
            <UIFormInput placeholder="請輸入數值" />
            <span class="unit">單位</span>
          </UIFormMerge>
        </UIFormGroup>

        <UIFormGroup label="日期、時間與數值">
          <UIFormMerge>
            <UIFormDate v-model="selectedDate" />
            <UIFormTime v-model="selectedTime" :step="1800" />
            <UIFormNumber v-model="participantCount" :min="1" :max="10" />
          </UIFormMerge>
        </UIFormGroup>

        <UIFormGroup label="有框選項">
          <UIFormMerge>
            <UIFormRadio
              v-model="manualContact"
              name="merge-contact"
              value="email"
              label="Email"
              bordered
            />
            <UIFormRadio
              v-model="manualContact"
              name="merge-contact"
              value="phone"
              label="電話"
              bordered
            />
            <UIFormCheckbox v-model="agreed" label="同意條款" bordered />
          </UIFormMerge>
        </UIFormGroup>

        <UIFormGroup label="多選下拉選單">
          <UIFormMerge>
            <UIFormMultiSelect
              v-model="serviceCategories"
              :options="serviceOptions"
              placeholder="選擇服務項目"
              :max-tag-count="2"
            />
            <UIFormButton variant="secondary">套用</UIFormButton>
          </UIFormMerge>
        </UIFormGroup>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="輸入框旁按鈕"
      component-name="UIFormButton"
      description="以 variant 選擇語意色彩，以 appearance 切換實心或外框樣式；預設為 primary 實心按鈕。"
      usage='<UIFormButton variant="primary">主要操作</UIFormButton>
<UIFormButton variant="danger" appearance="outline">刪除資料</UIFormButton>'
    >
      <div class="grid gap-6">
        <UIFormGroup label="實心按鈕">
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <UIFormButton variant="primary">Primary</UIFormButton>
            <UIFormButton variant="secondary">Secondary</UIFormButton>
            <UIFormButton variant="warning">Warning</UIFormButton>
            <UIFormButton variant="danger">Danger</UIFormButton>
          </div>
        </UIFormGroup>

        <UIFormGroup label="外框按鈕">
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <UIFormButton variant="primary" appearance="outline"
              >Primary</UIFormButton
            >
            <UIFormButton variant="secondary" appearance="outline"
              >Secondary</UIFormButton
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
            <UIFormButton
              ><Search :size="17" aria-hidden="true" />查詢</UIFormButton
            >
          </div>
        </UIFormGroup>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="日期、時間、數值與拉桿"
      component-name="UIFormDate + UIFormTime + UIFormNumber + UIFormRange"
      description="分別封裝原生 date、time、number 與 range，保留瀏覽器輸入能力並統一樣式。"
      usage='<UIFormDate v-model="date" min="2026-08-01" />\n<UIFormRange v-model="value" :min="0" :max="100" value-suffix="%" />'
    >
      <div class="form-grid">
        <UIFormGroup label="日期" star>
          <UIFormDate
            v-model="selectedDate"
            min="2026-08-01"
            max="2026-12-31"
            required
          />
        </UIFormGroup>
        <UIFormGroup label="時間" star>
          <UIFormTime
            v-model="selectedTime"
            min="09:00"
            max="20:00"
            :step="1800"
            required
            warning
          />
        </UIFormGroup>
        <UIFormGroup label="參與人數">
          <UIFormNumber v-model="participantCount" :min="1" :max="10" />
        </UIFormGroup>
        <UIFormGroup label="造型調整幅度">
          <UIFormRange
            v-model="intensity"
            :min="0"
            :max="100"
            :step="5"
            value-suffix="%"
            warning
          />
        </UIFormGroup>
      </div>
    </ShowcaseSection>
  </ShowcasePage>
</template>
