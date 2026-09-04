<script setup lang="ts">
import { BriefcaseBusiness, CalendarX2 } from '@lucide/vue'

type EmptyVariant = 'service' | 'time'

const props = withDefaults(
  defineProps<{
    variant?: EmptyVariant
    title?: string
    description?: string
  }>(),
  {
    variant: 'time',
    title: '',
    description: '',
  },
)

const copy = {
  service: {
    title: '目前沒有可用的項目',
    description: '請稍後再回來查看最新內容。',
  },
  time: {
    title: '目前沒有可用時段',
    description: '請選擇其他時間，或稍後再試。',
  },
}

const iconMap = { service: BriefcaseBusiness, time: CalendarX2 }
const resolvedCopy = computed(() => copy[props.variant])
</script>

<template>
  <div
    class="border-nurse-300 text-brand-600 flex min-h-45 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed bg-white p-5 text-center"
    role="status"
  >
    <component
      :is="iconMap[props.variant]"
      :size="28"
      :stroke-width="1.6"
      aria-hidden="true"
    />
    <strong class="text-brand-800 text-[15px]">{{
      props.title || resolvedCopy.title
    }}</strong>
    <p class="m-0 text-[13px]">
      {{ props.description || resolvedCopy.description }}
    </p>
  </div>
</template>
