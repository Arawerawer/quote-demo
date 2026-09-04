<script setup lang="ts">
definePageMeta({
  hideAppNavigation: true,
})

const account = ref('')
const password = ref('')

const handleLogin = () => navigateTo('/')
</script>

<template>
  <main
    class="flex min-h-dvh items-center justify-center bg-[linear-gradient(135deg,#edf5f1_0%,#e3e7e4_52%,#dae7ef_100%)] px-5 py-8"
  >
    <section class="w-full max-w-100" aria-label="登入">
      <div class="mb-10 flex justify-center">
        <UIPageLogo tone="dark" />
      </div>

      <form class="space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-5">
          <label class="block space-y-2" for="account">
            <span class="text-brand-800 block text-sm font-bold">帳號</span>
            <UIFormInput
              id="account"
              v-model="account"
              placeholder="請輸入帳號"
              autocomplete="username"
              required
              class="w-full"
            />
          </label>

          <label class="block space-y-2" for="password">
            <span class="text-brand-800 block text-sm font-bold">密碼</span>
            <UIFormPassword
              id="password"
              v-model="password"
              placeholder="請輸入密碼"
              required
              class="w-full"
            />
          </label>
        </div>

        <div class="flex items-center justify-between gap-4 text-sm font-bold">
          <a class="text-brand-600 hover:text-brand-800" href="#">忘記密碼</a>
          <a class="text-brand-600 hover:text-brand-800" href="#">註冊</a>
        </div>

        <UIFormButton class="w-full" text="登入" type="submit" size="lg" />
      </form>
    </section>
  </main>
</template>
