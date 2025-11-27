export default defineNuxtRouteMiddleware(async (to, _) => {
  const authStorage = useAuthStorage()

  if (useState('user').value || to.meta.isPublic) return

  console.log('No user in state, checking stored auth...')

  try {
    const storedData = await authStorage.getStoredAuth() // Note: Clears auth in useAuthStorage if doesnt return successful

    console.log('Stored auth data:', storedData)

    if (storedData) return useInitUser({ success: true, data: storedData }, { isUsingOfflineAuth: true })

    const res = await useAuthRefresh()

    if (!res.success) {
      console.error('Authentication failed:', res.message)

      return navigateTo('/access/login', { replace: true })
    }

    useInitUser(res, { isToSaveOffline: true }) // Note, isToSaveOffline: true is added while debugging 27/11/25
  } catch (error) {
    console.error('Authentication error:', error)

    return navigateTo('/access/login', { replace: true })
  }
})
