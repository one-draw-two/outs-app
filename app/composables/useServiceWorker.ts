export const useServiceWorker = () => {
  // Get runtime config to check environment
  const config = useRuntimeConfig()

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
        window.location.reload()
      })

      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope)

          // Check for updates immediately
          registration.update()

          // Check for updates periodically
          setInterval(() => {
            registration.update()
            console.log('Checking for Service Worker updates...')
          }, 60 * 60 * 1000) // Check every hour

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing

            newWorker?.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                console.log('New service worker version installed, ready to activate')

                // Force activation
                newWorker.postMessage({ type: 'SKIP_WAITING' })
              }
            })
          })
        })
        .catch((error) => console.error('Service Worker registration failed:', error))
    }
  }
}
