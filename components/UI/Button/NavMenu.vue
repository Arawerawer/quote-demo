<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import type { Component } from 'vue'

export interface NavMenuItem {
  text: string
  onClick: () => void | Promise<void>
  isRed?: boolean
}

export interface NavMenuConfig {
  items: NavMenuItem[]
}

const props = withDefaults(
  defineProps<{
    text: string
    icon?: Component
    onClick?: () => void | Promise<void>
    hasDropdown?: boolean
    dropdown?: NavMenuConfig
  }>(),
  {
    icon: undefined,
    onClick: undefined,
    hasDropdown: false,
    dropdown: undefined,
  },
)

const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const menuId = useId()

const handleClick = () => {
  void props.onClick?.()

  if (props.hasDropdown) {
    isOpen.value = !isOpen.value
  }
}

const handleItemClick = async (item: NavMenuItem) => {
  isOpen.value = false
  await item.onClick()
}

const handlePointerDown = (event: PointerEvent) => {
  if (!rootRef.value?.contains(event.target as Node)) {
    isOpen.value = false
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') isOpen.value = false
}

onMounted(() => {
  document.addEventListener('pointerdown', handlePointerDown)
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handlePointerDown)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div ref="rootRef" class="relative">
    <button
      class="hover:text-brand-600 aria-expanded:text-brand-600 flex min-h-9 max-w-35 items-center gap-[5px] rounded-full border border-white/75 bg-transparent px-3 py-[7px] text-sm font-bold text-white transition-[color,background-color] duration-[160ms] hover:bg-white aria-expanded:bg-white"
      type="button"
      :aria-controls="hasDropdown ? menuId : undefined"
      :aria-expanded="hasDropdown ? isOpen : undefined"
      :aria-haspopup="hasDropdown ? 'menu' : undefined"
      @click="handleClick"
    >
      <component
        :is="icon"
        v-if="icon"
        :size="18"
        :stroke-width="2.5"
        aria-hidden="true"
      />
      <span class="overflow-hidden text-ellipsis whitespace-nowrap">{{
        text
      }}</span>
      <ChevronDown
        v-if="hasDropdown"
        class="shrink-0 transition-transform duration-[160ms]"
        :class="isOpen ? 'rotate-180' : ''"
        :size="16"
        :stroke-width="2.5"
        aria-hidden="true"
      />
    </button>

    <Transition name="nav-menu">
      <div
        v-if="hasDropdown && isOpen"
        :id="menuId"
        class="border-nurse-200 absolute top-[calc(100%+8px)] right-0 z-[1] grid w-40 overflow-hidden rounded-xl border bg-white p-1.5 shadow-[0_12px_30px_rgba(10,19,13,0.18)]"
        role="menu"
      >
        <button
          v-for="item in dropdown?.items ?? []"
          :key="item.text"
          type="button"
          role="menuitem"
          class="w-full rounded-lg border-0 bg-transparent px-3 py-2.5 text-left text-sm font-medium focus-visible:outline-0"
          :class="
            item.isRed
              ? 'text-rose-600 hover:bg-rose-50 hover:text-rose-500 focus-visible:bg-rose-50 focus-visible:text-rose-500'
              : 'text-brand-800 hover:bg-brand-50 hover:text-brand-700 focus-visible:bg-brand-50 focus-visible:text-brand-700'
          "
          @click="handleItemClick(item)"
        >
          {{ item.text }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.nav-menu-enter-active,
.nav-menu-leave-active {
  transition:
    opacity 140ms ease,
    transform 140ms ease;
}

.nav-menu-enter-from,
.nav-menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
