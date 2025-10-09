import type { User, AuthResponseSuccess } from '~/../types'

const DEBUG = false
const TOKENS = true

export default function (res: AuthResponseSuccess, options?: { navToPath?: string; isToSaveOffline?: boolean; isUsingOfflineAuth?: boolean }) {
  if (DEBUG || TOKENS) console.log(`Initializing user with ${options?.isUsingOfflineAuth ? 'offline' : 'online'} response...`)
  if (DEBUG || TOKENS) console.log(res)
  useState<User>('user').value = res.data.user
  useState<String>('accessToken').value = res.data.accessToken
  useState<String>('powerSyncToken').value = res.data.powerSyncToken

  if (DEBUG) console.log('A')

  useDynamicPS(true)

  if (DEBUG) console.log('B')

  useGetPushTokens()

  if (DEBUG) console.log('C')
  useTabVisibility()

  if (DEBUG) console.log('D')
  if (DEBUG) console.log(options?.isToSaveOffline)

  if (options?.isToSaveOffline) useAuthStorage().saveAuthAndRefreshToken(res)

  if (DEBUG) console.log('E')
  if (DEBUG) console.log(options?.navToPath)

  if (options?.navToPath) navigateTo(options.navToPath, { replace: true })
}
