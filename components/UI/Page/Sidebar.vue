<script setup lang="ts">
import { ChevronDown, ChevronRight, X } from '@lucide/vue'

const route = useRoute()
const { mainNavigation } = useAppNavigation()
const isCollapsed = useState('sidebar-collapsed', () => false)
const expandedGroups = ref<string[]>(['/UI'])
const isMobileMenuOpen = useState('sidebar-mobile-menu', () => false)
const isDesktop = ref(false)
const tooltipPosition = ref({ top: '0px', left: '0px' })
const collapsedGroupTo = ref<string | null>(null)
const collapsedSubmenuPosition = ref({
  top: '0px',
  left: '0px',
  maxHeight: 'calc(100dvh - 1rem)',
})
let desktopMediaQuery: MediaQueryList | undefined

const updateViewportMode = () => {
  isDesktop.value = desktopMediaQuery?.matches ?? false

  if (!isDesktop.value) {
    isCollapsed.value = false
  }
}

const desktopSidebarStyle = computed(() => ({
  '--sidebar-size': isCollapsed.value ? '44px' : '256px',
  '--sidebar-padding': '12px',
}))

const config = {
  eyebrow: 'WORKSPACE',
  title: '主要選單',
  items: mainNavigation,
}

const isItemActive = (to: string) => route.path === to

const isGroupActive = (item: (typeof config.items)[number]) =>
  item.children?.some((child) => isItemActive(child.to)) ?? false

const isGroupExpanded = (item: (typeof config.items)[number]) =>
  expandedGroups.value.includes(item.to)

const isCollapsedGroupOpen = (item: (typeof config.items)[number]) =>
  collapsedGroupTo.value === item.to

const toggleGroup = (to: string, event: Event) => {
  if (isCollapsed.value) {
    const target = event.currentTarget

    if (!(target instanceof HTMLElement)) {
      return
    }

    collapsedGroupTo.value = collapsedGroupTo.value === to ? null : to

    if (collapsedGroupTo.value === to) {
      const bounds = target.getBoundingClientRect()
      collapsedSubmenuPosition.value = {
        top: `${bounds.top}px`,
        left: `${bounds.right + 8}px`,
        maxHeight: `calc(100dvh - ${bounds.top}px - 1rem)`,
      }
    }

    return
  }

  expandedGroups.value = expandedGroups.value.includes(to)
    ? expandedGroups.value.filter((groupTo) => groupTo !== to)
    : [...expandedGroups.value, to]
}

const groupId = (to: string) => `sidebar-group-${to.replaceAll('/', '-')}`

const positionTooltip = (event: Event) => {
  const target = event.currentTarget

  if (!(target instanceof HTMLElement)) {
    return
  }

  const bounds = target.getBoundingClientRect()
  tooltipPosition.value = {
    top: `${bounds.top + bounds.height / 2}px`,
    left: `${bounds.right + 8}px`,
  }
}

watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false
    collapsedGroupTo.value = null
  },
)

watch(isCollapsed, (collapsed) => {
  if (!collapsed) {
    collapsedGroupTo.value = null
  }
})

onMounted(() => {
  desktopMediaQuery = window.matchMedia('(min-width: 1024px)')
  updateViewportMode()
  desktopMediaQuery.addEventListener('change', updateViewportMode)
})

onBeforeUnmount(() => {
  desktopMediaQuery?.removeEventListener('change', updateViewportMode)
})
</script>

<template>
  <button
    v-if="!isDesktop && isMobileMenuOpen"
    class="fixed inset-0 z-30 border-0 bg-black/50 p-0 lg:hidden"
    type="button"
    aria-label="關閉側邊選單"
    @click="isMobileMenuOpen = false"
  />

  <aside
    class="app-sidebar z-40 flex h-full min-w-0 shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:w-72 max-lg:bg-white max-lg:p-3 max-lg:py-2 max-sm:w-[calc(100vw-2rem)]"
    :class="
      isMobileMenuOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'
    "
    :style="desktopSidebarStyle"
    :aria-hidden="!isDesktop && !isMobileMenuOpen"
    :inert="!isDesktop && !isMobileMenuOpen"
  >
    <div
      class="w-full rounded-lg bg-white max-lg:min-h-full max-lg:rounded-none max-lg:border-0 max-lg:p-0 max-lg:shadow-none"
    >
      <div
        class="border-nurse-200 mb-3 hidden items-center justify-between border-b pb-1 max-lg:flex"
      >
        <UIPageLogo tone="dark" />
        <button
          class="text-brand-700 hover:bg-brand-50 flex size-10 items-center justify-center rounded-lg border-0 bg-transparent"
          type="button"
          aria-label="關閉側邊選單"
          title="關閉側邊選單"
          @click="isMobileMenuOpen = false"
        >
          <X :size="22" aria-hidden="true" />
        </button>
      </div>

      <nav class="flex flex-col gap-1" :aria-label="config.title">
        <template v-for="item in config.items" :key="item.to">
          <NuxtLink
            v-if="!item.children?.length"
            class="sidebar-item text-brand-700 hover:bg-brand-50 hover:text-brand-900 relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold no-underline transition-colors"
            :class="[
              isCollapsed ? 'mx-auto size-11 justify-center px-0' : '',
              isItemActive(item.to)
                ? 'bg-brand-500 hover:bg-brand-500 text-white hover:text-white'
                : '',
            ]"
            :to="item.to"
            :title="isCollapsed ? item.title : undefined"
            @mouseenter="positionTooltip"
            @focus="positionTooltip"
          >
            <span class="flex size-5 shrink-0 items-center justify-center">
              <component :is="item.icon" :size="18" aria-hidden="true" />
            </span>
            <span v-show="!isCollapsed">{{ item.title }}</span>
            <span
              v-if="isCollapsed"
              class="sidebar-tooltip"
              :style="tooltipPosition"
              aria-hidden="true"
            >
              {{ item.title }}
            </span>
          </NuxtLink>

          <div v-else>
            <button
              class="sidebar-item text-brand-700 hover:bg-brand-50 hover:text-brand-900 relative flex min-h-11 items-center gap-3 rounded-lg border-0 bg-transparent px-3 text-left text-sm font-bold transition-colors"
              :class="[
                isCollapsed ? 'mx-auto size-11 justify-center px-0' : 'w-full',
                isGroupActive(item) ? 'bg-brand-50 text-brand-900' : '',
              ]"
              type="button"
              :aria-controls="groupId(item.to)"
              :aria-expanded="
                isCollapsed ? isCollapsedGroupOpen(item) : isGroupExpanded(item)
              "
              :title="isCollapsed ? item.title : undefined"
              @click="toggleGroup(item.to, $event)"
              @mouseenter="positionTooltip"
              @focus="positionTooltip"
            >
              <span class="flex size-5 shrink-0 items-center justify-center">
                <component :is="item.icon" :size="18" aria-hidden="true" />
              </span>
              <span v-show="!isCollapsed">{{ item.title }}</span>
              <ChevronDown
                v-show="!isCollapsed"
                class="ml-auto shrink-0 transition-transform duration-200"
                :class="isGroupExpanded(item) ? '' : '-rotate-90'"
                :size="18"
                aria-hidden="true"
              />
              <span
                v-if="isCollapsed"
                class="sidebar-tooltip"
                :style="tooltipPosition"
                aria-hidden="true"
              >
                {{ item.title }}
              </span>
            </button>

            <div
              v-show="isGroupExpanded(item) && !isCollapsed"
              :id="!isCollapsed ? groupId(item.to) : undefined"
              class="border-nurse-200 mt-1 ml-5 flex flex-col gap-1 border-l pl-2"
            >
              <NuxtLink
                v-for="child in item.children"
                :key="child.to"
                class="text-brand-700 hover:bg-brand-50 hover:text-brand-900 flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium no-underline transition-colors"
                :class="
                  isItemActive(child.to)
                    ? 'bg-brand-500 hover:bg-brand-500 text-white hover:text-white'
                    : ''
                "
                :to="child.to"
              >
                <ChevronRight :size="15" aria-hidden="true" />
                <span>{{ child.title }}</span>
              </NuxtLink>
            </div>

            <Teleport to="body">
              <nav
                v-if="isCollapsed && isCollapsedGroupOpen(item)"
                :id="groupId(item.to)"
                class="sidebar-submenu-flyout"
                :style="collapsedSubmenuPosition"
                :aria-label="item.title"
              >
                <NuxtLink
                  v-for="child in item.children"
                  :key="child.to"
                  class="text-brand-700 hover:bg-brand-50 hover:text-brand-900 flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium no-underline transition-colors"
                  :class="
                    isItemActive(child.to)
                      ? 'bg-brand-500 hover:bg-brand-500 text-white hover:text-white'
                      : ''
                  "
                  :to="child.to"
                  @click="collapsedGroupTo = null"
                >
                  <ChevronRight :size="15" aria-hidden="true" />
                  <span>{{ child.title }}</span>
                </NuxtLink>
              </nav>
            </Teleport>
          </div>
        </template>
      </nav>
    </div>
  </aside>
</template>

<style>
.sidebar-tooltip {
  position: fixed;
  z-index: 50;
  width: max-content;
  max-width: 14rem;
  transform: translateY(-50%);
  border-radius: 0.375rem;
  background: var(--color-brand-900);
  padding: 0.375rem 0.625rem;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.25;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  white-space: nowrap;
}

.sidebar-submenu-flyout {
  position: fixed;
  z-index: 50;
  display: flex;
  width: 14rem;
  overflow-y: auto;
  overscroll-behavior: contain;
  flex-direction: column;
  gap: 0.25rem;
  border: 1px solid var(--color-nurse-200);
  border-radius: 0.5rem;
  background: white;
  padding: 0.5rem;
  box-shadow: 0 12px 24px rgb(10 19 13 / 16%);
}

@media (min-width: 1024px) {
  .sidebar-item:hover .sidebar-tooltip,
  .sidebar-item:focus-visible .sidebar-tooltip {
    opacity: 1;
    visibility: visible;
  }
}

@media (max-width: 1023px) {
  .app-sidebar {
    transition: none !important;
  }
}

@media (min-width: 1024px) {
  .app-sidebar {
    width: calc(
      var(--sidebar-size) + var(--sidebar-padding) + var(--sidebar-padding)
    ) !important;
    flex-basis: calc(
      var(--sidebar-size) + var(--sidebar-padding) + var(--sidebar-padding)
    ) !important;
    padding: var(--sidebar-padding) !important;
  }
}
</style>
