import { APP_VERSION, FORCE_UPDATE } from '~/constants/version'

export const useAppVersion = () => {
  // Make app version available globally
  const appVersion = useState<string>('appVersion', () => APP_VERSION)
  const forceUpdate = useState<boolean>('forceUpdate', () => FORCE_UPDATE)
  const swVersion = useState<string | null>('swVersion', () => null)
  const updateAvailable = useState<boolean>('updateAvailable', () => false)
  const hasWaitingSW = useState<boolean>('hasWaitingSW', () => false)
  const lastChecked = ref<Date | null>(null)

  // Check if SW version matches app version
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
  }

  // Helper function to get version from a service worker
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
      updateAvailable.value = swVersion.value !== APP_VERSION

      // Log if there's an update
      if (updateAvailable.value) {
        console.log(`Update available: APP ${APP_VERSION} vs SW ${swVersion.value}`)
      }
    }

    // Update the waiting status if provided
    if (data.hasWaiting !== undefined) {
      hasWaitingSW.value = data.hasWaiting
    }

    return data
  }

  // Set up listeners for service worker messages about updates
  const setupUpdateListener = () => {
    if (!import.meta.client || !('serviceWorker' in navigator)) return

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'SW_UPDATED') {
        swVersion.value = event.data.version
        updateAvailable.value = true
        hasWaitingSW.value = true
        console.log(`Service worker update available: ${event.data.version}`)
      }
    })
  }

  // Force the waiting service worker to activate and reload the page
  const applyUpdate = async () => {
    if (!import.meta.client) return

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
            window.location.reload()
          }
        })
      } else {
        // If we don't have a waiting service worker, just reload
        window.location.reload()
      }
    } catch (err) {
      console.error('Error applying update:', err)
      // Fallback to simple reload
      window.location.reload()
    }
  }

  // Set up initial listeners
  if (import.meta.client) {
    setupUpdateListener()
  }

  return {
    appVersion,
    forceUpdate,
    swVersion,
    updateAvailable,
    hasWaitingSW,
    lastChecked,
    checkSwVersion,
    applyUpdate,
  }
}
