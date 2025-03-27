import type { User, AuthResponseSuccess } from '~/types'

export default function (res: AuthResponseSuccess, navToPath?: string, isToSaveOffline?: boolean) {
  console.log('Initializing user with response...')
  console.log(res)
  useState<User>('user').value = res.data.user
  useState<String>('accessToken').value = res.data.accessToken
  useState<String>('powerSyncToken').value = res.data.powerSyncToken

  useDynamicPS({})
  useGetPushTokens({})

  if (isToSaveOffline) useAuthStorage().saveAuth(res)
  if (navigateTo) navigateTo(navToPath, { replace: true })
}
