export const useServiceWorker = () => {
  const DEBUG = true

  // Get runtime config to check environment
  const config = useRuntimeConfig()

  // Get app version from useAppVersion (single source of truth)
  const { appVersion, forceUpdate, applyVersionUpdateLocalStorage } = useAppVersion()

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

    if (DEBUG) {
      console.log('useServiceWorker: Sleeping 5 secs')
      await sleep(5000)
      console.log('useServiceWorker: Sleep done, proceeding with SW registration')
    }

    // const swPath = forceUpdate.value ? '/sw-reset.js' : '/sw-main.js'
    const swPath = '/sw.js'
    if (DEBUG) console.log(`useServiceWorker: Loading ${swPath} (version: ${appVersion.value}, force update: ${forceUpdate.value})`)

    fetch(swPath)
      .then((response) => response.text())
      .then((text) => (text.length > 0 ? registerServiceWorker(swPath) : console.error(`useServiceWorker: Error - ${swPath} exists but is empty`)))
      .catch((error) => console.error(`useServiceWorker: Error - ${swPath} not accessible`, error))
  }

  // Register the service worker
  const registerServiceWorker = (swPath: string) => {
    if (!('serviceWorker' in navigator)) return

    // Register service worker
    navigator.serviceWorker
      .register(`${swPath}?appVersion=${appVersion.value}&forceUpdate=${forceUpdate.value}`)
      .then((registration) => {
        if (DEBUG) console.log('useServiceWorker: Service Worker registered:', registration.scope)
        serviceWorkerRegistration.value = registration

        // Now set up listeners AFTER successful registration
        // setupServiceWorkerListeners(registration)
      })
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

  // Extract message handling to a separate function
  const handleServiceWorkerMessage = (event: any) => {
    // if (!DEBUG) return
    console.log('🔔 SW Message received:', event.data)
    console.log(event)
    console.log(navigator.serviceWorker)

    if (event.data?.type === 'SW_UPDATED') applyVersionUpdateLocalStorage()
  }

  /*
  const setupServiceWorkerListeners = (registration: ServiceWorkerRegistration) => {

    // Handle service worker updates
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (isRefreshing.value) return
      isRefreshing.value = true
      console.log('New service worker is controlling the page, reloading...')
      window.location.reload()
    })

    // Handle unhandled module errors that might be SW related
    window.addEventListener('error', (event) => {
      if (event.message?.includes('Failed to load module script')) {
        console.error('Module loading error detected, may be related to Service Worker:', event)

        // Consider unregistering the SW if this is a recurring problem
        if (window.sessionStorage.getItem('sw-module-errors')) {
          console.log('Multiple module errors detected, unregistering service worker...')
          unregisterServiceWorkers()
          window.sessionStorage.removeItem('sw-module-errors')
          window.location.reload()
        } else {
          window.sessionStorage.setItem('sw-module-errors', '1')
        }
      }
    })
  }
    */

  // Unregister all service workers
  const unregisterServiceWorkers = () => {
    if (!import.meta.client || !('serviceWorker' in navigator)) return

    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister()
        console.log('Unregistered service worker')
      }
    })
  }

  // Force the waiting service worker to activate and reload the page - moved from useAppVersion
  const applySWUpdate = async () => {
    if (!import.meta.client) return

    console.log('APPLY UPDATE')

    try {
      const registration = await navigator.serviceWorker.getRegistration()

      if (registration?.waiting) {
        // Tell the service worker to skipWaiting
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })

        // Set up page reload after service worker takes control
        let reloaded = false
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!reloaded) {
            reloaded = true
            console.log('New service worker in control, reloading page')
            console.log('DODODO RELOAD')
            // window.location.reload()
          }
        })
      } else {
        // If we don't have a waiting service worker, just reload
        //window.location.reload()
        console.log('AHAHA RELOAD')
      }
    } catch (err) {
      console.error('Error applying update:', err)
      // Fallback to simple reload
      // window.location.reload()
      console.log('CABACABA RELOAD')
    }
  }

  // Return the service worker registration and update functions for external use
  return {
    init,
    unregisterServiceWorkers,
    applySWUpdate,
  }
}
