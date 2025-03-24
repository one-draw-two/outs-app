import type { VitePWAOptions } from 'vite-plugin-pwa'

const pwaConfig: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate' as const,
  devOptions: {
    enabled: true,
  },
  manifest: {
    name: 'Outstanding',
    short_name: 'Outstanding',
    description: 'Your app description',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
    orientation: 'portrait',
    start_url: '/',
    icons: [
      {
        src: 'icons/512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  workbox: {
    maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
    navigateFallback: null,
    globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
  },
}

export default pwaConfig
