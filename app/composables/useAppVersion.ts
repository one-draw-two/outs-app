import { APP_VERSION } from '~/constants/version'
import { ref } from 'vue'

export const useAppVersion = () => {
  // Make app version available globally
  const appVersion = useState<string>('appVersion', () => APP_VERSION)
  const swVersion = useState<string | null>('swVersion', () => null)
  const updateAvailable = useState<boolean>('updateAvailable', () => false)
  const hasWaitingSW = useState<boolean>('hasWaitingSW', () => false)
  const lastChecked = ref<Date | null>(null)

  // Check if SW version matches app version
  const checkSwVersion = async () => {
    if (!process.client) return
    const { startTimer, endTimer } = usePerformanceDebug()
    startTimer('sw-version-check')

    if ('serviceWorker' in navigator) {
      try {
        // Check for updates
        const registration = await navigator.serviceWorker.getRegistration()

        if (registration) {
          // If there's already an update waiting, tell it not to use default refresh
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'PREVENT_DEFAULT_REFRESH' })
          }

          // Check if there's a waiting service worker
          hasWaitingSW.value = !!registration.waiting

          // Trigger update check, but don't force it to activate
          // Use the onupdatefound event to catch any new updates
          const updatePromise = new Promise((resolve) => {
            const updateListener = () => {
              registration.removeEventListener('updatefound', updateListener)
              resolve(null)
            }
            registration.addEventListener('updatefound', updateListener)

            // Set a timeout to resolve the promise anyway
            setTimeout(() => {
              registration.removeEventListener('updatefound', updateListener)
              resolve(null)
            }, 5000)
          })

          // Begin the update check
          registration.update()

          // Wait for any updates to be found
          await updatePromise

          // If there's a waiting service worker, we have an update
          if (registration.waiting) {
            // Prevent default refresh behavior
            registration.waiting.postMessage({ type: 'PREVENT_DEFAULT_REFRESH' })

            updateAvailable.value = true
            // Try to get version from the waiting service worker
            await getVersionFromSW(registration.waiting)
            return
          }

          // Otherwise check with the active service worker
          if (navigator.serviceWorker.controller) {
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

    endTimer('sw-version-check')
  }

  // Helper function to get version from a service worker
  const getVersionFromSW = async (targetSW: any) => {
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
    // This will now work correctly with the updated type
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
  }

  // Enhance the setupUpdateListener function to prevent default prompts
  const setupUpdateListener = () => {
    if (!process.client || !('serviceWorker' in navigator)) return

    // Listen for new service workers
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('New service worker controller')
      // If we get a controllerchange and we're not reloading,
      // it means a new service worker has taken control without our explicit activation
      setTimeout(() => checkSwVersion(), 1000)
    })

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SW_UPDATED') {
        swVersion.value = event.data.version
        updateAvailable.value = true
        hasWaitingSW.value = true
        console.log(`Service worker update available: ${event.data.version}`)
      }
    })

    // Also set up an updatefound listener on the registration
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing

        if (newWorker) {
          console.log('New service worker found')

          // Immediately tell the new worker to not trigger default refresh
          newWorker.postMessage({ type: 'PREVENT_DEFAULT_REFRESH' })

          newWorker.addEventListener('statechange', () => {
            console.log(`Service worker state changed to: ${newWorker.state}`)

            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New service worker installed and waiting')

              // Prevent default refresh behavior
              newWorker.postMessage({ type: 'PREVENT_DEFAULT_REFRESH' })

              hasWaitingSW.value = true
              updateAvailable.value = true
              checkSwVersion() // Get the version
            }
          })
        }
      })
    })
  }

  // Force the waiting service worker to activate and reload the page
  const applyUpdate = async () => {
    if (!process.client) return

    try {
      const registration = await navigator.serviceWorker.getRegistration()

      if (registration && registration.waiting) {
        // Tell the service worker to skipWaiting
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })

        // The service worker will take control after skipWaiting
        // We'll reload the page after the new service worker takes control
        let reloaded = false

        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!reloaded) {
            reloaded = true
            console.log('New service worker in control, reloading page')
            window.location.reload()
          }
        })
      } else {
        // If we don't have a waiting service worker for some reason, just reload
        window.location.reload()
      }
    } catch (err) {
      console.error('Error applying update:', err)
      // Fallback to simple reload
      window.location.reload()
    }
  }

  // Check version initially
  if (process.client) {
    // Setup listener on import
    setupUpdateListener()

    // Do initial check after a short delay
    setTimeout(() => checkSwVersion(), 2000)

    // Schedule periodic checks
    setInterval(() => checkSwVersion(), 15 * 60 * 1000) // Check every 15 minutes
  }

  return {
    appVersion,
    swVersion,
    updateAvailable,
    hasWaitingSW,
    lastChecked,
    checkSwVersion,
    applyUpdate,
  }
}
