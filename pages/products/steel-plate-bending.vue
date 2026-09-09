<script setup lang="ts">
import { buildAddedText, type QuoteCartItem } from '~/composables/useQuoteCart'

// 填寫流程整段在 components/Product/BendingForm.vue，
// 這頁只負責標題、把結果收進詢價單、以及加入後的提示與導頁。
// 抽出去是為了讓詢價單的「修改」彈窗能共用同一套流程。
const { addItem } = useQuoteCart()

// 加入成功的提示，自動關；不放確認鈕才不會擋住接著填下一筆
const isAddedAlertOpen = ref(false)
const addedAlertText = ref('')

// 提示關掉後要去哪。記成 ref 而不是寫死，因為兩顆送出鈕共用同一顆提示視窗：
// 加入詢價回首頁繼續挑，送出詢價去詢價單填聯絡資訊
const pendingRedirect = ref('/')

// 秒數也是兩條路不同：加入詢價是唯一一次確認自己填了什麼的機會，給 1.5 秒；
// 送出詢價的內文只有一句、下一頁就是完整的詢價單，1 秒夠了
const alertTimer = ref(1500)

const handleSubmit = (payload: Omit<QuoteCartItem, 'id'>) => {
  addItem(payload)
  addedAlertText.value = buildAddedText(payload)
  alertTimer.value = 1500
  pendingRedirect.value = '/'
  isAddedAlertOpen.value = true
}

/**
 * 送出詢價＝加進清單後直接把使用者帶到詢價單頁。
 * 跟「加入詢價」唯一的差別就是導頁目標：一個回首頁繼續挑、一個去填聯絡資訊。
 * 原本收集的項目照樣全部留著，也照樣全部會一起送出。
 *
 * 標題沿用「已加入詢價單」——真正的送出是在詢價單頁按確認，
 * 這裡寫「已送出」會讓客戶以為結束了，結果到了詢價單頁還要再送一次。
 * 內文只講要帶他去哪、為什麼，不重複品項摘要：
 * 下一個畫面就是完整的詢價單表格，1 秒內要人掃完等於白放。
 */
const handleInstant = (payload: Omit<QuoteCartItem, 'id'>) => {
  addItem(payload, true)
  addedAlertText.value = '正在前往填寫聯絡資訊…'
  alertTimer.value = 1000
  pendingRedirect.value = '/quote-cart'
  isAddedAlertOpen.value = true
}

// 提示關掉後才導頁，讓使用者先看到結果。
// 用 watch 而不是 @timeout，這樣點背景或按 Esc 提早關掉也會跳。
//
// 不必等 UIModal 那 180ms 的關閉動畫：navigateTo 會把整頁連同 Teleport
// 一起銷毀，離場動畫本來就播不到，多等只是讓人多盯著一個靜止的視窗。
watch(isAddedAlertOpen, (isOpen, wasOpen) => {
  if (wasOpen && !isOpen) {
    navigateTo(pendingRedirect.value)
  }
})
</script>

<template>
  <div class="mx-auto w-[min(100%,1180px)] p-6 max-md:p-4">
    <UIPageHeader
    title="鋼板彎折"
    description="依序選擇彎折刀數與形狀，最後依圖面標示填寫規格與數量。"
    class="mb-4"
    />


    <ProductBendingForm
      show-instant-submit
      @submit="handleSubmit"
      @instant="handleInstant"
    />

    <UIAlert
      v-model="isAddedAlertOpen"
      title="已加入詢價單"
      :text="addedAlertText"
      icon="success"
      :show-confirm-button="false"
      :timer="alertTimer"
    />
  </div>
</template>
