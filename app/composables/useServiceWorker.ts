// import { APP_VERSION } from '~/constants/version'

export const useServiceWorker = () => {
  // Get runtime config to check environment
  const config = useRuntimeConfig()

  const { appVersion } = useAppVersion()

  onMounted(() => {
    // Skip service worker in development mode
    if (config.public.dev) {
      console.log('Development mode: Service Worker registration skipped')

      // Unregister any existing service workers in dev mode
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister()
            console.log('Development mode: Unregistered service worker')
          }
        })
      }
      return
    }

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
  })

  // Extracted registration logic to a separate function
  const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      let refreshing = false

      // Handle service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return
        refreshing = true
        console.log('New service worker is controlling the page, reloading...')
        window.location.reload()
      })

      // Handle unhandled module errors that might be SW related
      window.addEventListener('error', (event) => {
        if (event.message && event.message.includes('Failed to load module script')) {
          console.error('Module loading error detected, may be related to Service Worker:', event)

          // Consider unregistering the SW if this is a recurring problem
          if (window.sessionStorage.getItem('sw-module-errors')) {
            console.log('Multiple module errors detected, unregistering service worker...')
            navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((reg) => reg.unregister()))
            window.sessionStorage.removeItem('sw-module-errors')
            window.location.reload()
          } else {
            window.sessionStorage.setItem('sw-module-errors', '1')
          }
        }
      })

      // Check if there's a waiting service worker and offer to update
      const checkForWaitingServiceWorker = (registration) => {
        // If there's a waiting SW, it means an update is available
        if (registration.waiting) {
          console.log('New service worker is waiting to activate')

          // Ask the user if they want to update (or auto-update)
          if (confirm('A new version of the app is available. Update now?')) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' })
          }

          // Alternatively, for silent updates, uncomment:
          // registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        }
      }

      // Register service worker
      navigator.serviceWorker
        // .register(`/sw.js?appVersion=${APP_VERSION}`)
        .register(`/sw.js?appVersion=${appVersion.value}`)
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope)

          // Check if there's a waiting service worker
          checkForWaitingServiceWorker(registration)

          // Check for updates immediately
          registration.update()

          // Check for updates periodically (every 15 minutes instead of every hour)
          setInterval(() => {
            registration.update()
            console.log('Checking for Service Worker updates...')
          }, 15 * 60 * 1000) // Check every 15 minutes

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            console.log('New service worker update found, installing...')

            newWorker?.addEventListener('statechange', () => {
              console.log(`Service worker state changed: ${newWorker.state}`)

              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                console.log('New service worker version installed, ready to activate')

                // Force activation immediately
                newWorker.postMessage({ type: 'SKIP_WAITING' })
              }
            })
          })
        })
        .catch((error) => console.error('Service Worker registration failed:', error))
    }
  }
}
