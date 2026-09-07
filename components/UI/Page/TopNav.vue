<script setup lang="ts">
import { ClipboardList } from '@lucide/vue'

const { count: cartCount } = useQuoteCart()

// 數量增加時整顆按鈕閃一下，把使用者的視線帶到右上角。
// 加入的當下畫面還蓋著「已加入詢價單」提示，這時候播會被錯過，
// 所以等提示關掉、跳頁完成之後才觸發。
const isCartHighlighted = ref(false)
let highlightTimer: ReturnType<typeof setTimeout> | undefined

watch(cartCount, (next, previous) => {
  if (next <= previous) {
    return
  }

  clearTimeout(highlightTimer)
  isCartHighlighted.value = false

  highlightTimer = setTimeout(() => {
    isCartHighlighted.value = true
    highlightTimer = setTimeout(() => {
      isCartHighlighted.value = false
    }, 700)
  }, 1700)
})

onBeforeUnmount(() => clearTimeout(highlightTimer))
</script>

<template>
  <header
    class="border-brand-800 bg-brand-600 sticky top-0 z-20 flex min-h-12 items-center justify-between border-b px-3 py-2 text-lg font-bold text-white max-sm:px-3"
  >
    <div class="flex min-w-0 items-center gap-2">
      <UIPageLogo />
    </div>
    <nav class="flex items-center gap-2" aria-label="主要導覽">
      <NuxtLink
        to="/quote-cart"
        class="hover:text-brand-600 flex min-h-9 shrink-0 items-center gap-[5px] rounded-full border border-white/75 bg-transparent px-3 py-[7px] text-sm font-bold text-white no-underline transition-[color,background-color] duration-[160ms] hover:bg-white"
        :class="{ 'cart-link-flash': isCartHighlighted }"
        :aria-label="`詢價單，目前 ${cartCount} 項`"
      >
        <ClipboardList :size="18" :stroke-width="2.5" aria-hidden="true" />
        <span class="max-sm:hidden">詢價單</span>
        <!-- key 綁數字，讓每次加減都重新播一次彈跳動畫 -->
        <Transition name="cart-badge" mode="out-in">
          <span
            v-if="cartCount"
            :key="cartCount"
            class="text-brand-700 grid min-w-5 place-items-center rounded-full bg-white px-1.5 text-xs leading-5"
            aria-hidden="true"
          >
            {{ cartCount }}
          </span>
        </Transition>
      </NuxtLink>
    </nav>
  </header>
</template>

<style scoped lang="scss">
.cart-badge-enter-active {
  animation: cart-badge-pop 420ms cubic-bezier(0.2, 0.8, 0.2, 1.15) both;
}

.cart-badge-leave-active {
  transition:
    opacity 140ms ease,
    transform 140ms ease;
}

.cart-badge-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

/* 整顆按鈕轉白 + 放大，比只有徽章跳動更容易被餘光注意到 */
.cart-link-flash {
  animation: cart-link-flash 700ms ease-out both;
}

@keyframes cart-link-flash {
  0% {
    transform: scale(1);
  }

  30% {
    background-color: #fff;
    border-color: #fff;
    color: var(--color-brand-700);
    transform: scale(1.12);
  }

  60% {
    background-color: #fff;
    border-color: #fff;
    color: var(--color-brand-700);
    transform: scale(1);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes cart-badge-pop {
  from {
    transform: scale(0.45);
    opacity: 0;
  }

  70% {
    transform: scale(1.25);
    opacity: 1;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cart-badge-enter-active,
  .cart-badge-leave-active,
  .cart-link-flash {
    animation: none;
    transition: none;
  }
}
</style>
