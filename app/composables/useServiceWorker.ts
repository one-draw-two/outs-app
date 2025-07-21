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

    // Only register in production mode
    if ('serviceWorker' in navigator) {
      // Force update for existing registrations
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.update()
          console.log('Updating service worker registration')
        }
      })

      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope)
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }
  })
}
