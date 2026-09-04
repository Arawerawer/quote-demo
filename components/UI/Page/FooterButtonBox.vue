<template>
  <div class="page-footer-shell min-h-[83px] md:min-h-0">
    <footer
      class="page-footer border-nurse-300 fixed bottom-0 left-0 z-10 min-h-[83px] w-full border-t bg-white md:static md:min-h-0 md:border-t-0 md:bg-transparent"
    >
      <div
        class="page-footer__inner mx-auto flex w-[min(100%,var(--container-page))] items-center justify-center gap-3 px-4 py-[15px] md:w-full md:p-5"
      >
        <slot />
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.page-footer__inner {
  :deep(.app-button),
  :deep(a),
  :deep(button) {
    min-width: 140px;
    flex: 1;
  }

  @media (min-width: 48rem) {
    :deep(.app-button),
    :deep(a),
    :deep(button) {
      flex: none;
    }
  }
}
</style>
