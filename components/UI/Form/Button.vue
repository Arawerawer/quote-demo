<script setup lang="ts">
import type { FormControlSize } from '../../../composables/useFormControlStyles'

type ButtonVariant =
  'primary' | 'secondary' | 'cancel' | 'warning' | 'danger' | 'outline'
type ButtonAppearance = 'solid' | 'outline'
type ButtonTone = Exclude<ButtonVariant, 'outline'>

const props = withDefaults(
  defineProps<{
    text?: string
    icon?: string
    iconPosition?: 'left' | 'right'
    iconOnly?: boolean
    ariaLabel?: string
    type?: 'button' | 'submit' | 'reset'
    variant?: ButtonVariant
    appearance?: ButtonAppearance
    disabled?: boolean
    warning?: boolean
    size?: FormControlSize
  }>(),
  {
    text: '',
    icon: '',
    iconPosition: 'left',
    iconOnly: false,
    ariaLabel: undefined,
    type: 'button',
    variant: 'primary',
    appearance: 'solid',
    disabled: false,
    warning: false,
    size: 'md',
  },
)

const solidClasses: Record<ButtonTone, string> = {
  primary:
    'border-brand-600 bg-brand-500 text-white hover:not-disabled:border-brand-700 hover:not-disabled:bg-brand-600',
  secondary:
    'border-emerald-700 bg-emerald-600 text-white hover:not-disabled:border-emerald-800 hover:not-disabled:bg-emerald-700',
  cancel:
    'border-secondary-700 bg-secondary-600 text-white hover:not-disabled:border-secondary-800 hover:not-disabled:bg-secondary-700',
  warning:
    'border-warning-600 bg-warning-500 text-white hover:not-disabled:border-warning-700 hover:not-disabled:bg-warning-600',
  danger:
    'border-danger-600 bg-danger-500 text-white hover:not-disabled:border-danger-700 hover:not-disabled:bg-danger-600',
}

const outlineClasses: Record<ButtonTone, string> = {
  primary:
    'border-brand-600 bg-white text-brand-600 hover:not-disabled:bg-brand-50 hover:not-disabled:text-brand-700',
  secondary:
    'border-emerald-600 bg-white text-emerald-700 hover:not-disabled:bg-emerald-50 hover:not-disabled:text-emerald-800',
  cancel:
    'border-secondary-600 bg-white text-secondary-700 hover:not-disabled:bg-secondary-50 hover:not-disabled:text-secondary-800',
  warning:
    'border-warning-600 bg-white text-warning-700 hover:not-disabled:bg-warning-50 hover:not-disabled:text-warning-800',
  danger:
    'border-danger-600 bg-white text-danger-600 hover:not-disabled:bg-danger-50 hover:not-disabled:text-danger-700',
}

const sizeClasses: Record<FormControlSize, string> = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-11 px-4 text-sm',
  lg: 'h-13 px-5 text-base',
}

const iconSize: Record<FormControlSize, number> = {
  sm: 14,
  md: 17,
  lg: 19,
}

const iconOnlyIconSize: Record<FormControlSize, number> = {
  sm: 16,
  md: 18,
  lg: 20,
}

const iconOnlySizeClasses: Record<FormControlSize, string> = {
  sm: 'size-9 flex-none p-0',
  md: 'size-11 flex-none p-0',
  lg: 'size-13 flex-none p-0',
}

const resolvedVariant = computed<ButtonTone>(() => {
  if (props.warning) return 'warning'
  return props.variant === 'outline' ? 'primary' : props.variant
})
const resolvedAppearance = computed<ButtonAppearance>(() =>
  props.variant === 'outline' ? 'outline' : props.appearance,
)
const buttonClasses = computed(() => [
  resolvedAppearance.value === 'outline'
    ? outlineClasses[resolvedVariant.value]
    : solidClasses[resolvedVariant.value],
  props.iconOnly ? iconOnlySizeClasses[props.size] : sizeClasses[props.size],
])
</script>

<template>
  <button
    class="form-button focus:ring-brand-500/45 inline-flex items-center justify-center gap-1.5 rounded-lg border font-bold whitespace-nowrap focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    :class="buttonClasses"
    :data-button-icon="icon || undefined"
    :data-button-icon-position="iconPosition"
    :type="type"
    :disabled="disabled"
    :aria-label="iconOnly ? ariaLabel || text || icon : undefined"
  >
    <template v-if="iconPosition === 'left'">
      <UIIcon
        v-if="icon"
        :name="icon"
        :size="iconOnly ? iconOnlyIconSize[size] : iconSize[size]"
      />
      <span v-if="text && !iconOnly">{{ text }}</span>
    </template>
    <template v-else>
      <span v-if="text && !iconOnly">{{ text }}</span>
      <UIIcon
        v-if="icon"
        :name="icon"
        :size="iconOnly ? iconOnlyIconSize[size] : iconSize[size]"
      />
    </template>
    <slot />
  </button>
</template>
