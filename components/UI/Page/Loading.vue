<script setup lang="ts">
import { LoaderCircle } from '@lucide/vue'

defineProps<{ visible: boolean }>()
</script>

<template>
  <Transition name="loading">
    <div
      v-if="visible"
      class="page-loading pointer-events-none fixed bottom-[10%] left-1/2 z-[100] w-fit rounded-[666px] border border-[#00000022] bg-[#00000099] py-3 pr-5 pl-4 text-white shadow-[0_0_4px_#00000066]"
      role="status"
      aria-live="polite"
    >
      <span
        class="flex h-full items-center justify-center gap-2 text-base font-bold"
      >
        <LoaderCircle
          class="page-loading__icon"
          :size="24"
          :stroke-width="3"
          aria-hidden="true"
        />
        載入中...
      </span>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.page-loading {
  transform: translate(-50%, 0);

  &__icon {
    animation: loading-spin 900ms linear infinite;
  }
}

@keyframes loading-spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-enter-active,
.loading-leave-active {
  transition:
    opacity 240ms ease,
    transform 240ms ease;
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
  transform: translate(-50%, 16px);
}
</style>
