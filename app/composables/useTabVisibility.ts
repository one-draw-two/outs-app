/*
import type { User } from '~/../types'

export default function () {
  const visibilityFunc = () => {
    if (document.visibilityState == 'visible') {
      console.log('VisibilityChange: Tab is active, init dynamicPS')
      console.log(`PS connected already?: ${useState<boolean>('network:powerSyncConnected').value}`)
      if (!useState<boolean>('network:powerSyncConnected').value) useState<any>('powerSyncParams').value = { ...useState<any>('powerSyncParams').value }
    } else {
      console.log('VisibilityChange: Tab is inactive')
    }
  }

  watch(
    () => useState<User>('user').value,
    (to) => document?.[to ? 'addEventListener' : 'removeEventListener']('visibilitychange', visibilityFunc, false),
    { immediate: true }
  )
}
*/

import type { User } from '~/../types'

const INACTIVE_TIME_LIMIT = 1 * 60 * 1000 // 50 minutes in milliseconds
// const INACTIVE_TIME_LIMIT = 30 * 60 * 1000 // Increase to 30 minutes (from 1 minute) (will test this after Service Worker changes are done)
const DEBUG = false

export default function () {
  const visibilityFunc = async () => {
    if (document.visibilityState == 'visible') {
      if (DEBUG) console.log('VisibilityChange: Tab is active, init dynamicPS')
      if (DEBUG) console.log(`PS connected already?: ${useState<boolean>('network:powerSyncConnected').value}`)

      if (!useState<boolean>('network:powerSyncConnected').value) {
        const inactiveTime = Date.now() - (useState<number>('lastTabActiveTime').value || 0)
        if (inactiveTime > INACTIVE_TIME_LIMIT) await refreshPowerSyncToken()
        useDynamicPS().forceReconnect()
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

async function refreshPowerSyncToken() {
  if (DEBUG) console.log('Refreshing PowerSync token... (New kemal yes kemal)')

  const res = await useAuthRefresh()
  if (res.success && res.data?.powerSyncToken) {
    useState<String>('powerSyncToken').value = res.data.powerSyncToken
    return res
  }
}
