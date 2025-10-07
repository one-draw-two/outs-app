import { APP_VERSION, FORCE_UPDATE } from '~/constants/version'

const DEBUG = true

export const useAppVersion = () => {
  const appVersion = useState<string>('appVersion', () => APP_VERSION)
  const forceUpdate = useState<boolean>('forceUpdate', () => FORCE_UPDATE)

  const updateAvailable = useState<boolean>('versionUpdateAvailable', () => false)
  const storedVersion = useState<string | null>('storedAppVersion', () => null)

  const checkForUpdate = () => {
    storedVersion.value = localStorage.getItem('app-last-version')
    if (storedVersion.value && storedVersion.value !== appVersion.value) {
      if (DEBUG) console.log(`App version change detected: ${storedVersion.value} → ${appVersion.value}`)
      updateAvailable.value = true
    }
  }

  const applyVersionUpdateLocalStorage = () => {
    if (DEBUG) console.log(`Setting LS Version like this: ${storedVersion.value} → ${appVersion.value}`)
    localStorage.setItem('app-last-version', appVersion.value)
    updateAvailable.value = false

    // Maybe also reload the page to ensure everything is fresh (with a timeout?)
    // window.location.reload()
  }

  return {
    appVersion,
    forceUpdate,
    updateAvailable,
    storedVersion,
    checkForUpdate,
    applyVersionUpdateLocalStorage,
  }
}
