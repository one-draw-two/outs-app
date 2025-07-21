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
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Your app description' },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Outstanding' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' },
      ],
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
  css: ['~/assets/styles/tw.postcss', '~/assets/styles/transitions.css', '~/assets/styles/typography.css', '~/assets/styles/main.css'],
  runtimeConfig: {
    public: {
      dev: process.env.DEV ? true : false,
      cBPSsn: process.env.CURRENT_BP_SEASON_SHORT, // Need to do something about this (to be able to change seasons)
      platform: process.env.NUXT_PUBLIC_PLATFORM || 'web',
      authUrl: process.env.DEV ? process.env.DEV_AUTH_URL : process.env.AUTH_URL,
      baseUrl: process.env.DEV ? process.env.DEV_BASE_URL : process.env.BASE_URL,
      tokenUrl: process.env.DEV ? process.env.DEV_TOKEN_URL : process.env.TOKEN_URL,
    },
  },
  imports: {
    dirs: ['app/composables/**'],
  },
  /*
  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },
  */
})
