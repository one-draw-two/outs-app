importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js')

// *** SINGLE VERSION PARAMETER TO CONTROL EVERYTHING ***
const APP_VERSION = '1.1.1' // Update this when you need to invalidate caches

// Derived values
const SW_VERSION = APP_VERSION
const CACHE_SUFFIX = 'v' + APP_VERSION.split('.').join('')

console.log(`[SW ${SW_VERSION}] Service worker initializing with Workbox (cache suffix: ${CACHE_SUFFIX})`)

// Use cache name with dynamically generated suffix
workbox.core.setCacheNameDetails({
  prefix: 'outstanding-offline',
  suffix: CACHE_SUFFIX,
})

// Find PowerSync chunks at runtime
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('powersync-chunks-' + CACHE_SUFFIX).then(async (cache) => {
      // Find PowerSync chunks by pattern matching
      const response = await fetch('/_nuxt/manifest.json')
      if (response.ok) {
        const manifest = await response.json()
        const files = Object.keys(manifest)

        // Find the PowerSync chunks
        const powerSyncChunks = files.filter((file) => file.includes('powersync') || file.includes('wa-sqlite'))

        // Precache them
        await Promise.all(
          powerSyncChunks.map((file) => {
            const url = '/_nuxt/' + file
            return fetch(url).then((response) => {
              if (response.ok) {
                return cache.put(url, response)
              }
            })
          })
        )

        console.log(`[SW ${SW_VERSION}] Precached PowerSync chunks:`, powerSyncChunks)
      }
    })
  )
})

// Precache critical assets
workbox.precaching.precacheAndRoute([
  { url: '/', revision: APP_VERSION },
  { url: '/index.html', revision: APP_VERSION },
  { url: '/manifest.json', revision: APP_VERSION },
  { url: '/icons/512.png', revision: APP_VERSION },
  { url: '/favicon.ico', revision: APP_VERSION },
  // Add any other critical static assets
])

// Handle PowerSync chunk requests with highest priority
workbox.routing.registerRoute(
  ({ url }) => url.pathname.includes('powersync') || url.pathname.includes('wa-sqlite'),
  new workbox.strategies.CacheFirst({
    cacheName: 'powersync-chunks-' + CACHE_SUFFIX,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
)

// Handle SPA navigation requests - this works with dynamic Nuxt routes
workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({
    cacheName: 'pages-cache-' + CACHE_SUFFIX,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
      // This plugin returns index.html for navigation requests that fail
      {
        cacheKeyWillBeUsed: async () => {
          return new Request('/index.html')
        },
        handlerDidError: async () => {
          return await caches.match('/index.html')
        },
      },
    ],
  })
)

// Static assets (JS, CSS, etc.)
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-assets-' + CACHE_SUFFIX,
  })
)

// Images
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images-' + CACHE_SUFFIX,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
)

// PowerSync API/data requests
workbox.routing.registerRoute(
  ({ url }) => url.pathname.includes('/powersync') || url.pathname.includes('/api'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache-' + CACHE_SUFFIX,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  })
)

// Catch-all for any other requests
workbox.routing.setDefaultHandler(
  new workbox.strategies.NetworkFirst({
    cacheName: 'default-cache-' + CACHE_SUFFIX,
  })
)

// Skip waiting to force update when new version is available
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
