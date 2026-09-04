<script setup lang="ts">
import { Clock3 } from '@lucide/vue'
const props = defineProps<{
  title: string
  description: string
  selected?: boolean
  duration?: string
  price?: string
}>()

defineEmits<{ select: [] }>()

const hasDetails = computed(() => Boolean(props.duration || props.price))
</script>

<template>
  <button
    class="selectable-card group text-brand-900 hover:border-brand-200 hover:bg-brand-50 relative flex min-h-15 w-full flex-col gap-3 rounded-lg border p-4 text-left transition-all duration-200"
    :class="[
      selected
        ? 'selectable-card--selected bg-brand-50 border-transparent'
        : 'border-nurse-200 bg-white',
      hasDetails ? 'min-h-[174px]' : '',
    ]"
    type="button"
    @click="$emit('select')"
  >
    <span class="flex w-full justify-between text-lg">
      <strong>{{ title }}</strong>
      <span
        class="selectable-card__radio group-hover:border-brand-500 mt-0.5 grid size-[22px] shrink-0 place-items-center rounded-full border bg-white"
        :class="selected ? 'border-brand-500' : 'border-nurse-500'"
        ><span v-if="selected" class="bg-brand-400 size-3 rounded-full"
      /></span>
    </span>

    <span
      class="text-brand-600 text-sm leading-normal"
      :class="hasDetails ? 'flex-1' : ''"
      >{{ description }}</span
    >

    <span
      v-if="hasDetails"
      class="selectable-card__footer border-nurse-200 flex w-full items-center justify-between border-t pt-3 text-lg"
    >
      <span
        v-if="duration"
        class="text-brand-600 flex items-center gap-1.5 text-[13px]"
      >
        <Clock3 :size="14" :stroke-width="2" aria-hidden="true" />
        {{ duration }}
      </span>
      <strong v-if="price" :class="selected ? 'text-brand-600' : ''">{{
        price
      }}</strong>
    </span>
  </button>
</template>

<style scoped lang="scss">
.selectable-card {
  &--selected {
    &::after {
      position: absolute;
      inset: -1px;
      border: 1px solid var(--color-brand-500);
      border-radius: 7px;
      content: '';
      pointer-events: none;
    }
    &::before {
      position: absolute;
      inset: -1px;
      border-radius: 7px;
      box-shadow: 0 0 0 3px var(--color-brand-300);
      content: '';
      opacity: 0.7;
      pointer-events: none;
    }
  }
}
</style>
