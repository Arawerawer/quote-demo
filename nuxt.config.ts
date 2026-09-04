import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: true },
  experimental: {
    appManifest: false,
  },
  css: ['~/assets/styles/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
})
