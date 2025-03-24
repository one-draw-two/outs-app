importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js')

// *** SINGLE VERSION PARAMETER TO CONTROL EVERYTHING ***
const APP_VERSION = '1.1.0'

// Derived values
const SW_VERSION = APP_VERSION
const CACHE_SUFFIX = 'v' + APP_VERSION.split('.').join('')

console.log(`[SW ${SW_VERSION}] Service worker initializing with Workbox (cache suffix: ${CACHE_SUFFIX})`)

// Use cache name with dynamically generated suffix
workbox.core.setCacheNameDetails({
  prefix: 'outstanding-offline',
  suffix: CACHE_SUFFIX,
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

// Handle SPA navigation requests - this works with dynamic Nuxt routes
workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({
    cacheName: 'pages-cache',
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

// PowerSync related resources - add custom handling if needed
// Example (modify according to your needs):
workbox.routing.registerRoute(
  ({ url }) => url.pathname.includes('/powersync'),
  new workbox.strategies.NetworkOnly() // or custom strategy
)

// Static assets (JS, CSS, etc.)
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-assets',
  })
)

// Images
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
)

// Catch-all for any other requests
workbox.routing.setDefaultHandler(
  new workbox.strategies.NetworkFirst({
    cacheName: 'default-cache',
  })
)
