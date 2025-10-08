export const useServiceWorker = () => {
  const DEBUG = false
  const DELAY = false

  // Get runtime config to check environment
  const config = useRuntimeConfig()

  // Get app version from useAppVersion (single source of truth)
  const { appVersion, psVersion, applyVersionUpdate } = useAppVersion()

  // Service worker state
  const serviceWorkerRegistration = ref<ServiceWorkerRegistration | null>(null)

  const isInitialized = ref(false)

  // Initialize the service worker
  const init = async () => {
    if (!import.meta.client) return
    if (isInitialized.value) return
    if (config.public.dev) return DEBUG && console.log('Development mode: Service Worker registration skipped')
    if (!('serviceWorker' in navigator)) return

    // Mark as initialized
    isInitialized.value = true

    setupGlobalListeners()

    if (DELAY) {
      console.log('useServiceWorker: Sleeping 5 secs')
      await sleep(5000)
      console.log('useServiceWorker: Sleep done, proceeding with SW registration')
    }

    const swPath = '/sw.js'
    if (DEBUG) console.log(`useServiceWorker: Loading ${swPath} (version: ${appVersion.value})`)

    fetch(swPath)
      .then((response) => response.text())
      .then((text) => (text.length > 0 ? registerServiceWorker(swPath) : console.error(`useServiceWorker: Error - ${swPath} exists but is empty`)))
      .catch((error) => console.error(`useServiceWorker: Error - ${swPath} not accessible`, error))
  }

  // Register the service worker
  const registerServiceWorker = (swPath: string) => {
    navigator.serviceWorker
      .register(`${swPath}?appVersion=${appVersion.value}&psVersion=${psVersion.value}`)
      .then((registration) => (serviceWorkerRegistration.value = registration))
      .catch((error) => console.error('Service Worker registration failed:', error))
  }

  // Add this function to register a global listener BEFORE SW registration
  const setupGlobalListeners = () => {
    if (DEBUG) console.log('useServiceWorker: Setting up global service worker message listener')

    navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage)
    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage)

    // Log if we have a controller (can receive messages)
    if (DEBUG) {
      if (navigator.serviceWorker.controller) console.log('useServiceWorker: SW controller exists, can receive messages', navigator.serviceWorker.controller)
      else console.log('useServiceWorker: No SW controller yet - messages may not be received until page refresh')
    }
  }

  const handleServiceWorkerMessage = (event: any) => {
    console.log('useServiceWorker: 🔔 SW Message received:', event.data)
    /*
    console.log(appVersion.value)
    if (DEBUG || true) {
      console.log(event)
      console.log(navigator.serviceWorker)
    }
    */

    if (event.data?.type === 'SW_UPDATED') applyVersionUpdate(appVersion.value)
  }

  const applySWUpdate = async () => {
    if (!import.meta.client) return

    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        navigator.serviceWorker.addEventListener('controllerchange', () => {}) // Do nothing at the moment
      } else {
        // If we don't have a waiting service worker, just reload
        if (DEBUG) console.log(`useServiceWorker: No service worker, just reload`)
        window.location.reload()
      }
    } catch (err) {
      console.error('Error applying update:', err)
      // window.location.reload()
    }
  }

  // Return the service worker registration and update functions for external use
  return {
    init,
    applySWUpdate,
  }
}
