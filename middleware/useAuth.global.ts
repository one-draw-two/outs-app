import type { AuthResponse } from '~/types'

export default defineNuxtRouteMiddleware(async (to, _) => {
  if (useState('user').value) return
  if (to.meta.isPublic) return

  try {
    const storedData = await useAuthStorage().getStoredAuth()
    if (storedData) {
      const res: AuthResponse = await useSecureFetch('refresh', 'auth', 'post')
      console.log('AUTH: NONETHELESS REFRESH RESPONSE', res)

      useInitUser({ success: true, data: storedData })
      return
    }

    console.log('AUTH: DOING REFRESH NOW')
    const res: AuthResponse = await useSecureFetch('refresh', 'auth', 'post')
    console.log('AUTH: REFRESH RESPONSE', res)

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
