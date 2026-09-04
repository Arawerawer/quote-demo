<script setup lang="ts">
import { Check, ChevronDown, Search, X } from '@lucide/vue'
import type {
  FormControlSize,
  FormControlStatus,
} from '../../../composables/useFormControlStyles'

export interface FormMultiSelectOption {
  label: string
  value: string | number
  disabled?: boolean
  description?: string
}

type SelectValue = string | number
type MenuPlacement = 'bottom-start' | 'top-start'

const model = defineModel<SelectValue[]>({ default: () => [] })

const props = withDefaults(
  defineProps<{
    options: FormMultiSelectOption[]
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
    noResultsText?: string
    required?: boolean
    disabled?: boolean
    warning?: boolean
    status?: FormControlStatus
    size?: FormControlSize
    searchable?: boolean
    clearable?: boolean
    closeOnSelect?: boolean
    teleport?: boolean
    placement?: MenuPlacement
    maxMenuHeight?: number
    maxTagCount?: number
    editable?: boolean
    allowCustomValue?: boolean
  }>(),
  {
    placeholder: '請選擇',
    searchPlaceholder: '搜尋選項',
    emptyText: '目前沒有選項',
    noResultsText: '找不到符合的選項',
    required: false,
    disabled: false,
    warning: false,
    status: 'default',
    size: 'md',
    searchable: true,
    clearable: true,
    closeOnSelect: false,
    teleport: true,
    placement: 'bottom-start',
    maxMenuHeight: 280,
    maxTagCount: 0,
    editable: false,
    allowCustomValue: false,
  },
)

const isOpen = ref(false)
const query = ref('')
const rootElement = ref<HTMLElement>()
const menuElement = ref<HTMLElement>()
const searchInput = ref<HTMLInputElement>()
const menuPosition = ref<Record<string, string>>({})
const customOptions = ref<FormMultiSelectOption[]>([])

const controlStatus = computed<FormControlStatus>(() =>
  props.warning ? 'error' : props.status,
)

const allOptions = computed(() => [...props.options, ...customOptions.value])

const selectedOptions = computed(() =>
  model.value.map(
    (value) =>
      allOptions.value.find((option) => option.value === value) ?? {
        label: String(value),
        value,
      },
  ),
)

const visibleOptions = computed(() => {
  const normalizedQuery = query.value.trim().toLocaleLowerCase()

  if (!normalizedQuery) return allOptions.value

  return allOptions.value.filter((option) =>
    `${option.label} ${option.description ?? ''}`
      .toLocaleLowerCase()
      .includes(normalizedQuery),
  )
})

const canCreateOption = computed(() => {
  const normalizedQuery = query.value.trim().toLocaleLowerCase()

  return (
    props.editable &&
    props.allowCustomValue &&
    Boolean(normalizedQuery) &&
    !allOptions.value.some(
      (option) =>
        option.label.toLocaleLowerCase() === normalizedQuery ||
        String(option.value).toLocaleLowerCase() === normalizedQuery,
    )
  )
})

const visibleTags = computed(() => {
  if (props.maxTagCount < 1) return selectedOptions.value
  return selectedOptions.value.slice(0, props.maxTagCount)
})

const showsAllTags = computed(() => props.maxTagCount < 1)

const hiddenTagCount = computed(
  () => selectedOptions.value.length - visibleTags.value.length,
)

const menuClasses = computed(() => [
  'z-50 flex flex-col overflow-hidden rounded-lg border border-nurse-200 bg-white shadow-[0_12px_28px_rgba(0,29,69,0.16)]',
  props.teleport ? 'fixed' : 'absolute top-[calc(100%+6px)] left-0 w-full',
])

const menuStyle = computed(() => ({
  maxHeight: `${props.maxMenuHeight}px`,
  ...menuPosition.value,
}))

function isSelected(value: SelectValue) {
  return model.value.includes(value)
}

function updateMenuPosition() {
  if (!props.teleport || !rootElement.value) return

  const rect = rootElement.value.getBoundingClientRect()
  const viewportPadding = 12
  const availableBelow = window.innerHeight - rect.bottom - viewportPadding
  const availableAbove = rect.top - viewportPadding
  const opensAbove =
    props.placement === 'top-start' ||
    (availableBelow < Math.min(props.maxMenuHeight, 160) &&
      availableAbove > availableBelow)
  const menuHeight = Math.min(
    props.maxMenuHeight,
    opensAbove ? availableAbove : availableBelow,
  )

  menuPosition.value = {
    left: `${Math.max(viewportPadding, rect.left)}px`,
    width: `${Math.min(rect.width, window.innerWidth - viewportPadding * 2)}px`,
    maxHeight: `${Math.max(120, menuHeight)}px`,
    ...(opensAbove
      ? { bottom: `${window.innerHeight - rect.top + 6}px` }
      : { top: `${rect.bottom + 6}px` }),
  }
}

function openMenu() {
  if (props.disabled) return

  isOpen.value = true
  nextTick(() => {
    updateMenuPosition()
    searchInput.value?.focus()
  })
}

function closeMenu() {
  isOpen.value = false
  query.value = ''
}

function toggleMenu() {
  if (isOpen.value) closeMenu()
  else openMenu()
}

function toggleOption(option: FormMultiSelectOption) {
  if (option.disabled) return

  model.value = isSelected(option.value)
    ? model.value.filter((value) => value !== option.value)
    : [...model.value, option.value]

  if (props.closeOnSelect) closeMenu()
}

function createCustomOption() {
  const value = query.value.trim()
  if (!value || !canCreateOption.value) return

  const option = { label: value, value }
  customOptions.value = [...customOptions.value, option]
  model.value = [...model.value, value]
  query.value = ''
}

function removeOption(value: SelectValue) {
  if (props.disabled) return

  model.value = model.value.filter((selectedValue) => selectedValue !== value)
}

function clearSelection() {
  model.value = []
}

function handleDocumentPointerDown(event: PointerEvent) {
  const target = event.target as Node
  if (
    !rootElement.value?.contains(target) &&
    !menuElement.value?.contains(target)
  ) {
    closeMenu()
  }
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeMenu()
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openMenu()
  }
}

function handleEditableInput() {
  if (query.value || !isOpen.value) openMenu()
}

function handleEditableKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeMenu()
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    if (canCreateOption.value) createCustomOption()
    else if (visibleOptions.value[0]) toggleOption(visibleOptions.value[0])
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown)
  window.addEventListener('resize', updateMenuPosition)
  window.addEventListener('scroll', updateMenuPosition, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  window.removeEventListener('resize', updateMenuPosition)
  window.removeEventListener('scroll', updateMenuPosition, true)
})
</script>

<template>
  <span ref="rootElement" class="form-multiselect relative block">
    <div
      class="relative flex w-full items-center pr-9 text-left"
      :class="[
        useFormControlStyles(size, controlStatus),
        isOpen ? 'border-brand-500 ring-brand-50 ring-2' : '',
        showsAllTags && selectedOptions.length ? 'h-auto min-h-11 py-1.5' : '',
        editable
          ? 'h-auto min-h-11 flex-wrap content-center gap-1 py-1.5'
          : 'gap-2',
        disabled ? 'bg-nurse-100 text-nurse-500 cursor-not-allowed' : '',
      ]"
      role="combobox"
      :tabindex="disabled ? -1 : 0"
      :aria-expanded="isOpen"
      :aria-disabled="disabled || undefined"
      aria-haspopup="listbox"
      @click="toggleMenu"
      @keydown="handleTriggerKeydown"
    >
      <span
        v-if="!selectedOptions.length && !editable"
        class="text-nurse-300 truncate"
        >{{ placeholder }}</span
      >
      <span
        v-if="selectedOptions.length"
        :class="
          editable
            ? 'contents'
            : [
                'flex min-w-0 flex-1 items-center gap-1',
                showsAllTags ? 'flex-wrap' : 'overflow-hidden',
              ]
        "
      >
        <span
          v-for="option in visibleTags"
          :key="option.value"
          class="bg-brand-50 text-brand-700 inline-flex min-w-0 items-center gap-0.5 rounded px-1 py-0.5 text-sm"
        >
          <span class="truncate">{{ option.label }}</span>
          <button
            v-if="!disabled"
            class="text-brand-600 hover:bg-brand-100 focus-visible:outline-brand-500 grid size-4 shrink-0 place-items-center rounded focus-visible:outline-2"
            type="button"
            :aria-label="`移除 ${option.label}`"
            @click.stop="removeOption(option.value)"
          >
            <X :size="12" :stroke-width="2.5" aria-hidden="true" />
          </button>
        </span>
        <span v-if="hiddenTagCount > 0" class="text-brand-600 shrink-0 text-sm"
          >+{{ hiddenTagCount }}</span
        >
      </span>
      <input
        v-if="editable"
        v-model="query"
        class="text-brand-900 placeholder:text-nurse-300 min-w-12 flex-1 bg-transparent text-sm outline-none"
        type="text"
        :placeholder="selectedOptions.length ? '' : placeholder"
        :disabled="disabled"
        @click.stop="openMenu"
        @input="handleEditableInput"
        @keydown.stop="handleEditableKeydown"
      />
      <button
        v-if="clearable && selectedOptions.length && !disabled"
        class="text-nurse-500 hover:bg-nurse-100 hover:text-brand-700 focus-visible:outline-brand-500 absolute right-8 grid size-5 place-items-center rounded focus-visible:outline-2"
        type="button"
        aria-label="清除已選項目"
        @click.stop="clearSelection"
      >
        <X :size="14" :stroke-width="2.5" aria-hidden="true" />
      </button>
      <ChevronDown
        class="text-brand-600 pointer-events-none absolute right-3 transition-transform duration-160"
        :class="isOpen ? 'rotate-180' : ''"
        :size="17"
        :stroke-width="2.5"
        aria-hidden="true"
      />
    </div>

    <Teleport to="body" :disabled="!teleport">
      <div
        v-if="isOpen"
        ref="menuElement"
        :class="menuClasses"
        :style="menuStyle"
        role="listbox"
        aria-multiselectable="true"
      >
        <div
          v-if="searchable && !editable"
          class="border-nurse-100 shrink-0 border-b p-1.5"
        >
          <label class="relative block">
            <Search
              class="text-nurse-400 pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2"
              :size="16"
              aria-hidden="true"
            />
            <input
              ref="searchInput"
              v-model="query"
              class="border-nurse-200 bg-nurse-50 text-brand-900 placeholder:text-nurse-400 focus:border-brand-500 focus:ring-brand-50 h-9 w-full rounded-md border pr-3 pl-8 text-sm outline-none focus:bg-white focus:ring-2"
              type="search"
              :placeholder="searchPlaceholder"
              @keydown.esc.prevent="closeMenu"
            />
          </label>
        </div>
        <div class="min-h-0 flex-1 overflow-y-auto p-1">
          <p
            v-if="!options.length"
            class="text-nurse-500 m-0 px-2.5 py-3 text-sm"
          >
            {{ emptyText }}
          </p>
          <p
            v-else-if="!visibleOptions.length"
            class="text-nurse-500 m-0 px-2.5 py-3 text-sm"
          >
            {{ noResultsText }}
          </p>
          <button
            v-if="canCreateOption"
            class="text-brand-700 hover:bg-brand-50 flex w-full items-center gap-1.5 rounded-md px-2 py-2 text-left text-sm transition-colors duration-160"
            type="button"
            role="option"
            @click="createCustomOption"
          >
            新增「{{ query.trim() }}」
          </button>
          <button
            v-for="option in visibleOptions"
            :key="option.value"
            class="group flex w-full items-center gap-1.5 rounded-md px-2 py-2 text-left text-sm transition-colors duration-160"
            :class="[
              option.disabled
                ? 'text-nurse-400 cursor-not-allowed'
                : 'text-brand-900 hover:bg-brand-50',
              isSelected(option.value) ? 'bg-brand-50' : '',
            ]"
            type="button"
            role="option"
            :aria-selected="isSelected(option.value)"
            :disabled="option.disabled"
            @click="toggleOption(option)"
          >
            <span
              class="grid size-4.5 shrink-0 place-items-center rounded-sm border-[1.5px]"
              :class="[
                isSelected(option.value)
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-nurse-300 bg-white text-transparent',
              ]"
              aria-hidden="true"
            >
              <Check :size="12" :stroke-width="3" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate">{{ option.label }}</span>
              <span
                v-if="option.description"
                class="text-nurse-500 mt-0.5 block truncate text-xs"
                >{{ option.description }}</span
              >
            </span>
          </button>
        </div>
        <div
          v-if="$slots.footer"
          class="border-nurse-100 shrink-0 border-t p-1.5"
        >
          <slot name="footer" :close="closeMenu" />
        </div>
      </div>
    </Teleport>
    <input
      v-if="required"
      class="sr-only"
      tabindex="-1"
      :value="selectedOptions.length ? 'selected' : ''"
      required
      aria-hidden="true"
    />
  </span>
</template>
