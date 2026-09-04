<script setup lang="ts">
import type { FormControlSize } from '../../../composables/useFormControlStyles'

type OverflowItem = {
  element: HTMLElement
  index: number
  text: string
  icon: string
  iconPosition: 'left' | 'right'
  isDanger: boolean
}

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(
  defineProps<{
    size?: FormControlSize
    gap?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }>(),
  {
    size: 'md',
    gap: 8,
    sm: Number.MAX_SAFE_INTEGER,
    md: Number.MAX_SAFE_INTEGER,
    lg: Number.MAX_SAFE_INTEGER,
    xl: Number.MAX_SAFE_INTEGER,
  },
)

const rootRef = ref<HTMLElement | null>(null)
const actionsRef = ref<HTMLElement | null>(null)
const menuTriggerRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const overflowItems = ref<OverflowItem[]>([])
const menuId = useId()
const menuPosition = ref({ top: 0, left: 0 })

const visibleActionCounts = computed<Record<Breakpoint, number>>(() => {
  const normalizeCount = (count: number) => Math.max(0, Math.floor(count))

  return {
    sm: normalizeCount(props.sm),
    md: normalizeCount(props.md),
    lg: normalizeCount(props.lg),
    xl: normalizeCount(props.xl),
  }
})

const hasOverflow = computed(() =>
  (Object.keys(visibleActionCounts.value) as Breakpoint[]).some(
    (breakpoint) =>
      overflowItems.value.length > visibleActionCounts.value[breakpoint],
  ),
)

const menuButtonSizeClasses: Record<FormControlSize, string> = {
  sm: 'size-9',
  md: 'size-11',
  lg: 'size-13',
}

const configureActions = () => {
  const actions = actionsRef.value
  if (!actions) return

  const elements = Array.from(actions.children).filter(
    (element): element is HTMLElement => element instanceof HTMLElement,
  )

  overflowItems.value = elements.map((element, index) => {
    element.style.display = ''
    element.style.flexShrink = '0'
    ;(Object.keys(visibleActionCounts.value) as Breakpoint[]).forEach(
      (breakpoint) => {
        element.dataset[
          `buttonGroup${breakpoint[0].toUpperCase()}${breakpoint.slice(1)}Visible`
        ] = String(index < visibleActionCounts.value[breakpoint])
      },
    )

    return {
      element,
      index,
      text:
        element.getAttribute('aria-label') ||
        element.textContent?.trim() ||
        '未命名操作',
      icon: element.dataset.buttonIcon || '',
      iconPosition:
        element.dataset.buttonIconPosition === 'right' ? 'right' : 'left',
      isDanger: Array.from(element.classList).some(
        (className) =>
          className.startsWith('border-danger-') ||
          className.startsWith('bg-danger-') ||
          className.startsWith('text-danger-'),
      ),
    }
  })
  isOpen.value = false
}

const updateMenuPosition = () => {
  const trigger = menuTriggerRef.value
  if (!trigger) return

  const triggerRect = trigger.getBoundingClientRect()
  const menuWidth = 176
  const menuHeight = Math.min(
    menuRef.value?.getBoundingClientRect().height || 0,
    window.innerHeight - 16,
  )
  const left = Math.min(
    Math.max(8, triggerRect.right - menuWidth),
    window.innerWidth - menuWidth - 8,
  )
  const top =
    triggerRect.bottom + 8 + menuHeight <= window.innerHeight
      ? triggerRect.bottom + 8
      : Math.max(8, triggerRect.top - menuHeight - 8)

  menuPosition.value = { top, left }
}

const toggleMenu = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) await nextTick(updateMenuPosition)
}

const handleOverflowItemClick = (item: OverflowItem) => {
  item.element.click()
  isOpen.value = false
}

const handlePointerDown = (event: PointerEvent) => {
  const target = event.target as Node
  if (!rootRef.value?.contains(target) && !menuRef.value?.contains(target)) {
    isOpen.value = false
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') isOpen.value = false
}

watch(
  () => [props.sm, props.md, props.lg, props.xl],
  () => nextTick(configureActions),
)

onMounted(async () => {
  await nextTick()
  configureActions()
  document.addEventListener('pointerdown', handlePointerDown)
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('scroll', updateMenuPosition, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handlePointerDown)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('scroll', updateMenuPosition, true)
})
</script>

<template>
  <div
    ref="rootRef"
    class="relative flex min-w-0 flex-nowrap items-center"
    :style="{ gap: `${Math.max(0, gap)}px` }"
  >
    <div ref="actionsRef" class="button-group-actions contents">
      <slot />
    </div>

    <div
      v-if="hasOverflow"
      ref="menuTriggerRef"
      class="button-group-trigger shrink-0"
      :data-button-group-sm-overflow="
        overflowItems.length > visibleActionCounts.sm
      "
      :data-button-group-md-overflow="
        overflowItems.length > visibleActionCounts.md
      "
      :data-button-group-lg-overflow="
        overflowItems.length > visibleActionCounts.lg
      "
      :data-button-group-xl-overflow="
        overflowItems.length > visibleActionCounts.xl
      "
    >
      <button
        class="border-nurse-300 text-brand-700 hover:bg-brand-50 focus:ring-brand-500/45 grid shrink-0 place-items-center rounded-lg border bg-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
        :class="menuButtonSizeClasses[size]"
        type="button"
        :aria-controls="menuId"
        :aria-expanded="isOpen"
        aria-haspopup="menu"
        aria-label="更多操作"
        @click="toggleMenu"
      >
        <UIIcon name="MoreVertical" :size="size === 'sm' ? 18 : 20" />
      </button>
    </div>

    <Teleport to="body">
      <Transition name="button-group-menu">
        <div
          v-if="isOpen"
          ref="menuRef"
          :id="menuId"
          class="border-nurse-200 fixed z-50 grid max-h-[calc(100vh-16px)] w-44 overflow-y-auto rounded-xl border bg-white p-1.5 shadow-[0_12px_30px_rgba(10,19,13,0.18)]"
          :style="{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }"
          role="menu"
        >
          <button
            v-for="item in overflowItems"
            :key="item.index"
            class="button-group-menu-item inline-flex w-full items-center gap-2 rounded-lg border-0 bg-transparent px-3 py-2.5 text-left text-sm font-medium focus-visible:outline-0"
            :class="
              item.isDanger
                ? 'text-danger-600 hover:bg-danger-50 hover:text-danger-700 focus-visible:bg-danger-50 focus-visible:text-danger-700'
                : 'text-brand-800 hover:bg-brand-50 hover:text-brand-700 focus-visible:bg-brand-50 focus-visible:text-brand-700'
            "
            :data-button-group-sm-visible="item.index >= visibleActionCounts.sm"
            :data-button-group-md-visible="item.index >= visibleActionCounts.md"
            :data-button-group-lg-visible="item.index >= visibleActionCounts.lg"
            :data-button-group-xl-visible="item.index >= visibleActionCounts.xl"
            type="button"
            role="menuitem"
            @click="handleOverflowItemClick(item)"
          >
            <template v-if="item.iconPosition === 'left'">
              <UIIcon v-if="item.icon" :name="item.icon" :size="16" />
              <span class="min-w-0 flex-1 truncate">{{ item.text }}</span>
            </template>
            <template v-else>
              <span class="min-w-0 flex-1 truncate">{{ item.text }}</span>
              <UIIcon v-if="item.icon" :name="item.icon" :size="16" />
            </template>
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.button-group-menu-enter-active,
.button-group-menu-leave-active {
  transition:
    opacity 140ms ease,
    transform 140ms ease;
}

.button-group-menu-enter-from,
.button-group-menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 47.999rem) {
  .button-group-actions > :deep([data-button-group-sm-visible='false']),
  .button-group-trigger[data-button-group-sm-overflow='false'],
  .button-group-menu-item[data-button-group-sm-visible='false'] {
    display: none;
  }
}

@media (min-width: 48rem) and (max-width: 63.999rem) {
  .button-group-actions > :deep([data-button-group-md-visible='false']),
  .button-group-trigger[data-button-group-md-overflow='false'],
  .button-group-menu-item[data-button-group-md-visible='false'] {
    display: none;
  }
}

@media (min-width: 64rem) and (max-width: 79.999rem) {
  .button-group-actions > :deep([data-button-group-lg-visible='false']),
  .button-group-trigger[data-button-group-lg-overflow='false'],
  .button-group-menu-item[data-button-group-lg-visible='false'] {
    display: none;
  }
}

@media (min-width: 80rem) {
  .button-group-actions > :deep([data-button-group-xl-visible='false']),
  .button-group-trigger[data-button-group-xl-overflow='false'],
  .button-group-menu-item[data-button-group-xl-visible='false'] {
    display: none;
  }
}
</style>
