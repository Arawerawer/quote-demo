<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'

// 品項頁的填寫步驟列。扁鐵四步、鋼板彎折三步，樣式與行為完全相同，
// 原本是兩頁各自複製一份，抽出來共用。
//
// 不是 UIPageProgressSteps——那個的 props 寫死 `current: 1 | 2 | 3`，
// 只吃數字也只能三步，兩個品項頁都用不了。
defineProps<{
  /** 步驟清單，順序即顯示順序 */
  steps: { id: string; title: string }[]
  /** 目前所在的步驟 id */
  current: string
  /**
   * 某一步能不能點。由呼叫端傳函式進來而不是元件自己算：
   * 新增模式要「前面都填完才能點」，編輯模式要「每一步都能點」，
   * 這個規則只有呼叫端知道。
   */
  isReachable: (id: string) => boolean
}>()

defineEmits<{ select: [id: string] }>()
</script>

<template>
  <!-- 步驟列：顯示目前進度，也可點回已完成的步驟 -->
  <nav aria-label="填寫步驟">
    <ol class="m-0 flex list-none flex-wrap items-center gap-2 p-0">
      <li
        v-for="(step, index) in steps"
        :key="step.id"
        class="flex items-center gap-2"
      >
        <button
          class="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold transition-colors"
          :class="[
            current === step.id
              ? 'border-brand-500 bg-brand-500 text-white'
              : isReachable(step.id)
                ? 'border-nurse-200 text-brand-700 hover:bg-brand-50 bg-white'
                : 'border-nurse-200 text-nurse-500 cursor-not-allowed bg-white',
          ]"
          type="button"
          :disabled="!isReachable(step.id)"
          :aria-current="current === step.id ? 'step' : undefined"
          @click="$emit('select', step.id)"
        >
          <span
            class="grid size-5 shrink-0 place-items-center rounded-full text-xs"
            :class="
              current === step.id
                ? 'text-brand-700 bg-white'
                : 'bg-nurse-200 text-brand-700'
            "
          >
            {{ index + 1 }}
          </span>
          {{ step.title }}
        </button>
        <ChevronRight
          v-if="index < steps.length - 1"
          class="text-nurse-500 shrink-0"
          :size="16"
          aria-hidden="true"
        />
      </li>
    </ol>
  </nav>
</template>
