<template>
  <div
    class="screen-body mx-auto flex w-[min(100%,var(--container-page))] flex-1 flex-col md:min-h-[calc(100vh-63px)] md:flex-none"
  >
    <div class="screen-body-content w-full flex-1 md:flex-none">
      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>
