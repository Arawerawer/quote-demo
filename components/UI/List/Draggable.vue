<script setup lang="ts">
import { GripVertical } from '@lucide/vue'
import Draggable from 'vuedraggable'

export type DraggableListItem = {
  id: string | number
  text: string
}

const model = defineModel<DraggableListItem[]>({ required: true })

withDefaults(
  defineProps<{
    itemKey?: string
    disabled?: boolean
  }>(),
  {
    itemKey: 'id',
    disabled: false,
  },
)
</script>

<template>
  <Draggable
    v-model="model"
    class="ui-list-draggable border-nurse-200 overflow-hidden rounded-lg border bg-white"
    :item-key="itemKey"
    :disabled="disabled"
    handle=".ui-list-draggable__handle"
    ghost-class="ui-list-draggable__item--ghost"
    chosen-class="ui-list-draggable__item--chosen"
    drag-class="ui-list-draggable__item--dragging"
    :animation="160"
    tag="div"
  >
    <template #item="{ element, index }">
      <div class="ui-list-draggable__item flex min-h-11 min-w-0 items-center">
        <button
          class="ui-list-draggable__handle text-nurse-500 hover:text-brand-600 focus-visible:ring-brand-500/45 grid size-11 shrink-0 place-items-center bg-transparent focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset disabled:cursor-default"
          type="button"
          :disabled="disabled"
          aria-label="拖曳以變更順序"
          title="拖曳以變更順序"
        >
          <GripVertical :size="18" :stroke-width="2" aria-hidden="true" />
        </button>
        <div
          class="min-w-0 flex-1 py-2 pr-3 text-left text-base text-neutral-900"
        >
          <slot name="item" :item="element" :index="index">
            {{ element.text }}
          </slot>
        </div>
      </div>
    </template>
  </Draggable>
</template>

<style scoped>
.ui-list-draggable__item {
  border-bottom: 1px solid var(--color-nurse-200);
  background: white;
  transition: background-color 160ms ease;
}

.ui-list-draggable__item:nth-child(even) {
  background: var(--color-nurse-50);
}

.ui-list-draggable__item:last-child {
  border-bottom: 0;
}

.ui-list-draggable__handle {
  cursor: grab;
}

.ui-list-draggable__handle:active {
  cursor: grabbing;
}

.ui-list-draggable__item--ghost {
  background: var(--color-brand-50);
  opacity: 0.6;
}

.ui-list-draggable__item--chosen,
.ui-list-draggable__item--dragging {
  background: white;
  box-shadow: 0 6px 18px rgb(0 29 69 / 16%);
}
</style>
