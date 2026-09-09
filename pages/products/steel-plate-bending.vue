<script setup lang="ts">
import { buildAddedText, type QuoteCartItem } from '~/composables/useQuoteCart'

// 填寫流程整段在 components/Product/BendingForm.vue，
// 這頁只負責標題、把結果收進詢價單、以及加入後的提示與導頁。
// 抽出去是為了讓詢價單的「修改」彈窗能共用同一套流程。
const { addItem, selectOnly } = useQuoteCart()

// 加入成功的提示，1.5 秒自動關；不放確認鈕才不會擋住接著填下一筆
const isAddedAlertOpen = ref(false)
const addedAlertText = ref('')

const handleSubmit = (payload: Omit<QuoteCartItem, 'id'>) => {
  addItem(payload)
  addedAlertText.value = buildAddedText(payload)
  isAddedAlertOpen.value = true
}

// 送出詢價＝加進清單並「只勾這一項」，比照購物網站的「直接購買」：
// 商品照樣進購物車，只是幫使用者先勾好，原本收集的項目都還在（沒打勾）。
// 不跳「已加入」提示，直接帶到詢價單頁填聯絡資訊
const handleInstant = (payload: Omit<QuoteCartItem, 'id'>) => {
  selectOnly(addItem(payload))
  navigateTo('/quote-cart')
}

// 提示關掉後才跳首頁，讓使用者先看到加了什麼。
// 用 watch 而不是 @timeout，這樣點背景或按 Esc 提早關掉也會跳。
watch(isAddedAlertOpen, (isOpen, wasOpen) => {
  if (wasOpen && !isOpen) {
    navigateTo('/')
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
      :timer="1500"
    />
  </div>
</template>
