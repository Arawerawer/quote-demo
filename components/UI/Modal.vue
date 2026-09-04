<script setup lang="ts">
import { X } from '@lucide/vue'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'

const model = defineModel<boolean>({ default: false })
const props = withDefaults(
  defineProps<{
    title: string
    size?: ModalSize
    closeOnBackdrop?: boolean
    closeOnEscape?: boolean
    showHeader?: boolean
    showClose?: boolean
  }>(),
  {
    size: 'md',
    closeOnBackdrop: true,
    closeOnEscape: true,
    showHeader: true,
    showClose: true,
  },
)

const panel = useTemplateRef<HTMLElement>('panel')
let rootOverflow = ''
let isScrollLocked = false

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
  fullscreen: 'h-[calc(100dvh-2.5rem)] max-w-none',
}

const close = () => {
  model.value = false
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || !model.value) return

  event.preventDefault()
  event.stopPropagation()
  if (props.closeOnEscape) close()
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) close()
}

const setScrollLock = (isOpen: boolean) => {
  if (!import.meta.client) return

  const root = document.documentElement

  if (isOpen && !isScrollLocked) {
    rootOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    isScrollLocked = true
  } else if (!isOpen && isScrollLocked) {
    root.style.overflow = rootOverflow
    isScrollLocked = false
  }
}

watch(
  model,
  async (isOpen) => {
    setScrollLock(isOpen)
    if (isOpen) {
      await nextTick()
      panel.value?.focus()
    }
  },
  { immediate: true },
)

onMounted(() => window.addEventListener('keydown', handleKeydown, true))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown, true)
  setScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="model"
        class="modal fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[rgba(10,19,13,0.58)] p-5 backdrop-blur-sm"
        role="presentation"
        @click.self="handleBackdropClick"
      >
        <section
          ref="panel"
          class="modal__panel flex max-h-[calc(100dvh-2.5rem)] w-full flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_20px_60px_rgba(10,19,13,0.24)] outline-none"
          :class="sizeClasses[props.size]"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          tabindex="-1"
        >
          <header
            v-if="showHeader"
            class="flex shrink-0 items-center justify-between gap-4 px-5 pt-5 pb-3.5"
          >
            <h2 class="m-0 text-xl font-bold">{{ title }}</h2>
            <button
              v-if="showClose"
              class="bg-nurse-50 text-brand-700 hover:bg-nurse-100 grid size-9 shrink-0 place-items-center rounded-full border-0 p-0"
              type="button"
              aria-label="關閉視窗"
              @click="close"
            >
              <X :size="22" aria-hidden="true" />
            </button>
          </header>
          <div
            class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6"
            :class="showHeader ? 'pt-1.5' : 'pt-6'"
          >
            <slot />
          </div>
          <div v-if="$slots['before-footer']" class="shrink-0">
            <slot name="before-footer" />
          </div>
          <footer
            v-if="$slots.footer"
            class="border-nurse-200 flex shrink-0 flex-wrap items-center justify-center gap-3 border-t px-5 py-4"
          >
            <slot name="footer" />
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-enter-active,
.modal-leave-active {
  transition: opacity 180ms ease;

  .modal__panel {
    transition: transform 180ms ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal__panel {
    transform: translateY(12px) scale(0.98);
  }
}
</style>
