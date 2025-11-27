import type { SyncStatus } from '@powersync/web'
import { Connector } from '~/../powersync/Connector'

const DEBUG = true
const THROTTLE = 100

let watchersInitialized = false
let errorCount = 0

export default function (initialize?: boolean) {
  const { $db }: any = useNuxtApp()
  const powerSyncToken = useState<String>('powerSyncToken')

  const connected = useState<boolean>('network:ps:powerSyncConnected', () => false)
  // const connectionType = useState<string>('network:ps:connectionType', () => 'unknown')
  const lastSyncedTime = useState<string | null>('network:ps:lastSyncedTime', () => null)
  const lastSyncedDate = useState<Date | null>('network:ps:lastSyncedDate', () => null)

  const lastConnectionTime = ref(0)
  const pendingConnectionTimeout = ref<NodeJS.Timeout | null>(null)
  const lastParams = ref<Record<string, any>>({})

  const updatepsParams = (newParams: Record<string, any>) => (useState<Record<string, any>>('psParams').value = { ...(useState<Record<string, any>>('psParams').value || {}), ...newParams })

  const forceReconnect = () => powerSyncToken.value && connectWithThrottle(useState<Record<string, any>>('psParams').value || {}, true)

  const refreshPowerSyncToken = async () => {
    const res = await useAuthRefresh()
    res?.success && res?.data?.powerSyncToken && (powerSyncToken.value = res.data.powerSyncToken)
    return res
  }

  const connectWithThrottle = (params: any, forceConnect = false) => {
    if (pendingConnectionTimeout.value) clearTimeout(pendingConnectionTimeout.value)

    pendingConnectionTimeout.value = setTimeout(() => {
      const rawParams = params ? toRaw(params) : null
      const hasParams = rawParams && typeof rawParams === 'object' && Object.keys(rawParams).length > 0

      // Track if this is the very first connection attempt since page load
      const isFirstConnectionAttempt = lastConnectionTime.value === 0

      // Force connection on first attempt or if params changed or if explicitly forced
      if (isFirstConnectionAttempt || forceConnect || haveObjectsChanged(rawParams, lastParams.value)) {
        if (DEBUG) {
          console.log(isFirstConnectionAttempt ? 'CONNECTING TO PS (First connection after page load)...' : 'CONNECTING TO PS (Network Request)...')
          console.log(powerSyncToken)
          console.log(rawParams)
        }
        $db.connect(new Connector(powerSyncToken.value as string), hasParams ? { params: rawParams } : {})
        lastParams.value = rawParams ? { ...rawParams } : {}
      } else {
        if (DEBUG) console.log('Skipping PowerSync connection - params unchanged')
      }

      lastConnectionTime.value = Date.now()
      pendingConnectionTimeout.value = null
    }, THROTTLE)
  }

  if (!watchersInitialized) {
    watchersInitialized = true

    watch(
      () => useState<any>('psParams').value,
      (to) => to !== undefined && powerSyncToken.value && connectWithThrottle(to),
      { immediate: true }
    )

    $db.registerListener({
      statusChanged: async (status: SyncStatus) => {
        // console.log('PowerSync status changed:')
        // console.log(status)
        connected.value = status.connected
        if (status.lastSyncedAt) {
          lastSyncedDate.value = new Date(status.lastSyncedAt)
          lastSyncedTime.value = lastSyncedDate.value.toLocaleString()
          // if (!isOnline.value || isForcedVisible.value) updateTimeSinceLastSync()
        }

        const errorMsg = status.dataFlowStatus?.downloadError
        if (errorMsg?.message.includes('JWT')) {
          errorCount++

          if (errorCount < 3) {
            if (DEBUG) {
              console.log(`PS: JWT error detected in PowerSync connection! Count: ${errorCount}`)
              console.log(errorMsg?.message)
              console.log(status)
            }
            await sleep(300)
            await refreshPowerSyncToken()
            await forceReconnect()
          }
        }
      },
    })
  }

  // If initialize flag is true and we have a token but no params yet
  if (initialize && powerSyncToken.value && !useState<any>('psParams').value && Date.now() - lastConnectionTime.value > THROTTLE) {
    if (DEBUG) console.log('useDynamicPS: Initializing PowerSync connection with empty params...')

    // For a new session, force the connection
    const isFirstConnection = lastConnectionTime.value === 0
    useState<any>('psParams').value = {}
    // Directly trigger a forced connection for new users
    if (isFirstConnection) connectWithThrottle({}, true)
  }

  if (!useState<Boolean>('isPSConsoledOnce').value && powerSyncToken.value) useState<Boolean>('isPSConsoledOnce').value = true

  return {
    updatepsParams,
    forceReconnect,
    refreshPowerSyncToken,
  }
}
