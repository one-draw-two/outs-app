import type { AuthResponse } from '~/types'

export default defineNuxtRouteMiddleware(async (to, _) => {
  if (useState('user').value) return
  if (to.meta.isPublic) return

  try {
    const storedData = await useAuthStorage().getStoredAuth()
    if (storedData) {
      useInitUser({ success: true, data: storedData })
      return
    }

    const res: AuthResponse = await useSecureFetch('refresh', 'auth', 'post')

    if (!res.success) {
      console.error('Authentication failed:', res.message)
      return navigateTo('/access/login', { replace: true })
    }

    useInitUser(res, undefined, true)
  } catch (error) {
    console.error('Authentication error:', error)
    return navigateTo('/access/login', { replace: true })
  }
})
