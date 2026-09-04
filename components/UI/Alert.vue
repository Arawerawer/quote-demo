<script setup lang="ts">
import { Check, CircleHelp, Info, TriangleAlert, X } from '@lucide/vue'
import type { Component } from 'vue'

type AlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question'

const model = defineModel<boolean>({ default: false })
const props = withDefaults(
  defineProps<{
    title: string
    text?: string
    html?: string
    icon?: AlertIcon
    confirmText?: string
    cancelText?: string
    showConfirmButton?: boolean
    showCancelButton?: boolean
    closeOnBackdrop?: boolean
    closeOnEscape?: boolean
    timer?: number
  }>(),
  {
    text: '',
    html: '',
    icon: 'info',
    confirmText: '確認',
    cancelText: '取消',
    showConfirmButton: true,
    showCancelButton: false,
    closeOnBackdrop: true,
    closeOnEscape: true,
    timer: 0,
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
  timeout: []
}>()

let closeTimer: ReturnType<typeof setTimeout> | undefined

const iconComponents: Record<AlertIcon, Component> = {
  success: Check,
  error: X,
  warning: TriangleAlert,
  info: Info,
  question: CircleHelp,
}

const iconClasses: Record<AlertIcon, string> = {
  success: 'bg-brand-300/20 text-brand-600',
  error: 'bg-danger-300/20 text-danger-600',
  warning: 'bg-amber-300/20 text-amber-600',
  info: 'bg-sky-300/20 text-sky-600',
  question: 'bg-violet-300/20 text-violet-600',
}

const progressClasses: Record<AlertIcon, string> = {
  success: 'bg-brand-400',
  error: 'bg-danger-400',
  warning: 'bg-amber-400',
  info: 'bg-sky-400',
  question: 'bg-violet-400',
}

const slots = useSlots()
const hasFooter = computed(() =>
  Boolean(slots.footer || props.showConfirmButton || props.showCancelButton),
)

const confirm = () => {
  emit('confirm')
  model.value = false
}

const cancel = () => {
  emit('cancel')
  model.value = false
}

const clearCloseTimer = () => {
  if (!closeTimer) return
  clearTimeout(closeTimer)
  closeTimer = undefined
}

const startCloseTimer = () => {
  clearCloseTimer()
  if (!import.meta.client || !model.value || props.timer <= 0) return

  closeTimer = setTimeout(() => {
    closeTimer = undefined
    model.value = false
    emit('timeout')
  }, props.timer)
}

watch([model, () => props.timer], startCloseTimer, { immediate: true })
onBeforeUnmount(clearCloseTimer)
</script>

<template>
  <UIModal
    v-model="model"
    :title="title"
    size="sm"
    :close-on-backdrop="closeOnBackdrop"
    :close-on-escape="closeOnEscape"
    :show-header="false"
  >
    <div class="text-center">
      <div
        class="alert-icon mx-auto mb-5 grid size-20 place-items-center rounded-full"
        :class="iconClasses[props.icon]"
      >
        <component
          :is="iconComponents[props.icon]"
          :size="48"
          :stroke-width="2.5"
          aria-hidden="true"
        />
      </div>

      <h2 class="text-brand-900 m-0 text-2xl leading-[1.4] font-bold">
        {{ title }}
      </h2>

      <!-- html 僅能傳入應用程式信任或已清理過的內容。 -->
      <div
        v-if="html"
        class="alert-content text-brand-700 mt-3 text-sm leading-[1.7]"
        v-html="html"
      />

      <!-- 文字 -->
      <p
        v-else-if="text"
        class="text-brand-700 mt-3 mb-0 text-sm leading-[1.7] whitespace-pre-wrap"
      >
        {{ text }}
      </p>
    </div>
    <!-- 倒數進度條 -->
    <template v-if="timer > 0" #before-footer>
      <div
        class="bg-nurse-50 border-nurse-200 h-2 overflow-hidden border-t"
        aria-hidden="true"
      >
        <span
          class="alert-timer-progress block h-full w-full origin-left"
          :class="progressClasses[props.icon]"
          :style="{ animationDuration: `${timer}ms` }"
        />
      </div>
    </template>
    <template v-if="hasFooter" #footer>
      <slot name="footer" :confirm="confirm" :cancel="cancel">
        <UIFormButton
          v-if="showCancelButton"
          variant="outline"
          @click="cancel"
          >{{ cancelText }}</UIFormButton
        >
        <UIFormButton
          v-if="showConfirmButton"
          :variant="icon === 'error' ? 'danger' : 'primary'"
          @click="confirm"
          >{{ confirmText }}</UIFormButton
        >
      </slot>
    </template>
  </UIModal>
</template>

<style scoped lang="scss">
.alert-icon {
  animation: alert-icon-enter 420ms cubic-bezier(0.2, 0.8, 0.2, 1.15) both;
}

.alert-timer-progress {
  animation-name: alert-timer-countdown;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.alert-content :deep(p) {
  margin: 0;
}

.alert-content :deep(code) {
  padding: 2px 6px;
  border-radius: 6px;
  color: var(--color-rose-700);
  background: var(--color-rose-50);
  font-size: 0.875em;
}

@keyframes alert-icon-enter {
  from {
    transform: scale(0.45) rotate(-10deg);
    opacity: 0;
  }

  70% {
    transform: scale(1.08) rotate(2deg);
    opacity: 1;
  }

  to {
    transform: scale(1) rotate(0);
    opacity: 1;
  }
}

@keyframes alert-timer-countdown {
  from {
    transform: scaleX(1);
  }

  to {
    transform: scaleX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .alert-icon {
    animation: none;
  }

  .alert-timer-progress {
    animation-timing-function: steps(10, end);
  }
}
</style>
