import { ref } from 'vue'

export const useServiceWorker = () => {
  // Get runtime config to check environment
  const config = useRuntimeConfig()

  // Service worker state
  const serviceWorkerRegistration = ref<ServiceWorkerRegistration | null>(null)
  const isRefreshing = ref(false)

  // Initialize the service worker
  const init = () => {
    if (!process.client) return

    // Skip service worker in development mode
    if (config.public.dev) {
      console.log('Development mode: Service Worker registration skipped')
      unregisterServiceWorkers()
      return
    }

    checkServiceWorkerFileAvailability()
  }

  // Check if the service worker file exists
  const checkServiceWorkerFileAvailability = () => {
    console.log('Checking service worker file availability...')
    fetch('/sw.js')
      .then((response) => {
        console.log(`Service worker file check: ${response.status} ${response.statusText}`)
        return response.text()
      })
      .then((text) => {
        console.log(`Service worker file size: ${text.length} bytes`)

        // Only register if the file exists and has content
        if (text.length > 0) {
          registerServiceWorker()
        } else {
          console.error('Service worker file exists but is empty')
        }
      })
      .catch((error) => {
        console.error('Service worker file not accessible:', error)
      })
  }

  // Unregister all service workers
  const unregisterServiceWorkers = () => {
    if (!process.client || !('serviceWorker' in navigator)) return

    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister()
        console.log('Unregistered service worker')
      }
    })
  }

  // Register the service worker
  const registerServiceWorker = () => {
    if (!process.client || !('serviceWorker' in navigator)) return

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

    // Get app version from useAppVersion
    const { appVersion } = useAppVersion()

    // Register service worker
    navigator.serviceWorker
      .register(`/sw.js?appVersion=${appVersion.value}`)
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope)
        serviceWorkerRegistration.value = registration

        // Tell the version management to check for updates
        notifyVersionManager(registration)

        // Set up update detection
        setupUpdateDetection(registration)
      })
      .catch((error) => console.error('Service Worker registration failed:', error))
  }

  // Notify the version manager about the service worker
  const notifyVersionManager = (registration: ServiceWorkerRegistration) => {
    const { checkSwVersion } = useAppVersion()

    // Initial check
    checkSwVersion(registration)

    // Periodic checks
    setInterval(() => {
      registration.update().then(() => {
        console.log('Checking for Service Worker updates...')
        checkSwVersion(registration)
      })
    }, 15 * 60 * 1000) // Check every 15 minutes
  }

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

            // Notify version manager about the update
            const { checkSwVersion } = useAppVersion()
            checkSwVersion(registration)
          }
        })
      }
    })
  }

  // Initialize on component mount
  onMounted(() => {
    init()
  })

  // Return the service worker registration for external use
  return {
    serviceWorkerRegistration,
    unregisterServiceWorkers,
  }
}
