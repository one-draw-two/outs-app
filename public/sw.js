importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js')

// *** SINGLE VERSION PARAMETER TO CONTROL EVERYTHING ***
const APP_VERSION = '1.1.5' // Update this when you need to invalidate caches
const SW_VERSION = APP_VERSION
const CACHE_SUFFIX = 'v' + APP_VERSION.split('.').join('')

console.log(`[SW ${SW_VERSION}] Service worker initializing with Workbox (cache suffix: ${CACHE_SUFFIX})`)

// Use cache name with dynamically generated suffix
workbox.core.setCacheNameDetails({
  prefix: 'outstanding-offline',
  suffix: CACHE_SUFFIX,
})

// Load the client manifest dynamically
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('powersync-chunks-' + CACHE_SUFFIX).then(async (cache) => {
      try {
        // First, try to fetch the client manifest
        const manifestLocations = ['/_nuxt/client.manifest.mjs', '/_nuxt/builds/latest.json', '/.output/server/chunks/build/client.manifest.mjs']

        let clientManifest = null
        let manifestLocation = null

        // Try each possible location until we find the manifest
        for (const location of manifestLocations) {
          try {
            console.log(`[SW ${SW_VERSION}] Trying to fetch manifest from: ${location}`)
            const response = await fetch(location)
            if (response.ok) {
              const text = await response.text()

              // Try to extract the manifest object - handling both JSON and JS/TS module formats
              try {
                if (text.includes('export default') || text.includes('export const client_manifest')) {
                  // Handle JS module format by creating a function from the text
                  const extractManifest = new Function('exports', text + '; return exports.default || exports.client_manifest;')
                  clientManifest = extractManifest({})
                } else {
                  // Try JSON format
                  clientManifest = JSON.parse(text)
                }

                if (clientManifest) {
                  console.log(`[SW ${SW_VERSION}] Successfully loaded manifest from ${location}`)
                  manifestLocation = location
                  break
                }
              } catch (parseError) {
                console.log(`[SW ${SW_VERSION}] Failed to parse manifest at ${location}:`, parseError)
              }
            }
          } catch (fetchError) {
            console.log(`[SW ${SW_VERSION}] Failed to fetch manifest at ${location}:`, fetchError)
          }
        }

        // If we found a manifest, extract PowerSync chunks
        if (clientManifest) {
          // Extract PowerSync and wa-sqlite related files from the manifest
          const powerSyncChunks = []

          // Process the manifest entries
          for (const [key, entry] of Object.entries(clientManifest)) {
            // Look for PowerSync and wa-sqlite related files
            if (key.includes('powersync') || key.includes('wa-sqlite') || (entry.name && (entry.name.includes('powersync') || entry.name.includes('wa-sqlite')))) {
              if (entry.file) {
                const url = `/_nuxt/${entry.file}`
                powerSyncChunks.push(url)
              }

              // Also include any assets from PowerSync entries
              if (entry.assets) {
                entry.assets.forEach((asset) => {
                  const assetUrl = `/_nuxt/${asset}`
                  powerSyncChunks.push(assetUrl)
                })
              }
            }
          }

          // Cache all PowerSync chunks
          if (powerSyncChunks.length > 0) {
            console.log(`[SW ${SW_VERSION}] Found PowerSync chunks in manifest:`, powerSyncChunks)

            await Promise.allSettled(
              powerSyncChunks.map((url) => {
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
          } else {
            console.log(`[SW ${SW_VERSION}] No PowerSync chunks found in manifest`)

            // Fallback to direct HTML parsing if no chunks found in manifest
            await tryDirectHtmlParsing(cache)
          }
        } else {
          console.log(`[SW ${SW_VERSION}] Could not load client manifest from any location`)

          // Fallback to direct HTML parsing
          await tryDirectHtmlParsing(cache)
        }
      } catch (error) {
        console.error(`[SW ${SW_VERSION}] Error in service worker install:`, error)
        // Continue with service worker installation even if caching fails
      }
    })
  )
})

// Fallback function to parse HTML directly
async function tryDirectHtmlParsing(cache) {
  console.log(`[SW ${SW_VERSION}] Attempting direct chunk detection`)

  // Look for chunks directly by naming pattern (works in production)
  const chunkPatterns = ['powersync', 'wa-sqlite']

  try {
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
  } catch (error) {
    console.error(`[SW ${SW_VERSION}] Error in direct HTML parsing:`, error)
  }
}

// The rest of your service worker remains the same...

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
