import { version, dependencies } from '../../package.json' // About 30b extra load (insignificant so use it)

const POWERSYNC_VERSION = dependencies['@powersync/web'].replace('^', '')

const DEBUG = false

const bc = new BroadcastChannel('sync-channel')

export const useAppVersion = () => {
  const Preferences = usePreferences()
  const VERSION_KEY = 'outs-appVersion'

  const appVersion = useState<string>('appVersion', () => version)
  const psVersion = useState<string>('psVersion', () => POWERSYNC_VERSION)

  const updateAvailable = useState<boolean>('versionUpdateAvailable', () => false)
  const storedVersion = useState<string | null>('storedAppVersion', () => null)

  const checkForUpdate = async () => {
    const { value } = await Preferences.get({ key: VERSION_KEY })
    storedVersion.value = value

    if (!storedVersion.value || storedVersion.value !== appVersion.value) {
      if (DEBUG) console.log(`App version change detected: ${storedVersion.value || 'none'} → ${appVersion.value}`)
      updateAvailable.value = true
    }

    bc.onmessage = (event) => {
      console.log('BroadcastChannel Message received:', event.data)
      if (event.data?.type === 'updateVersion') console.log('Broadcast updateVersion to ' + event.data.version)
    }

    /*
    window.addEventListener('storage', (event) => {
      console.log('Storage')
      console.log(event)
    })
    */
  }

  const applyVersionUpdate = async (to: string) => {
    if (DEBUG) console.log(`Setting LS Version to: ${to} /// ${storedVersion.value} → ${appVersion.value}`)

    // console.log('IN APPLY SO GUDUZ')
    // bc.postMessage({ type: 'updateVersion', version: to })

    await Preferences.set({ key: VERSION_KEY, value: to })
    updateAvailable.value = false

    // console.log('Restarting in 3 seconds...')
    // setTimeout(() => window.location.reload(), 3000)
  }

  return {
    appVersion,
    psVersion,
    updateAvailable,
    storedVersion,
    checkForUpdate,
    applyVersionUpdate,
  }
}
