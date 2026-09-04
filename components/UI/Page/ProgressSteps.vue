<script setup lang="ts">
import { Check } from '@lucide/vue'
const props = defineProps<{ current: 1 | 2 | 3 }>()
const steps = ['選擇項目', '填寫資料', '確認內容']
</script>

<template>
  <div class="px-4 py-8">
    <div class="mx-auto flex max-w-90 items-center justify-center gap-2">
      <div
        v-for="(label, index) in steps"
        :key="label"
        class="flex items-center gap-2 text-sm font-medium"
        :class="
          index + 1 === props.current
            ? 'text-brand-500 font-bold'
            : index + 1 < props.current
              ? 'text-brand-800'
              : 'text-[#9e9e9e]'
        "
        :title="label"
      >
        <span
          class="grid size-9 shrink-0 place-items-center rounded-full border text-[18px] font-bold"
          :class="
            index + 1 === props.current
              ? 'border-brand-600 bg-brand-500 text-white'
              : index + 1 < props.current
                ? 'border-brand-400 bg-brand-50'
                : 'border-nurse-300 bg-white'
          "
        >
          <Check
            v-if="index + 1 < props.current"
            :size="16"
            :stroke-width="3"
            aria-hidden="true"
          />
          <template v-else>{{ index + 1 }}</template>
        </span>
        <!-- 文字不換行 （sm 以上才顯示、action 狀態要顯示文字）-->
        <span
          class="ml-1 hidden text-sm font-medium whitespace-nowrap sm:block"
          >{{ label }}</span
        >
        <span v-if="index < steps.length - 1" class="bg-nurse-300 h-px w-4" />
      </div>
    </div>
  </div>
</template>
