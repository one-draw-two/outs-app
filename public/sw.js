// Simple service worker for basic offline functionality

const CACHE_NAME = 'outstanding-offline-v1'

// Assets to cache immediately
const urlsToCache = ['/', '/index.html', '/manifest.json', '/icons/512.png', '/favicon.ico']

// Check if URL is cacheable (must be http/https)
function isCacheableUrl(url) {
  const urlObj = new URL(url, self.location.origin)
  return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
}

// Install event - cache basic assets
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
  self.skipWaiting()
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-HTTP/HTTPS requests (like chrome-extension:)
  if (!isCacheableUrl(event.request.url)) {
    return
  }

  event.respondWith(
    // Try the cache first
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        return cachedResponse
      }

      // Otherwise try to fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200) {
            return response
          }

          // Cache the fetched response
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            // Double-check it's a cacheable URL before putting in cache
            if (isCacheableUrl(event.request.url)) {
              cache.put(event.request, responseToCache)
            }
          })

          return response
        })
        .catch(() => {
          // If both cache and network fail, return offline page
          // Return offline response only for HTML requests
          if (event.request.headers.get('Accept')?.includes('text/html')) {
            return new Response('You are offline. Please reconnect to use the app.', {
              headers: { 'Content-Type': 'text/html' },
            })
          }
          // For other resources, just let the error happen
          return Promise.reject('Network fetch failed')
        })
    })
  )
})
