<script setup lang="ts">
type AlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question'

const isLoading = ref(false)
const isAlertOpen = ref(false)
const alert = reactive({
  title: '操作完成',
  text: '資料已成功儲存。',
  html: '',
  icon: 'success' as AlertIcon,
  showConfirmButton: true,
  showCancelButton: false,
  timer: 0,
})
let loadingTimer: ReturnType<typeof setTimeout> | undefined

const openAlert = (icon: AlertIcon) => {
  const messages: Record<AlertIcon, { title: string; text: string }> = {
    success: { title: '操作完成', text: '資料已成功儲存。' },
    error: { title: '操作失敗', text: '處理資料時發生錯誤，請稍後再試。' },
    warning: { title: '請注意', text: '這項操作可能影響現有資料。' },
    info: { title: '系統通知', text: '新的內容已經發布。' },
    question: { title: '確認操作', text: '確定要繼續執行這項操作嗎？' },
  }

  Object.assign(alert, messages[icon], {
    icon,
    html: '',
    showCancelButton: icon === 'question',
    showConfirmButton: true,
    timer: 0,
  })
  isAlertOpen.value = true
}

const openHtmlAlert = () => {
  Object.assign(alert, {
    title: 'HTML 內容',
    text: '',
    html: '<p>項目編號 <code>CMP-20260805</code> 已進入處理流程。</p>',
    icon: 'info' as AlertIcon,
    showCancelButton: false,
    showConfirmButton: true,
    timer: 0,
  })
  isAlertOpen.value = true
}

const openTimedAlert = (showButton: boolean) => {
  Object.assign(alert, {
    title: '已自動儲存',
    text: '這個提示會在 2.5 秒後自動關閉。',
    html: '',
    icon: 'success' as AlertIcon,
    showConfirmButton: showButton,
    showCancelButton: false,
    timer: 2500,
  })
  isAlertOpen.value = true
}

const runBrokenRequest = async () => {
  try {
    const response: { data?: { resourceId: string } } = {}
    if (!response.data) throw new Error('API 回傳資料缺少 data，無法取得內容。')
  } catch (error) {
    Object.assign(alert, {
      title: '程式執行失敗',
      text: error instanceof Error ? error.message : '發生未知錯誤。',
      html: '',
      icon: 'error' as AlertIcon,
      showConfirmButton: true,
      showCancelButton: false,
      timer: 0,
    })
    isAlertOpen.value = true
  }
}

const showLoading = () => {
  isLoading.value = true
  if (loadingTimer) clearTimeout(loadingTimer)
  loadingTimer = setTimeout(() => {
    isLoading.value = false
  }, 1400)
}

onBeforeUnmount(() => {
  if (loadingTimer) clearTimeout(loadingTimer)
})
</script>

<template>
  <ShowcasePage
    title="回饋狀態"
    description="用於阻斷式訊息、空資料、讀取中與內容骨架的視覺回饋。"
  >
    <UIPageLoading :visible="isLoading" />
    <UIAlert
      v-model="isAlertOpen"
      :title="alert.title"
      :text="alert.text"
      :html="alert.html"
      :icon="alert.icon"
      :show-confirm-button="alert.showConfirmButton"
      :show-cancel-button="alert.showCancelButton"
      :timer="alert.timer"
      confirm-text="確認"
      cancel-text="取消"
    />

    <ShowcaseSection
      title="Alert"
      component-name="UIAlert"
      description="支援純文字、可信任 HTML、五種動畫圖示、確認／取消操作與定時自動關閉。"
      usage='<UIAlert v-model="isOpen" title="操作完成" text="資料已儲存" icon="success" :timer="2500" />'
    >
      <div class="flex flex-wrap justify-center gap-3 py-5">
        <UIFormButton @click="openAlert('success')">Success</UIFormButton>
        <UIFormButton variant="danger" @click="openAlert('error')"
          >Error</UIFormButton
        >
        <UIFormButton variant="outline" @click="openAlert('warning')"
          >Warning</UIFormButton
        >
        <UIFormButton variant="outline" @click="openAlert('info')"
          >Info</UIFormButton
        >
        <UIFormButton variant="outline" @click="openAlert('question')"
          >Question</UIFormButton
        >
        <UIFormButton variant="outline" @click="openHtmlAlert"
          >HTML 內容</UIFormButton
        >
        <UIFormButton variant="outline" @click="openTimedAlert(false)"
          >自動關閉（無按鈕）</UIFormButton
        >
        <UIFormButton variant="outline" @click="openTimedAlert(true)"
          >自動關閉（含按鈕）</UIFormButton
        >
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="程式錯誤回傳"
      component-name="UIAlert"
      description="捕捉執行階段錯誤，將 Error.message 交給 Alert 顯示。"
      usage="try { await request() } catch (error) { alert.text = error instanceof Error ? error.message : '未知錯誤' }"
    >
      <div class="flex flex-col items-center gap-3 py-5 text-center">
        <UIFormButton variant="danger" @click="runBrokenRequest"
          >執行錯誤程式碼</UIFormButton
        >
        <p class="text-brand-600 m-0 text-sm">
          範例會模擬 API 缺少 data，並顯示捕捉到的錯誤訊息。
        </p>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="空資料狀態"
      component-name="UIEmptyState"
      description="內建 service 與 time 兩種情境，也能覆寫標題和說明。"
      usage='<UIEmptyState variant="time" />'
    >
      <div class="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <UIEmptyState variant="service" />
        <UIEmptyState variant="time" />
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="骨架載入"
      component-name="UISkeleton"
      description="提供 text、card、circle 三種 variant，width 與 height 可自行設定。"
      usage='<UISkeleton variant="text" width="70%" />'
    >
      <div class="grid grid-cols-[auto_1fr] items-center gap-3.5">
        <UISkeleton variant="circle" width="80px" height="80px" />
        <div class="grid gap-2.5">
          <UISkeleton variant="text" width="45%" />
          <UISkeleton variant="text" width="80%" />
        </div>
        <UISkeleton class="col-span-full" variant="card" />
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="頁面載入提示"
      component-name="UIPageLoading"
      description="固定於視窗上的非阻斷式提示，由 visible prop 控制。示範會在 1.4 秒後自動關閉。"
      usage='<UIPageLoading :visible="isLoading" />'
    >
      <UIButtonPageBottom variant="secondary" @click="showLoading"
        >顯示載入提示</UIButtonPageBottom
      >
    </ShowcaseSection>
  </ShowcasePage>
</template>
