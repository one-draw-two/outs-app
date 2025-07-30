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
// Find PowerSync chunks at runtime
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('powersync-chunks-' + CACHE_SUFFIX).then(async (cache) => {
      try {
        // Try multiple possible manifest locations in Nuxt 3 (production)
        const manifestLocations = ['/_nuxt/manifest/latest.json', '/_nuxt/client.manifest.json', '/.output/public/_nuxt/manifest.json']

        // This flag will track if we found any manifests
        let foundManifest = false

        // Try each location
        for (const location of manifestLocations) {
          try {
            console.log(`[SW ${SW_VERSION}] Trying to fetch manifest from: ${location}`)
            const response = await fetch(location)
            if (!response.ok) continue

            const manifest = await response.json()
            foundManifest = true

            // Extract files based on manifest format
            let files = []

            if (Array.isArray(manifest)) {
              files = manifest
            } else if (typeof manifest === 'object') {
              if (manifest.all) files = manifest.all
              else if (manifest.files) files = Object.keys(manifest.files)
              else files = Object.keys(manifest)
            }

            // Find PowerSync chunks
            const powerSyncChunks = files.filter((file) => file.includes('powersync') || file.includes('wa-sqlite'))

            if (powerSyncChunks.length > 0) {
              console.log(`[SW ${SW_VERSION}] Found PowerSync chunks in ${location}:`, powerSyncChunks)

              // Determine base path
              const basePath = '/_nuxt/'

              // Cache each chunk
              await Promise.allSettled(
                powerSyncChunks.map((file) => {
                  // Handle different path formats
                  const url = file.startsWith('/') ? file : basePath + file
                  console.log(`[SW ${SW_VERSION}] Attempting to cache: ${url}`)

                  return fetch(url).then((response) => {
                    if (response.ok) {
                      console.log(`[SW ${SW_VERSION}] Successfully cached: ${url}`)
                      return cache.put(url, response)
                    } else {
                      console.warn(`[SW ${SW_VERSION}] Failed to cache: ${url} (${response.status})`)
                    }
                  })
                })
              )
            }
          } catch (err) {
            console.log(`[SW ${SW_VERSION}] Error processing manifest at ${location}:`, err)
          }
        }

        console.log(`FOUND MANIFEST: ${foundManifest}`)

        // If no manifest found, try direct chunk detection
        if (!foundManifest) {
          console.log(`[SW ${SW_VERSION}] No manifests found, attempting direct chunk detection`)

          // Look for chunks directly by naming pattern (works in production)
          const chunkPatterns = ['powersync', 'wa-sqlite']

          // Fetch the HTML to extract script references
          const htmlResponse = await fetch('/')
          if (htmlResponse.ok) {
            const html = await htmlResponse.text()

            // Extract script src values
            const scriptRegex = /<script[^>]+src=["']([^"']+)["'][^>]*>/g
            let match
            const scriptSrcs = []

            while ((match = scriptRegex.exec(html)) !== null) {
              scriptSrcs.push(match[1])
            }

            // Filter for PowerSync chunks
            const powerSyncScripts = scriptSrcs.filter((src) => chunkPatterns.some((pattern) => src.includes(pattern)))

            console.log(`[SW ${SW_VERSION}] Found PowerSync scripts in HTML:`, powerSyncScripts)

            // Cache these scripts
            if (powerSyncScripts.length > 0) {
              await Promise.allSettled(
                powerSyncScripts.map((src) => {
                  console.log(`[SW ${SW_VERSION}] Attempting to cache: ${src}`)
                  return fetch(src).then((response) => {
                    if (response.ok) {
                      console.log(`[SW ${SW_VERSION}] Successfully cached: ${src}`)
                      return cache.put(src, response)
                    } else {
                      console.warn(`[SW ${SW_VERSION}] Failed to cache: ${src} (${response.status})`)
                    }
                  })
                })
              )
            }
          }
        }
      } catch (error) {
        console.error(`[SW ${SW_VERSION}] Error in service worker install:`, error)
        // Continue with service worker installation even if caching fails
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
