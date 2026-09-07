<script setup lang="ts">
import {
  File as FileIcon,
  FileCode,
  FileText,
  Image as ImageIcon,
  Trash2,
  Upload,
} from '@lucide/vue'

/**
 * 表單用的檔案上傳欄位，橫向一列的精簡版，可複選。
 *
 * 與 UIImageUpload 的差別：那個只收單一圖片、固定 220px 高，是獨立展示用的；
 * 這個由 accept 決定收什麼格式，可一次選多個檔案，高度壓到與其他表單控制項相稱。
 */
const model = defineModel<File[]>({ default: () => [] })

const props = withDefaults(
  defineProps<{
    /** 同時傳給 <input accept> 與驗證邏輯；空字串代表不限格式 */
    accept?: string
    placeholder?: string
    /** 允許格式的補充說明，顯示在提示文字下方 */
    hint?: string
    /** 最多能選幾個檔案，0 代表不限 */
    maxFiles?: number
    disabled?: boolean
  }>(),
  {
    accept: '',
    placeholder: '拖曳檔案到這裡，或點擊選擇（可多選）',
    hint: '',
    maxFiles: 0,
    disabled: false,
  },
)

const emit = defineEmits<{
  error: [message: string]
}>()

const input = useTemplateRef('input')
const isDragging = ref(false)
const dragDepth = ref(0)
const errorMessage = ref('')

const acceptTokens = computed(() =>
  props.accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean),
)

/**
 * accept 有三種寫法要各別處理。
 * 副檔名要排在最前面判斷——.dwg／.dxf 沒有標準 MIME，
 * 在 Windows 上 file.type 常常是空字串，只比對 MIME 會誤擋。
 */
const isAccepted = (file: File) => {
  if (!acceptTokens.value.length) {
    return true
  }

  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()

  return acceptTokens.value.some((token) => {
    if (token.startsWith('.')) {
      return name.endsWith(token)
    }

    if (token.endsWith('/*')) {
      return type.startsWith(token.slice(0, -1))
    }

    return type === token
  })
}

const wildcardLabels: Record<string, string> = {
  image: '圖片',
  video: '影片',
  audio: '音訊',
}

// 把 accept 轉成看得懂的格式清單，錯誤訊息才講得出到底能傳什麼。
// 去重是因為 accept 會同時寫 application/pdf 與 .pdf
const acceptLabel = computed(() =>
  [
    ...new Set(
      acceptTokens.value.map((token) => {
        if (token.endsWith('/*')) {
          return wildcardLabels[token.slice(0, -2)] ?? token
        }

        if (token.startsWith('.')) {
          return token.slice(1).toUpperCase()
        }

        return (token.split('/')[1] ?? token).toUpperCase()
      }),
    ),
  ].join('、'),
)

const isImage = (file: File) => file.type.startsWith('image/')

const fileIconOf = (file: File) => {
  if (isImage(file)) {
    return ImageIcon
  }

  const name = file.name.toLowerCase()

  if (name.endsWith('.pdf')) {
    return FileText
  }

  if (name.endsWith('.dwg') || name.endsWith('.dxf')) {
    return FileCode
  }

  return FileIcon
}

const fileExtOf = (file: File) => {
  const dot = file.name.lastIndexOf('.')

  return dot > 0 ? file.name.slice(dot + 1).toUpperCase() : ''
}

const fileSizeOf = (file: File) =>
  file.size < 1024 * 1024
    ? `${Math.round(file.size / 1024)} KB`
    : `${(file.size / 1024 / 1024).toFixed(1)} MB`

/**
 * 預覽網址以檔案物件為 key 存起來。
 * 用 Map 而不是跟著陣列索引走，刪掉中間某個檔案時才不會整批錯位。
 */
const previewUrls = ref(new Map<File, string>())

const syncPreviewUrls = (files: File[]) => {
  if (!import.meta.client) return

  const next = new Map<File, string>()

  for (const file of files) {
    // 只有圖片需要 blob URL，其他格式建了也顯示不出來
    if (!isImage(file)) continue

    next.set(file, previewUrls.value.get(file) ?? URL.createObjectURL(file))
  }

  // 已經移除的檔案要把 blob URL 釋放掉，不然會一直佔記憶體
  for (const [file, url] of previewUrls.value) {
    if (!next.has(file)) URL.revokeObjectURL(url)
  }

  previewUrls.value = next
}

watch(model, (files) => syncPreviewUrls(files ?? []), {
  immediate: true,
  deep: true,
})

onBeforeUnmount(() => {
  for (const url of previewUrls.value.values()) {
    URL.revokeObjectURL(url)
  }
})

const openPicker = () => {
  if (!props.disabled) input.value?.click()
}

const isSameFile = (a: File, b: File) =>
  a.name === b.name && a.size === b.size && a.lastModified === b.lastModified

const addFiles = (incoming: FileList | File[] | undefined) => {
  errorMessage.value = ''

  const files = [...(incoming ?? [])]
  if (!files.length) return

  const accepted: File[] = []
  const rejected: string[] = []

  for (const file of files) {
    if (!isAccepted(file)) {
      rejected.push(file.name)
      continue
    }

    // 同名同大小同時間就當成同一個檔案，避免重複選到
    const isDuplicate =
      model.value.some((existing) => isSameFile(existing, file)) ||
      accepted.some((existing) => isSameFile(existing, file))

    if (!isDuplicate) accepted.push(file)
  }

  const messages: string[] = []

  if (rejected.length) {
    messages.push(
      `${rejected.join('、')} 格式不支援，請選擇 ${acceptLabel.value} 檔案。`,
    )
  }

  let next = [...model.value, ...accepted]

  if (props.maxFiles > 0 && next.length > props.maxFiles) {
    next = next.slice(0, props.maxFiles)
    messages.push(`最多只能上傳 ${props.maxFiles} 個檔案。`)
  }

  model.value = next

  if (messages.length) {
    errorMessage.value = messages.join('　')
    emit('error', errorMessage.value)
  }
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  addFiles(target.files ?? undefined)
  target.value = ''
}

const handleDrop = (event: DragEvent) => {
  dragDepth.value = 0
  isDragging.value = false
  if (props.disabled) return
  addFiles(event.dataTransfer?.files)
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

const removeFile = (target: File) => {
  model.value = model.value.filter((file) => file !== target)
  errorMessage.value = ''
}

const clearFiles = () => {
  model.value = []
  errorMessage.value = ''
}

const isFull = computed(
  () => props.maxFiles > 0 && model.value.length >= props.maxFiles,
)
</script>

<template>
  <div class="grid gap-2">
    <input
      ref="input"
      class="sr-only"
      type="file"
      multiple
      :accept="accept || undefined"
      :disabled="disabled"
      @change="handleChange"
    />

    <!-- 選滿了就不再顯示拖放區，避免使用者按了沒反應 -->
    <div
      v-if="!isFull"
      class="border-nurse-300 text-brand-700 hover:border-brand-400 hover:bg-brand-50 flex h-14 cursor-pointer items-center gap-3 rounded-lg border border-dashed bg-white px-3 transition-colors duration-200"
      :class="{
        'border-brand-500 bg-brand-50 border-solid': isDragging,
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
      <Upload :size="18" class="shrink-0" aria-hidden="true" />
      <span class="min-w-0" aria-live="polite">
        <span class="block truncate text-sm font-bold">
          {{ isDragging ? '放開以上傳' : placeholder }}
        </span>
        <span v-if="hint" class="text-nurse-500 block truncate text-xs">
          {{ hint }}
        </span>
      </span>
    </div>

    <ul v-if="model.length" class="m-0 grid list-none gap-2 p-0">
      <li
        v-for="file in model"
        :key="`${file.name}-${file.size}-${file.lastModified}`"
        class="border-nurse-200 flex items-center gap-3 rounded-lg border bg-white p-2"
      >
        <!-- 圖片給真的縮圖，其他格式給副檔名對應的圖示 -->
        <img
          v-if="isImage(file)"
          :src="previewUrls.get(file)"
          :alt="file.name"
          class="border-nurse-200 size-10 shrink-0 rounded-md border object-cover"
        />
        <span
          v-else
          class="bg-brand-50 text-brand-600 grid size-10 shrink-0 place-items-center rounded-md"
          aria-hidden="true"
        >
          <component :is="fileIconOf(file)" :size="20" />
        </span>

        <span class="min-w-0 flex-1">
          <span class="text-brand-800 block truncate text-sm font-bold">
            {{ file.name }}
          </span>
          <span class="text-nurse-500 block text-xs">
            {{ fileExtOf(file) }}．{{ fileSizeOf(file) }}
          </span>
        </span>

        <button
          type="button"
          class="text-nurse-500 shrink-0 rounded-md p-2 hover:bg-rose-50 hover:text-rose-600"
          :disabled="disabled"
          :aria-label="`移除 ${file.name}`"
          @click="removeFile(file)"
        >
          <Trash2 :size="16" aria-hidden="true" />
        </button>
      </li>
    </ul>

    <div
      v-if="model.length"
      class="flex flex-wrap items-center justify-between gap-2"
    >
      <span class="text-nurse-500 text-xs">
        已選 {{ model.length }} 個檔案{{
          maxFiles > 0 ? `（最多 ${maxFiles} 個）` : ''
        }}
      </span>
      <button
        type="button"
        class="text-nurse-500 text-xs font-bold underline hover:text-rose-600"
        :disabled="disabled"
        @click="clearFiles"
      >
        全部移除
      </button>
    </div>

    <p v-if="errorMessage" class="m-0 text-sm text-rose-600" role="alert">
      {{ errorMessage }}
    </p>
  </div>
</template>
