import type { User, AuthResponseSuccess } from '~/../types'

const DEBUG = false
const TOKENS = true

export default function (res: AuthResponseSuccess, navToPath?: string, isToSaveOffline?: boolean) {
  if (DEBUG) console.log('Initializing user with response...')
  if (DEBUG || TOKENS) console.log(res)
  useState<User>('user').value = res.data.user
  useState<String>('accessToken').value = res.data.accessToken
  useState<String>('powerSyncToken').value = res.data.powerSyncToken

  console.log('User initialized')

  const theme = res.data.user?.settings?.ui?.theme || 'system'
  console.log(`Setting theme to: ${theme}`)
  useUiTheme().setTheme(theme)

  if (DEBUG) console.log('A')

  useDynamicPS(true) // Parameters will be carried by useState<powerSyncParams>
  if (DEBUG) console.log('B')
  useGetPushTokens()
  if (DEBUG) console.log('C')
  useTabVisibility()

  if (DEBUG) console.log('D')
  if (DEBUG) console.log(isToSaveOffline)

  if (isToSaveOffline) useAuthStorage().saveAuthAndRefreshToken(res)
  if (DEBUG) console.log('E')
  if (DEBUG) console.log(navToPath)

  if (navigateTo) navigateTo(navToPath, { replace: true })
}
