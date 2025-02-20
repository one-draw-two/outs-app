import type { User } from '~/types'

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('---USEAUTH')
  console.log(to)
  console.log(from)
  console.log('----')

  if (to.meta.isPublic) return

  try {
    // Try initial authentication
    let res: { data: { user: User }; success: boolean } = await useSecureFetch('init', 'get', null, null, true)

    // If initial request fails, try refresh and use its response
    if (!res.success) {
      console.log('Access token expired, attempting refresh...')
      res = await useSecureFetch('refresh', 'post', null, null, true)

      if (!res.success) {
        console.log('Token refresh failed, redirecting to login...')
        return navigateTo('/access/login')
      }
      console.log('Token refresh successful')
    }

    console.log('User is authenticated:', res.data.user)
    return
  } catch (error) {
    console.error('Authentication error:', error)
    return navigateTo('/access/login')
  }
})
