import { APP_VERSION } from '~/constants/version'
import { ref } from 'vue'

export const useAppVersion = () => {
  // Make app version available globally
  const appVersion = useState('appVersion', () => APP_VERSION)
  const swVersion = useState('swVersion', () => null)
  const updateAvailable = useState('updateAvailable', () => false)
  const lastChecked = ref<Date | null>(null)

  // Check if SW version matches app version
  const checkSwVersion = async () => {
    if (!process.client) return
    const { startTimer, endTimer } = usePerformanceDebug()
    startTimer('sw-version-check')

    if ('serviceWorker' in navigator) {
      try {
        // Force registration check to trigger update check
        const registration = await navigator.serviceWorker.getRegistration()

        if (registration) {
          // Check for updates
          registration.update()

          // Create a message channel
          const messageChannel = new MessageChannel()

          // Set up a promise to receive the version
          const versionPromise = new Promise((resolve) => {
            messageChannel.port1.onmessage = (event) => {
              if (event.data && event.data.version) {
                resolve(event.data.version)
              }
            }
          })

          // Only send message if controller exists
          if (navigator.serviceWorker.controller) {
            // Send message to service worker
            navigator.serviceWorker.controller.postMessage({ type: 'GET_VERSION' }, [messageChannel.port2])

            // Wait for response with timeout
            const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve('Unknown'), 1000))

            const version = await Promise.race([versionPromise, timeoutPromise])
            swVersion.value = version as string

            // Compare versions to detect updates
            if (swVersion.value && swVersion.value !== 'Unknown') {
              updateAvailable.value = swVersion.value !== APP_VERSION
              if (updateAvailable.value) {
                console.log(`Update available: APP ${APP_VERSION} vs SW ${swVersion.value}`)
              }
            }
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

  // Handle update available from service worker
  const setupUpdateListener = () => {
    if (!process.client || !('serviceWorker' in navigator)) return

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SW_UPDATED') {
        swVersion.value = event.data.version
        updateAvailable.value = true
        console.log(`Service worker updated to version: ${event.data.version}`)
      }
    })

    // Also listen for the controllerchange event which fires when a new SW takes control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('New service worker controller')
      setTimeout(() => checkSwVersion(), 1000)
    })
  }

  // Force reload the page to apply service worker update
  const applyUpdate = () => {
    if (process.client) {
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
    lastChecked,
    checkSwVersion,
    applyUpdate,
  }
}
