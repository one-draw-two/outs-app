export const useClearUser = () => {
  const DEBUG = false
  const TIMEOUT = 4000

  const { clearAuth, clearRefresh } = useAuthStorage()
  const { $capacitor, $db, $vfsPurge }: any = useNuxtApp()

  const clearPowersyncData = async () => {
    if (DEBUG) console.log('Starting PowerSync cleanup...')

    try {
      // First try normal disconnection with timeout
      const disconnectPromise = $db.disconnectAndClear()
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('PowerSync disconnect timeout')), TIMEOUT))

      const result = await Promise.race([disconnectPromise, timeoutPromise])
      if (DEBUG) console.log('PowerSync disconnect result:', result)
      return true
    } catch (error) {
      console.error('Normal disconnect failed:', error)

      // If normal disconnect fails, try force purging using the global utility
      if (DEBUG) console.log('Attempting forced VFS purge...')
      await $vfsPurge()
      return true
    }
  }

  const logOutUser = async () => {
    if (DEBUG) console.log('Clearing user data...')

    try {
      await useSecureFetch('logout', 'auth', 'post', { fcmToken: useState<string>('fcmToken').value })

      // Clear all state
      useState('user').value = null
      useState('accessToken').value = null
      useState('powerSyncToken').value = null
      useState('fcmToken').value = null

      // Handle push notifications
      const unregresp = $capacitor.$platform !== 'web' ? await $capacitor.$pushNotifications.unregister() : null

      // Clear auth
      clearAuth()
      clearRefresh()

      if (DEBUG) console.log('User data cleared successfully')
      return navigateTo('/access/login')
    } catch (error) {
      console.error('Error during logout:', error)
      throw error
    }
  }

  return {
    logOutUser,
    clearPowersyncData,
  }
}
