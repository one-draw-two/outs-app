import type { User, AuthResponseSuccess } from '~/types'

export default defineNuxtRouteMiddleware(async (to, _) => {
  if (useState('user').value) return // Need to perform this only once

  if (to.meta.isPublic) return // Dont do it in public routes (avoid infinite loop)

  try {
    let res: AuthResponseSuccess = await useSecureFetch('init', 'auth')

    if (!res.success) {
      console.log('Access token expired, attempting refresh...')
      res = await useSecureFetch('refresh', 'auth', 'post')
      if (!res.success) return navigateTo('/access/login', { replace: true })
    }

    /*
    useState<User>('user').value = res.data.user
    const { $db }: any = useNuxtApp()
    const connector = new Connector(res.data.powerSyncToken)
    $db.connect(connector)
    */

    useInitUser(res)

    return
  } catch (error) {
    console.error('Authentication error:', error)
    return navigateTo('/access/login', { replace: true })
  }
})
