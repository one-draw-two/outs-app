import type { User, AuthResponseSuccess } from '~/types'

export default function (res: AuthResponseSuccess, navToPath?: string, isToSaveOffline?: boolean) {
  console.log('Initializing user with response...')
  console.log(res)
  useState<User>('user').value = res.data.user
  useState<String>('accessToken').value = res.data.accessToken
  useState<String>('powerSyncToken').value = res.data.powerSyncToken

  console.log('INIT USER NOW')
  useDynamicPS(true) // Parameters will be carried by useState<powerSyncParams>
  useGetPushTokens()
  useTabVisibility()

  if (isToSaveOffline) useAuthStorage().saveAuthAndRefreshToken(res)
  if (navigateTo) navigateTo(navToPath, { replace: true })
}
