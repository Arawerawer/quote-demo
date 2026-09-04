<script setup lang="ts">
const expanded = defineModel<boolean>({ default: true })
const transitionDuration = 200

const setTransitionHeight = (element: HTMLElement, height: string) => {
  element.style.height = height
  element.style.overflow = 'hidden'
}

const beforeEnter = (element: Element) => {
  setTransitionHeight(element as HTMLElement, '0px')
}

const enter = (element: Element, done: () => void) => {
  const target = element as HTMLElement
  const complete = () => {
    target.removeEventListener('transitionend', complete)
    target.style.height = ''
    target.style.overflow = ''
    target.style.transition = ''
    done()
  }

  target.style.transition = `height ${transitionDuration}ms ease`
  requestAnimationFrame(() => {
    target.style.height = `${target.scrollHeight}px`
    target.addEventListener('transitionend', complete)
  })
}

const leave = (element: Element, done: () => void) => {
  const target = element as HTMLElement
  const complete = () => {
    target.removeEventListener('transitionend', complete)
    done()
  }

  target.style.height = `${target.scrollHeight}px`
  target.style.overflow = 'hidden'
  target.style.transition = `height ${transitionDuration}ms ease`
  target.offsetHeight
  requestAnimationFrame(() => {
    target.style.height = '0px'
    target.addEventListener('transitionend', complete)
  })
}
</script>

<template>
  <Transition
    :css="false"
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
  >
    <div v-if="expanded" class="-mr-5 -ml-5 overflow-hidden">
      <section id="table-filter" class="min-h-0 overflow-hidden">
        <div
          class="border-nurse-200 mb-4 border-t border-b bg-neutral-100 px-5 py-3"
        >
          <slot />
        </div>
      </section>
    </div>
  </Transition>
</template>
