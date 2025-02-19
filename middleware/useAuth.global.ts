import type { User } from '~/types'

// https://github.com/transistorsoft/capacitor-background-fetch

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('---USEAUTH')
  console.log(to)
  console.log(from)
  console.log('----')

  const res: { user: User } = await useSecureFetch(`init`, 'get', null, null, true)

  console.log('Response is and try again')
  console.log(res)
})
