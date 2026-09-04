<script setup lang="ts">
type GridSize = number | string

const props = withDefaults(
  defineProps<{
    title: string
    sm?: GridSize
    md?: GridSize
    lg?: GridSize
    xl?: GridSize
  }>(),
  {
    sm: undefined,
    md: undefined,
    lg: undefined,
    xl: undefined,
  },
)

const responsiveSpanClassMap: Record<string, string> = {
  'sm-1': 'sm:col-span-1',
  'sm-2': 'sm:col-span-2',
  'sm-3': 'sm:col-span-3',
  'sm-4': 'sm:col-span-4',
  'sm-5': 'sm:col-span-5',
  'sm-6': 'sm:col-span-6',
  'sm-7': 'sm:col-span-7',
  'sm-8': 'sm:col-span-8',
  'sm-9': 'sm:col-span-9',
  'sm-10': 'sm:col-span-10',
  'sm-11': 'sm:col-span-11',
  'sm-12': 'sm:col-span-12',
  'md-1': 'md:col-span-1',
  'md-2': 'md:col-span-2',
  'md-3': 'md:col-span-3',
  'md-4': 'md:col-span-4',
  'md-5': 'md:col-span-5',
  'md-6': 'md:col-span-6',
  'md-7': 'md:col-span-7',
  'md-8': 'md:col-span-8',
  'md-9': 'md:col-span-9',
  'md-10': 'md:col-span-10',
  'md-11': 'md:col-span-11',
  'md-12': 'md:col-span-12',
  'lg-1': 'lg:col-span-1',
  'lg-2': 'lg:col-span-2',
  'lg-3': 'lg:col-span-3',
  'lg-4': 'lg:col-span-4',
  'lg-5': 'lg:col-span-5',
  'lg-6': 'lg:col-span-6',
  'lg-7': 'lg:col-span-7',
  'lg-8': 'lg:col-span-8',
  'lg-9': 'lg:col-span-9',
  'lg-10': 'lg:col-span-10',
  'lg-11': 'lg:col-span-11',
  'lg-12': 'lg:col-span-12',
  'xl-1': 'xl:col-span-1',
  'xl-2': 'xl:col-span-2',
  'xl-3': 'xl:col-span-3',
  'xl-4': 'xl:col-span-4',
  'xl-5': 'xl:col-span-5',
  'xl-6': 'xl:col-span-6',
  'xl-7': 'xl:col-span-7',
  'xl-8': 'xl:col-span-8',
  'xl-9': 'xl:col-span-9',
  'xl-10': 'xl:col-span-10',
  'xl-11': 'xl:col-span-11',
  'xl-12': 'xl:col-span-12',
}

const fieldClasses = computed(() => [
  'ui-field col-span-full min-w-0',
  props.sm === undefined
    ? ''
    : (responsiveSpanClassMap[`sm-${String(props.sm)}`] ?? ''),
  props.md === undefined
    ? ''
    : (responsiveSpanClassMap[`md-${String(props.md)}`] ?? ''),
  props.lg === undefined
    ? ''
    : (responsiveSpanClassMap[`lg-${String(props.lg)}`] ?? ''),
  props.xl === undefined
    ? ''
    : (responsiveSpanClassMap[`xl-${String(props.xl)}`] ?? ''),
])
</script>

<template>
  <div :class="['flex h-full items-start bg-white', fieldClasses]">
    <div
      class="border-brand-100 bg-brand-50 text-brand-800 h-full w-full max-w-[14ch] shrink-0 border-r px-3 py-2 text-left"
    >
      {{ title }}
    </div>
    <div class="min-w-0 flex-1 px-3 py-2 text-left text-neutral-900">
      <slot />
    </div>
  </div>
</template>
