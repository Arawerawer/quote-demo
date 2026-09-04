<script setup lang="ts">
type StatusTagStatus = 'active' | 'complete' | 'inactive'
type StatusTagColor = 'primary' | 'secondary' | 'warning' | 'danger'

const props = withDefaults(
  defineProps<{
    status: StatusTagStatus
    color?: StatusTagColor
    size?: 'sm' | 'md'
  }>(),
  {
    size: 'sm',
  },
)

const statusCopy: Record<StatusTagStatus, string> = {
  active: '進行中',
  complete: '已完成',
  inactive: '未啟用',
}

const statusColors: Record<StatusTagStatus, StatusTagColor> = {
  active: 'primary',
  complete: 'secondary',
  inactive: 'danger',
}

const colorClasses: Record<StatusTagColor, string> = {
  primary: 'bg-brand-50 text-brand-700',
  secondary: 'bg-secondary-100 text-secondary-700',
  warning: 'bg-warning-100 text-warning-800',
  danger: 'bg-danger-50 text-danger-700',
}

const resolvedColor = computed(() => props.color ?? statusColors[props.status])
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center rounded-full font-bold"
    :class="[
      colorClasses[resolvedColor],
      size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs',
    ]"
  >
    {{ statusCopy[props.status] }}
  </span>
</template>
