<script setup lang="ts">
import { Check, Minus } from '@lucide/vue'

/**
 * ⭕ 不要改回 defineModel。
 *
 * defineModel 會在內部留一份本地值，呼叫端若是傳
 * :model-value + 自己的 @update:model-value handler（而不是 v-model）——
 * 例如把選取狀態存成一組 id 陣列、由 handler 自己增刪——
 * 點一下就會把本地值寫成 true/false，從此跟 prop 脱鉤，
 * 之後 prop 再怎麼變都不會反映到畫面。
 *
 * 症狀很迷惑人：資料完全正常（計數、匯出內容都對），
 * 只有方框的底色跟勾勾不出來。
 *
 * 改成直接讀 prop、寫 emit，完全不留本地狀態，
 * v-model 跟 :model-value 兩種用法就都正確。
 */
const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    label?: string
    disabled?: boolean
    warning?: boolean
    bordered?: boolean
    ariaLabel?: string
    /**
     * 半勾狀態，用在「全選」這種代表一群子項目的框：
     * 子項目只勾了一部分時顯示「—」，而不是看起來像都沒勾。
     * model 為 true 時忽略這個值（打勾優先）。
     */
    indeterminate?: boolean
  }>(),
  {
    label: '',
    disabled: false,
    warning: false,
    bordered: false,
    ariaLabel: undefined,
    indeterminate: false,
    modelValue: false,
  },
)

const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const model = computed(() => props.modelValue)

// 方框要不要上底色：打勾或半勾都算「有選到東西」
const isMarked = computed(() => model.value || props.indeterminate)
</script>

<template>
  <label
    class="form-checkbox group relative inline-flex items-center gap-2.25 text-[15px]"
    :class="[
      bordered ? 'h-11 w-full rounded-lg border px-3' : 'w-fit',
      disabled
        ? 'form-checkbox--disabled text-nurse-400 cursor-not-allowed'
        : warning
          ? 'form-checkbox--warning cursor-pointer text-rose-600'
          : 'text-brand-900 cursor-pointer',
      bordered
        ? disabled
          ? 'border-nurse-200 bg-nurse-50'
          : warning
            ? 'border-rose-500 bg-white'
            : 'border-nurse-200 has-checked:border-brand-500 bg-white'
        : '',
    ]"
  >
    <!-- indeterminate 是 DOM property 不是 attribute，Vue 會自己走 prop 綁定。
         綁上去輔助技術才讀得到「部分選取」，不只是視覺上的一橫 -->
    <input
      class="peer sr-only"
      type="checkbox"
      :checked="model"
      :disabled="disabled"
      :indeterminate="indeterminate"
      :aria-label="ariaLabel"
      @change="
        emit('update:modelValue', ($event.target as HTMLInputElement).checked)
      "
    />
    <span
      class="form-checkbox__control grid size-5 shrink-0 place-items-center rounded-[5px] border-[1.5px] text-white transition-[border-color,background-color,box-shadow] duration-160"
      :class="[
        disabled
          ? 'border-nurse-200'
          : warning
            ? 'border-rose-500 group-hover:border-rose-600'
            : 'border-nurse-400 group-hover:border-brand-500',
        warning
          ? 'peer-focus-visible:ring-3 peer-focus-visible:ring-rose-50'
          : 'peer-focus-visible:ring-brand-50 peer-focus-visible:ring-3',
        // 用 isMarked 而不是 peer-checked:：半勾時 input 的 checked 是 false，
        // 純 CSS 選擇器選不到，方框會變成沒底色的白框配一條看不見的白線。
        //
        // ⚠️ bg-white 必須寫在這條三元式的 else 裡，
        // **不可以拉回上面的固定 class**。兩者同樣特異性，
        // 誰贏是 Tailwind 產出的樣式表順序決定的，跟寫在 class 字串的
        // 前後無關——v4 把 bg-white 排在 bg-brand-500 後面，白色永遠贏。
        // 症狀：class 裡明明有 bg-brand-500，算出來卻是 rgb(255,255,255)，
        // 連帶白勾畫在白底上，看起來就像「沒打勾」。
        disabled
          ? 'bg-nurse-100'
          : isMarked
            ? warning
              ? 'border-rose-500 bg-rose-500'
              : 'border-brand-500 bg-brand-500'
            : 'bg-white',
      ]"
      aria-hidden="true"
    >
      <!-- ⚠️ 這裡只有兩種圖示，不要再加「未選取時的淡色提示勾」。
           試過，結果是使用者把提示勾看成真的勾，
           明明沒選卻以為選了。沒勾就是空框 -->
      <Check v-if="model" :size="13" :stroke-width="3" />
      <Minus v-else-if="indeterminate" :size="13" :stroke-width="3" />
    </span>
    <span v-if="label || $slots.default"
      ><slot>{{ label }}</slot></span
    >
  </label>
</template>
