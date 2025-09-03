importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js', './sw/helpers.js')
// import { createCachingStrategy, tryDirectHtmlParsing } from './sw/helpers.js'

// Import version from query parameter or use default
const APP_VERSION = self.location.search.match(/appVersion=([^&]+)/)?.[1] || 'NA'
const SW_VERSION = APP_VERSION
const CACHE_SUFFIX = 'v' + APP_VERSION.split('.').join('')

console.log(`[SW ${SW_VERSION}] Service worker initializing with Workbox (cache suffix: ${CACHE_SUFFIX})`)

// Use cache name with dynamically generated suffix
workbox.core.setCacheNameDetails({
  prefix: 'outstanding-offline',
  suffix: CACHE_SUFFIX,
})

self.addEventListener('install', (event) => {
  // Force waiting service worker to become active
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // Take control of all clients immediately
  event.waitUntil(clients.claim())

  // Force new cache version
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // If the cache name doesn't include our current cache suffix
          if (cacheName.includes('outstanding-offline') && !cacheName.includes(CACHE_SUFFIX)) {
            console.log(`[SW] Deleting old cache: ${cacheName}`)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
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
            await tryDirectHtmlParsing(SW_VERSION, cache)
          }
        } else {
          console.log(`[SW ${SW_VERSION}] Could not load client manifest from any location`)

          // Fallback to direct HTML parsing
          await tryDirectHtmlParsing(SW_VERSION, cache)
        }
      } catch (error) {
        console.error(`[SW ${SW_VERSION}] Error in service worker install:`, error)
        // Continue with service worker installation even if caching fails
      }
    })
  )
})

// Fallback function to parse HTML directly

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

// Define route configurations
const routes = [
  // Root index route
  {
    match: ({ url }) => url.pathname === '/' || url.pathname === '/index.html',
    strategy: 'NetworkFirst',
    cacheName: 'index-cache',
    options: {
      maxEntries: 5,
      maxAgeDays: 1,
      plugins: [
        {
          handlerDidError: async () => {
            const cachedResponse = await caches.match('/index.html')
            if (cachedResponse) {
              return new Response(await cachedResponse.text(), {
                headers: {
                  'Content-Type': 'text/html',
                },
              })
            }
          },
        },
      ],
    },
  },

  // SPA navigation requests
  {
    match: ({ request }) => request.mode === 'navigate',
    strategy: 'NetworkFirst',
    cacheName: 'pages-cache',
    options: {
      maxEntries: 50,
      maxAgeDays: 1,
      plugins: [
        {
          cacheKeyWillBeUsed: async () => {
            return new Request('/index.html')
          },
          handlerDidError: async () => {
            const cachedResponse = await caches.match('/index.html')
            if (cachedResponse) {
              return new Response(await cachedResponse.text(), {
                headers: {
                  'Content-Type': 'text/html',
                },
              })
            }
          },
        },
      ],
    },
  },

  // Static assets (JS, CSS, etc.)
  {
    match: ({ request }) => request.destination === 'script' || request.destination === 'style',
    strategy: 'StaleWhileRevalidate',
    cacheName: 'static-assets',
    options: {
      maxEntries: 100,
      maxAgeDays: 7,
      plugins: [
        {
          handlerDidError: async ({ request }) => {
            console.error(`[SW ${SW_VERSION}] Failed to load static asset:`, request.url)
            return fetch(request)
          },
        },
      ],
    },
  },

  // Images
  {
    match: ({ request }) => request.destination === 'image',
    strategy: 'CacheFirst',
    cacheName: 'images',
    options: {
      maxEntries: 60,
      maxAgeDays: 30,
    },
  },

  // API requests
  {
    match: ({ url }) => url.pathname.includes('/api'),
    strategy: 'NetworkFirst',
    cacheName: 'api-cache',
    options: {
      maxEntries: 100,
      maxAgeDays: 1,
    },
  },
]

// Register all routes
routes.forEach((route) => {
  workbox.routing.registerRoute(route.match, createCachingStrategy(route.strategy, route.cacheName, route.options))
})

// PowerSync related functionality (kept separate as requested)
if (false) {
  // Wrapper to make it easier to enable/disable
  // PowerSync chunks
  workbox.routing.registerRoute(
    ({ url }) => {
      // Simplified match for PowerSync files
      return url.pathname.includes('powersync') || url.pathname.includes('wa-sqlite')
    },
    createCachingStrategy('CacheFirst', 'powersync-chunks', {
      maxAgeDays: 30,
      plugins: [
        {
          handlerDidError: async ({ request }) => {
            console.error(`[SW ${SW_VERSION}] Failed to load PowerSync chunk:`, request.url)
            try {
              return await fetch(request)
            } catch (e) {
              console.error(`[SW ${SW_VERSION}] Network fallback also failed:`, e)
              return undefined
            }
          },
        },
      ],
    })
  )

  // PowerSync API requests
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.includes('/powersync'),
    createCachingStrategy('NetworkFirst', 'powersync-api', {
      maxAgeDays: 1,
    })
  )
}

// Set default handler
workbox.routing.setDefaultHandler(createCachingStrategy('NetworkFirst', 'default-cache'))

// Message handling
self.addEventListener('message', (event) => {
  const messageHandlers = {
    SKIP_WAITING: () => self.skipWaiting(),
    GET_VERSION: () => event.ports[0].postMessage({ version: SW_VERSION }),
  }

  if (event.data && event.data.type && messageHandlers[event.data.type]) {
    messageHandlers[event.data.type]()
  }
})
