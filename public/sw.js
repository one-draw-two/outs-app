importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js', './sw/helpers.js')

// Import version from query parameter or use default
const VERSION = self.location.search.match(/appVersion=([^&]+)/)?.[1] || 'NA'
const FORCE_UPDATE = self.location.search.match(/forceUpdate=([^&]+)/)?.[1] === 'true'

setupSWLogger(VERSION)

const CACHE_SUFFIX = 'v' + VERSION.split('.').join('')

// The activate handler stays mostly the same, but we'll add a flag for tracking if this is a user-activated update
let isUserActivatedUpdate = false

console.log(`Service worker initializing with Workbox (cache suffix: ${CACHE_SUFFIX}, force update: ${FORCE_UPDATE})`)

// Use cache name with dynamically generated suffix
workbox.core.setCacheNameDetails({
  prefix: 'outstanding-offline',
  suffix: CACHE_SUFFIX,
})

// Modify your 'install' event handler - don't automatically skipWaiting
self.addEventListener('install', (event) => {
  console.log(`New service worker installed (waiting for activation)`)
  // Don't call skipWaiting() here - we'll do this on user action

  // If force update is enabled, skip waiting immediately
  if (FORCE_UPDATE) {
    console.log(`Force update enabled - skipping waiting`)
    self.skipWaiting()
  }
})

self.addEventListener('activate', (event) => {
  console.log(`Service worker activated`)

  // Take control of all clients immediately
  event.waitUntil(
    Promise.all([
      clients.claim(),
      // Clear old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // If the cache name doesn't include our current cache suffix
            if (cacheName.includes('outstanding-offline') && !cacheName.includes(CACHE_SUFFIX)) {
              console.log(`Deleting old cache: ${cacheName}`)
              return caches.delete(cacheName)
            }
            return Promise.resolve()
          })
        )
      }),
    ])
  )

  self.clients.matchAll().then((clients) => clients.forEach((client) => client.postMessage({ type: 'SW_UPDATED', version: VERSION })))
})

self.addEventListener('message', (event) => {
  console.log('SW ')
  console.log(event)
  if (event.data?.type === 'SKIP_WAITING') {
    console.log('Skip waiting message received, activating immediately')
    self.skipWaiting()
  }
})

/*
self.addEventListener('message', (event) => {
  // Move the isUserActivatedUpdate flag outside of any specific handler
  if (event.data && event.data.type === 'PREVENT_DEFAULT_REFRESH') {
    console.log(`[SW ${SW_VERSION}] Preventing default refresh behavior`)
    isUserActivatedUpdate = true // Set the flag to prevent automatic refresh
    return // Important: Return early to ensure this happens first
  }

  // Rest of your message handlers...
  const messageHandlers = {
    SKIP_WAITING: () => {
      console.log(`[SW ${SW_VERSION}] User activated update - applying immediately`)
      isUserActivatedUpdate = true
      self.skipWaiting()
    },
    GET_VERSION: () => {
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ version: SW_VERSION })
      }
    },
    CHECK_UPDATE: () => {
      // Just respond with current version - main thread will compare with app version
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({
          version: SW_VERSION,
          hasWaiting: self.registration && self.registration.waiting ? true : false,
        })
      }
    },
  }

  if (event.data && event.data.type && messageHandlers[event.data.type]) {
    messageHandlers[event.data.type]()
  }
})
*/

// Precache critical assets
workbox.precaching.precacheAndRoute([
  { url: '/', revision: VERSION },
  { url: '/index.html', revision: VERSION },
  { url: '/manifest.json', revision: VERSION },
  { url: '/icons/512.png', revision: VERSION },
  { url: '/favicon.ico', revision: VERSION },
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

  // Module scripts - CRITICAL: Handle these separately to prevent MIME type issues
  {
    match: ({ request, url }) => {
      return request.destination === 'script' && (url.pathname.includes('.js') || url.pathname.includes('/_nuxt/'))
    },
    strategy: 'NetworkOnly', // Always go to network for module scripts
    options: {
      plugins: [
        {
          handlerDidError: async ({ request }) => {
            console.error(`Failed to load module script:`, request.url)
            // Don't cache failed module requests, let them fail naturally
            throw new Error(`Module script failed to load: ${request.url}`)
          },
        },
      ],
    },
  },

  // SPA navigation requests - but exclude module scripts
  {
    match: ({ request, url }) => {
      return request.mode === 'navigate' && !url.pathname.includes('.js') && !url.pathname.includes('/_nuxt/')
    },
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

  // Static assets (CSS and other non-module scripts)
  {
    match: ({ request, url }) => {
      return request.destination === 'style' || (request.destination === 'script' && !url.pathname.includes('/_nuxt/'))
    },
    strategy: 'StaleWhileRevalidate',
    cacheName: 'static-assets',
    options: {
      maxEntries: 100,
      maxAgeDays: 7,
      plugins: [
        {
          handlerDidError: async ({ request }) => {
            console.error(`Failed to load static asset:`, request.url)
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
routes.forEach((route) => workbox.routing.registerRoute(route.match, createCachingStrategy(route.strategy, route.cacheName, route.options)))

// Set default handler
workbox.routing.setDefaultHandler(createCachingStrategy('NetworkFirst', 'default-cache'))
