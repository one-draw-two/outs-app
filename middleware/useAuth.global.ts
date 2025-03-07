import type { AuthResponseSuccess } from '~/types'

export default defineNuxtRouteMiddleware(async (to, _) => {
  const { getStoredAuth, saveAuth } = useAuthStorage()

  if (useState('user').value) return
  if (to.meta.isPublic) return

  try {
    const storedData = await getStoredAuth()
    if (storedData) {
      console.log('Wow we have stored data:', storedData)
      useInitUser({ success: true, data: storedData })
      return
    }

    const res: AuthResponseSuccess = await useSecureFetch('refresh', 'auth', 'post')
    if (!res.success) return navigateTo('/access/login', { replace: true })

    await saveAuth(res)
    useInitUser(res)
  } catch (error) {
    console.error('Authentication error:', error)
    return navigateTo('/access/login', { replace: true })
  }
})
