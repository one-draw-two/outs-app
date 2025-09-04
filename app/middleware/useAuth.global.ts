export default defineNuxtRouteMiddleware(async (to, _) => {
  const { startTimer, endTimer } = usePerformanceDebug()
  startTimer('auth-middleware')

  const authStorage = useAuthStorage()

  if (useState('user').value) {
    endTimer('auth-middleware')
    return
  }

  if (to.meta.isPublic) {
    endTimer('auth-middleware')
    return
  }

  try {
    startTimer('auth-storage-retrieval')
    const storedData = await authStorage.getStoredAuth() // Note: Clears auth in useAuthStorage if doesnt return successful
    endTimer('auth-storage-retrieval')

    if (storedData) {
      endTimer('auth-middleware')
      return useInitUser({ success: true, data: storedData })
    }

    /*
    const storedRefreshToken = await authStorage.getRefreshToken()
    if (!storedRefreshToken) return navigateTo('/access/login', { replace: true })
    const res: AuthResponse = await useSecureFetch('refresh', 'auth', 'post', { refreshToken: storedRefreshToken })
    */

    startTimer('auth-refresh')
    const res = await useAuthRefresh()
    endTimer('auth-refresh')

    if (!res.success) {
      console.error('Authentication failed:', res.message)
      endTimer('auth-middleware')
      return navigateTo('/access/login', { replace: true })
    }

    endTimer('auth-middleware')
    useInitUser(res, undefined, true)
  } catch (error) {
    console.error('Authentication error:', error)
    endTimer('auth-middleware')
    return navigateTo('/access/login', { replace: true })
  }
})
