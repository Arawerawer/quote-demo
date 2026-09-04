<script setup lang="ts">
const props = defineProps<{
  title: string
  to: string
  active?: boolean
}>()

const tab = useTemplateRef('tab')

const revealActiveTab = async () => {
  if (!props.active) return

  await nextTick()
  tab.value?.$el.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center',
  })
}

onMounted(revealActiveTab)
watch(() => props.active, revealActiveTab)
</script>

<template>
  <NuxtLink
    ref="tab"
    :to="to"
    class="shrink-0 rounded-full border px-3.5 py-[9px] text-[13px] font-bold no-underline"
    :class="
      active
        ? 'border-brand-500 bg-brand-500 text-white'
        : 'border-nurse-200 text-brand-700 bg-white'
    "
    :aria-current="active ? 'page' : undefined"
  >
    {{ title }}
  </NuxtLink>
</template>
