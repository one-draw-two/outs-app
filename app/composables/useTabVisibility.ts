import type { User } from '~/../types'

const INACTIVE_TIME_LIMIT = 1 * 60 * 1000 // 1 minute in milliseconds
const DEBUG = true

export default function () {
  const { forceReconnect, refreshPowerSyncToken } = useDynamicPS()

  const visibilityFunc = async () => {
    if (document.visibilityState == 'visible') {
      if (DEBUG) console.log('VisibilityChange: Tab is active, init dynamicPS')
      if (DEBUG) console.log(`PS connected already?: ${useState<boolean>('network:powerSyncConnected').value}`)

      if (!useState<boolean>('network:powerSyncConnected').value) {
        const inactiveTime = Date.now() - (useState<number>('lastTabActiveTime').value || 0)
        if (inactiveTime > INACTIVE_TIME_LIMIT) {
          await refreshPowerSyncToken()
          await forceReconnect()
        }
      }

      useState<number>('lastTabActiveTime').value = Date.now()
    } else {
      if (DEBUG) console.log('VisibilityChange: Tab is inactive')
    }
  }

  watch(
    () => useState<User>('user').value,
    (to) => document?.[to ? 'addEventListener' : 'removeEventListener']('visibilitychange', visibilityFunc, false),
    { immediate: true }
  )
}
