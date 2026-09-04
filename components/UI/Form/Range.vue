<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    showValue?: boolean
    valueSuffix?: string
    warning?: boolean
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    showValue: true,
    valueSuffix: '',
    warning: false,
  },
)

const model = defineModel<number>({ default: 0 })
const progress = computed(() => {
  const span = props.max - props.min
  return span > 0 ? ((model.value - props.min) / span) * 100 : 0
})
</script>

<template>
  <div
    class="form-range"
    :class="{
      'form-range--disabled': disabled,
      'form-range--warning': warning,
    }"
  >
    <input
      v-model.number="model"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :style="{ '--range-progress': `${progress}%` }"
    />
    <output v-if="showValue">{{ model }}{{ valueSuffix }}</output>
  </div>
</template>

<style scoped lang="scss">
.form-range {
  display: flex;
  min-height: 44px;
  align-items: center;
  gap: 14px;

  input {
    width: 100%;
    height: 6px;
    margin: 0;
    appearance: none;
    border-radius: 100px;
    outline: 0;
    background: linear-gradient(
      to right,
      var(--color-brand-500) 0 var(--range-progress),
      var(--color-nurse-200) var(--range-progress) 100%
    );

    &::-webkit-slider-thumb {
      width: 20px;
      height: 20px;
      appearance: none;
      border: 3px solid var(--color-white);
      border-radius: 50%;
      background: var(--color-brand-500);
      box-shadow: 0 0 0 1px var(--color-brand-500);
      cursor: grab;
    }

    &::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border: 3px solid var(--color-white);
      border-radius: 50%;
      background: var(--color-brand-500);
      box-shadow: 0 0 0 1px var(--color-brand-500);
      cursor: grab;
    }

    &:focus-visible {
      box-shadow: 0 0 0 3px var(--color-brand-50);
    }
  }

  output {
    min-width: 52px;
    padding: 5px 8px;
    border-radius: 6px;
    color: var(--color-brand-700);
    background: var(--color-brand-50);
    font-size: 13px;
    font-weight: 700;
    text-align: center;
  }

  &--disabled {
    opacity: 0.5;
  }
  &--warning:not(&--disabled) input {
    background: linear-gradient(
      to right,
      var(--color-rose-500) 0 var(--range-progress),
      var(--color-rose-200) var(--range-progress) 100%
    );
  }
  &--warning:not(&--disabled) input::-webkit-slider-thumb {
    background: var(--color-rose-500);
    box-shadow: 0 0 0 1px var(--color-rose-500);
  }
  &--warning:not(&--disabled) input::-moz-range-thumb {
    background: var(--color-rose-500);
    box-shadow: 0 0 0 1px var(--color-rose-500);
  }
  &--warning:not(&--disabled) output {
    color: var(--color-rose-700);
    background: var(--color-rose-50);
  }
  &--disabled input::-webkit-slider-thumb {
    cursor: not-allowed;
  }
  &--disabled input::-moz-range-thumb {
    cursor: not-allowed;
  }
}
</style>
