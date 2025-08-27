import { APP_VERSION } from '~/constants/version'

export const useAppVersion = () => {
  // Make app version available globally
  const appVersion = useState('appVersion', () => APP_VERSION)
  const swVersion = useState('swVersion', () => null)

  const checkSwVersion = async () => {
    if (!process.client) return

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
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

      // Send message to service worker
      navigator.serviceWorker.controller.postMessage({ type: 'GET_VERSION' }, [messageChannel.port2])

      // Wait for response with timeout
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve('Unknown'), 1000))
      swVersion.value = await Promise.race([versionPromise, timeoutPromise])
    }
  }

  return {
    appVersion,
    swVersion,
    checkSwVersion,
  }
}
