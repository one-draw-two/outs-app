import type { User, AuthResponseSuccess } from '~/../types'

const DEBUG = false
const TOKENS = true

export default function (res: AuthResponseSuccess, navToPath?: string, isToSaveOffline?: boolean) {
  usePerformanceDebug().startTimer('user-init')
  if (DEBUG) console.log('Initializing user with response...')
  if (DEBUG || TOKENS) console.log(res)
  useState<User>('user').value = res.data.user
  useState<String>('accessToken').value = res.data.accessToken
  useState<String>('powerSyncToken').value = res.data.powerSyncToken

  if (DEBUG) console.log('A')

  usePerformanceDebug().startTimer('dynamic-ps-init')
  useDynamicPS(true) // Parameters will be carried by useState<powerSyncParams>
  usePerformanceDebug().endTimer('dynamic-ps-init')

  if (DEBUG) console.log('B')
  usePerformanceDebug().startTimer('get-push-tokens')
  useGetPushTokens()
  usePerformanceDebug().endTimer('get-push-tokens')

  if (DEBUG) console.log('C')
  useTabVisibility()

  if (DEBUG) console.log('D')
  if (DEBUG) console.log(isToSaveOffline)

  if (isToSaveOffline) {
    usePerformanceDebug().startTimer('save-auth-token')
    useAuthStorage().saveAuthAndRefreshToken(res)
    usePerformanceDebug().endTimer('save-auth-token')
  }

  if (DEBUG) console.log('E')
  if (DEBUG) console.log(navToPath)

  usePerformanceDebug().endTimer('user-init')
  if (navigateTo) navigateTo(navToPath, { replace: true })
}
