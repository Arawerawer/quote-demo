<script setup lang="ts">
import { ImagePlus, RefreshCw, Trash2, UploadCloud } from '@lucide/vue'

const model = defineModel<File | null>({ default: null })

const props = withDefaults(
  defineProps<{
    accept?: string
    disabled?: boolean
  }>(),
  {
    accept: 'image/*',
    disabled: false,
  },
)

const emit = defineEmits<{
  error: [message: string]
}>()

const input = useTemplateRef('input')
const previewUrl = ref('')
const isDragging = ref(false)
const dragDepth = ref(0)
const errorMessage = ref('')

const clearPreviewUrl = () => {
  if (!previewUrl.value) return
  URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
}

watch(
  model,
  (file) => {
    if (!import.meta.client) return

    clearPreviewUrl()
    if (file) previewUrl.value = URL.createObjectURL(file)
  },
  { immediate: true },
)

onBeforeUnmount(clearPreviewUrl)

const openPicker = () => {
  if (!props.disabled) input.value?.click()
}

const setFile = (file?: File) => {
  errorMessage.value = ''
  if (!file) return

  if (!file.type.startsWith('image/')) {
    errorMessage.value = '請選擇圖片格式的檔案。'
    emit('error', errorMessage.value)
    return
  }

  model.value = file
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  setFile(target.files?.[0])
  target.value = ''
}

const handleDrop = (event: DragEvent) => {
  dragDepth.value = 0
  isDragging.value = false
  if (props.disabled) return
  setFile(event.dataTransfer?.files[0])
}

const handleDragEnter = () => {
  if (props.disabled) return
  dragDepth.value += 1
  isDragging.value = true
}

const handleDragOver = (event: DragEvent) => {
  if (props.disabled) return
  isDragging.value = true
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
}

const handleDragLeave = () => {
  if (props.disabled) return
  dragDepth.value = Math.max(0, dragDepth.value - 1)
  if (dragDepth.value === 0) isDragging.value = false
}

const removeFile = () => {
  model.value = null
  errorMessage.value = ''
}
</script>

<template>
  <div class="grid gap-3">
    <input
      ref="input"
      class="sr-only"
      type="file"
      :accept="accept"
      :disabled="disabled"
      @change="handleChange"
    />

    <div
      v-if="!model"
      class="border-nurse-300 text-brand-700 hover:border-brand-400 hover:bg-brand-50 relative flex min-h-55 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed bg-white p-6 text-center transition-[transform,background-color,border-color,box-shadow] duration-200"
      :class="{
        'border-brand-500 bg-brand-50 ring-brand-500/20 scale-[1.015] border-solid ring-4':
          isDragging,
        'cursor-not-allowed opacity-60': disabled,
      }"
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-disabled="disabled"
      @click="openPicker"
      @keydown.enter.prevent="openPicker"
      @keydown.space.prevent="openPicker"
      @dragenter.prevent="handleDragEnter"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <span
        class="bg-brand-500/20 text-brand-600 relative z-10 grid size-14 place-items-center rounded-2xl transition-[transform,background-color,color] duration-200"
        :class="isDragging ? 'drop-icon bg-brand-500 scale-110' : undefined"
      >
        <UploadCloud :size="28" aria-hidden="true" />
      </span>
      <span class="relative z-10 grid gap-1" aria-live="polite">
        <strong class="transition-colors duration-200">
          {{ isDragging ? '放開以上傳圖片' : '拖曳圖片到這裡，或點擊選擇檔案' }}
        </strong>
        <small :class="isDragging ? 'text-brand-600' : 'text-nurse-500'">
          {{ isDragging ? '圖片將立即顯示預覽' : '支援一般圖片格式' }}
        </small>
      </span>

      <span
        v-if="isDragging"
        class="bg-brand-100/60 pointer-events-none absolute inset-0 animate-pulse"
        aria-hidden="true"
      />
    </div>

    <div v-else class="grid gap-3">
      <UIImageDisplay :src="previewUrl" :alt="model.name" />
      <div class="flex flex-wrap items-center justify-between gap-3">
        <span class="text-brand-700 min-w-0 text-sm">
          <ImagePlus :size="16" class="mr-1 inline" aria-hidden="true" />
          {{ model.name }}
        </span>
        <div class="flex gap-2">
          <button
            type="button"
            class="border-nurse-200 text-brand-700 hover:border-brand-400 flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-sm font-bold"
            :disabled="disabled"
            @click="openPicker"
          >
            <RefreshCw :size="16" aria-hidden="true" />
            重新選擇
          </button>
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50"
            :disabled="disabled"
            @click="removeFile"
          >
            <Trash2 :size="16" aria-hidden="true" />
            移除檔案
          </button>
        </div>
      </div>
    </div>

    <p v-if="errorMessage" class="m-0 text-sm text-rose-600" role="alert">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
@keyframes drop-icon {
  0%,
  100% {
    transform: translateY(0) scale(1.1);
  }

  50% {
    transform: translateY(-6px) scale(1.1);
  }
}

.drop-icon {
  animation: drop-icon 800ms ease-in-out infinite;
}
</style>
