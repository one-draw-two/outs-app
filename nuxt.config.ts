import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-28',
  ssr: false,
  spaLoadingTemplate: false,
  devtools: { enabled: false },
  app: {
    head: {
      title: 'Outstanding', // default title
    },
  },
  vite: {
    plugins: [tailwindcss(), wasm(), topLevelAwait()],
    optimizeDeps: {
      exclude: ['@journeyapps/wa-sqlite', '@powersync/web'],
      include: ['@powersync/web > js-logger'], // <-- Include `js-logger` when it isn't installed and imported.
    },
    worker: {
      format: 'es',
      plugins: () => [wasm(), topLevelAwait()],
    },
    build: {
      target: 'esnext', // Add this to support modern JavaScript features
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('@powersync/web') || id.includes('@powersync/common')) {
              return 'powersync'
            }
            if (id.includes('@journeyapps/wa-sqlite')) {
              return 'powersync-wa-sqlite'
            }
          },
        },
      },
    },
  },
  css: ['~/assets/styles/main.css', '~/assets/styles/type.css'],
  runtimeConfig: {
    public: {
      dev: process.env.DEV ? true : false,
      platform: process.env.NUXT_PUBLIC_PLATFORM || 'web',
      authUrl: process.env.DEV ? process.env.DEV_AUTH_URL : process.env.AUTH_URL,
    },
  },
})
