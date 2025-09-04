import { onMounted, onUnmounted } from 'vue'

export default function useNetworkPerformance() {
  const { startTimer, endTimer } = usePerformanceDebug()
  let observer: PerformanceObserver | null = null

  function setupPerformanceObserver() {
    if (!window.PerformanceObserver) {
      console.warn('PerformanceObserver API not supported in this browser')
      return
    }

    try {
      // Create observer for resource timing entries
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming
            const url = resourceEntry.name.split('?')[0]?.split('#')[0]
            const resourceName = url?.split('/').pop() || url

            // Record detailed network metrics
            const metrics = {
              total: resourceEntry.duration,
              dns: resourceEntry.domainLookupEnd - resourceEntry.domainLookupStart,
              connect: resourceEntry.connectEnd - resourceEntry.connectStart,
              request: resourceEntry.responseStart - resourceEntry.requestStart,
              response: resourceEntry.responseEnd - resourceEntry.responseStart,
              fromServiceWorker: resourceEntry.workerStart > 0,
            }

            // Add to performance metrics with a namespace
            const perfMetrics = useState<Record<string, number>>('perfMetrics')

            // Only log resources that took significant time (> 50ms)
            if (metrics.total > 50) {
              const swPrefix = metrics.fromServiceWorker ? '[SW] ' : ''
              perfMetrics.value = {
                ...perfMetrics.value,
                [`${swPrefix}${resourceName}`]: parseFloat(metrics.total.toFixed(2)),
              }

              console.log(`🌐 Resource: ${resourceName}`, {
                ...metrics,
                url: resourceEntry.name,
              })
            }
          }
        }
      })

      // Observe resource and navigation timing
      observer.observe({ entryTypes: ['resource', 'navigation'] })
    } catch (error) {
      console.error('Error setting up performance observer:', error)
    }
  }

  // Track fetch/XHR requests with more detail
  function patchFetch() {
    const originalFetch = window.fetch

    window.fetch = function (...args) {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as any).url
      const resourceName = url.split('/').pop()?.split('?')[0] || url
      const perfKey = `fetch-${resourceName}`

      startTimer(perfKey)

      return originalFetch
        .apply(this, args)
        .then((response) => {
          const clone = response.clone()

          // For JSON responses, measure parsing time too
          if (response.headers.get('content-type')?.includes('application/json')) {
            startTimer(`${perfKey}-parse`)

            clone
              .json()
              .then(() => {
                endTimer(`${perfKey}-parse`)
              })
              .catch(() => {
                // Ignore parsing errors in performance monitoring
              })
          }

          endTimer(perfKey)
          return response
        })
        .catch((err) => {
          endTimer(perfKey)
          throw err
        })
    }
  }

  // Track service worker registration and updates
  function monitorServiceWorker() {
    if ('serviceWorker' in navigator) {
      // Track registration
      startTimer('sw-registration')

      navigator.serviceWorker.ready.then(() => {
        endTimer('sw-registration')
      })

      // Track updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        startTimer('sw-update')

        // End timer after a small delay to allow for initialization
        setTimeout(() => {
          endTimer('sw-update')
        }, 1000)
      })
    }
  }

  onMounted(() => {
    setupPerformanceObserver()
    patchFetch()
    monitorServiceWorker()
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    setupPerformanceObserver,
    patchFetch,
    monitorServiceWorker,
  }
}
