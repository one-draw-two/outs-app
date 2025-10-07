export const useServiceWorker = () => {
  const DEBUG = false

  // Get runtime config to check environment
  const config = useRuntimeConfig()

  // Get app version from useAppVersion (single source of truth)
  const { appVersion, forceUpdate, applyVersionUpdateLocalStorage } = useAppVersion()

  // Service worker state
  const serviceWorkerRegistration = ref<ServiceWorkerRegistration | null>(null)

  const isInitialized = ref(false)
  const isRefreshing = ref(false)

  // Version and update states - moved from useAppVersion
  const swVersion = useState<string | null>('swVersion', () => null)
  const updateAvailable = useState<boolean>('updateAvailable', () => false)
  const hasWaitingSW = useState<boolean>('hasWaitingSW', () => false)
  const lastChecked = ref<Date | null>(null)

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

        // Check for updates
        // checkSwVersion(registration)
        // Set up update detection
        // setupUpdateDetection(registration)
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

    console.log('The received controller is:')
    console.log(navigator.serviceWorker)
    console.log(navigator.serviceWorker.controller)

    if (event.data?.type === 'SW_UPDATED') applyVersionUpdateLocalStorage()

    /*
    if (event.data?.type === 'SW_UPDATED') {
      swVersion.value = event.data.version
      updateAvailable.value = true
      hasWaitingSW.value = true
      console.log(`Service worker update available: ${event.data.version}`)
    }

    if (event.data?.type === 'RELOAD_PAGE') {
      console.log(`Received reload request from service worker v${event.data.version}`)

      let countdown = 5
      console.log(`Page will reload in ${countdown} seconds...`)

      const countdownInterval = setInterval(() => {
        countdown--
        console.log(`Page will reload in ${countdown} seconds...`)

        if (countdown <= 0) {
          clearInterval(countdownInterval)
          window.location.reload()
        }
      }, 1000)
    }
    */
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

  // Check if SW version matches app version - moved from useAppVersion
  const checkSwVersion = async (registration?: ServiceWorkerRegistration) => {
    if (!import.meta.client) return

    if (!('serviceWorker' in navigator)) return

    try {
      // Use the provided registration or get one
      const reg = registration || (await navigator.serviceWorker.getRegistration())

      if (reg) {
        // If there's a waiting service worker, we have an update
        if (reg.waiting) {
          // Prevent default refresh behavior
          reg.waiting.postMessage({ type: 'PREVENT_DEFAULT_REFRESH' })

          hasWaitingSW.value = true
          updateAvailable.value = true

          // Get version from waiting service worker
          await getVersionFromSW(reg.waiting)
        }
        // Otherwise check with the active service worker
        else if (navigator.serviceWorker.controller) {
          await getVersionFromSW(navigator.serviceWorker.controller)
        } else {
          console.log('Service worker controller not yet active')
          swVersion.value = 'Initializing'
        }
      }
    } catch (err) {
      console.error('Error checking service worker version:', err)
      swVersion.value = 'Error'
    }

    lastChecked.value = new Date()

    // Periodic checks
    setTimeout(() => {
      if (registration) {
        registration.update().then(() => {
          console.log('Checking for Service Worker updates...')
          checkSwVersion(registration)
        })
      }
    }, 15 * 60 * 1000) // Check every 15 minutes
  }

  // Helper function to get version from a service worker - moved from useAppVersion
  const getVersionFromSW = async (targetSW: ServiceWorker) => {
    // Create a message channel
    const messageChannel = new MessageChannel()

    // Set up a promise to receive the version
    const versionPromise = new Promise((resolve) => {
      messageChannel.port1.onmessage = (event) => {
        if (event.data) {
          resolve(event.data)
        }
      }
    })

    // Send message to service worker
    targetSW.postMessage({ type: 'CHECK_UPDATE' }, [messageChannel.port2])

    // Wait for response with timeout
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ version: 'Unknown' }), 1000))

    const data = (await Promise.race([versionPromise, timeoutPromise])) as any
    swVersion.value = data.version

    // If we have version information, check if it's different from app version
    if (swVersion.value && swVersion.value !== 'Unknown' && swVersion.value !== 'Initializing') {
      updateAvailable.value = swVersion.value !== appVersion.value

      // Log if there's an update
      if (updateAvailable.value) {
        console.log(`Update available: APP ${appVersion.value} vs SW ${swVersion.value}`)
      }
    }

    // Update the waiting status if provided
    if (data.hasWaiting !== undefined) {
      hasWaitingSW.value = data.hasWaiting
    }

    return data
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

  /*
  // Set up detection for service worker updates
  const setupUpdateDetection = (registration: ServiceWorkerRegistration) => {
    // Prevent default browser refresh for any waiting service worker
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'PREVENT_DEFAULT_REFRESH' })
    }

    // Listen for new service workers
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing

      if (newWorker) {
        console.log('New service worker update found, installing...')

        // Immediately prevent default refresh
        newWorker.postMessage({ type: 'PREVENT_DEFAULT_REFRESH' })

        newWorker.addEventListener('statechange', () => {
          console.log(`Service worker state changed: ${newWorker.state}`)

          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New service worker installed and waiting')

            // Prevent default browser refresh
            newWorker.postMessage({ type: 'PREVENT_DEFAULT_REFRESH' })

            // Check for updates with the new service worker
            checkSwVersion(registration)
          }
        })
      }
    })
  }
  */

  // Return the service worker registration and update functions for external use
  return {
    init,
    unregisterServiceWorkers,
    swVersion,
    updateAvailable,
    hasWaitingSW,
    lastChecked,
    applySWUpdate,
  }
}
