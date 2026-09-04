<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string
    componentName: string
    description: string
    usage?: string
    tone?: 'default' | 'brand'
  }>(),
  {
    usage: '',
    tone: 'default',
  },
)
</script>

<template>
  <section class="border-nurse-200 overflow-hidden rounded-2xl border bg-white">
    <header class="border-nurse-200 border-b px-5 pt-4 pb-5">
      <div>
        <code class="text-brand-500 text-xs font-bold">{{
          componentName
        }}</code>
        <h2 class="m-0 text-xl font-bold">{{ title }}</h2>
      </div>
      <p class="text-desert-800 mt-1 mb-0 self-center text-sm leading-[1.6]">
        {{ description }}
      </p>
    </header>

    <div
      class="px-6 py-7"
      :class="props.tone === 'brand' ? 'bg-brand-500' : 'bg-desert-50'"
    >
      <slot />
    </div>

    <details v-if="usage" class="border-nurse-200 border-t">
      <summary
        class="text-brand-600 cursor-pointer px-6 py-3.5 text-[13px] font-bold"
      >
        查看使用方式
      </summary>
      <pre
        class="bg-brand-950 text-nurse-100 m-0 overflow-x-auto px-6 py-[18px] text-sm leading-[1.7]"
      ><code>{{ usage }}</code></pre>
    </details>
  </section>
</template>
