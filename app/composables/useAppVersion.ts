import { APP_VERSION } from '~/constants/version'

const DEBUG = false

export const useAppVersion = () => {
  const appVersion = useState<string>('appVersion', () => APP_VERSION)

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
    setTimeout(() => window.location.reload(), 2000)
  }

  return {
    appVersion,
    updateAvailable,
    storedVersion,
    checkForUpdate,
    applyVersionUpdateLocalStorage,
  }
}
