// Don't use export keywords
async function tryDirectHtmlParsing(SW_VERSION, cache) {
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

// Helper function for creating expiration plugins
function createExpirationPlugin(maxEntries = 50, maxAgeDays = 7) {
  return new workbox.expiration.ExpirationPlugin({
    maxEntries,
    maxAgeSeconds: maxAgeDays * 24 * 60 * 60,
  })
}

// Helper function for creating common caching strategies
function createCachingStrategy(strategyType, cacheName, options = {}) {
  const { maxEntries = 50, maxAgeDays = 7, plugins = [] } = options

  const defaultPlugins = [createExpirationPlugin(maxEntries, maxAgeDays)]

  const allPlugins = [...defaultPlugins, ...plugins]

  switch (strategyType) {
    case 'NetworkFirst':
      return new workbox.strategies.NetworkFirst({
        cacheName: cacheName + '-' + CACHE_SUFFIX,
        plugins: allPlugins,
      })
    case 'CacheFirst':
      return new workbox.strategies.CacheFirst({
        cacheName: cacheName + '-' + CACHE_SUFFIX,
        plugins: allPlugins,
      })
    case 'StaleWhileRevalidate':
      return new workbox.strategies.StaleWhileRevalidate({
        cacheName: cacheName + '-' + CACHE_SUFFIX,
        plugins: allPlugins,
      })
    default:
      return new workbox.strategies.NetworkFirst({
        cacheName: cacheName + '-' + CACHE_SUFFIX,
        plugins: allPlugins,
      })
  }
}

// Notice: no exports, these functions will be available in the global scope
