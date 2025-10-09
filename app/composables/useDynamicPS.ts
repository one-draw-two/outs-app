import type { SyncStatus } from '@powersync/web'
import { Connector } from '~/../powersync/Connector'

let watchersInitialized = false
let errorCount = 0

const DEBUG = true

export default function (initialize?: boolean) {
  const { $db }: any = useNuxtApp()
  const powerSyncToken = useState<String>('powerSyncToken')

  const connected = useState<boolean>('network:ps:powerSyncConnected', () => false)
  // const connectionType = useState<string>('network:ps:connectionType', () => 'unknown')
  const lastSyncedTime = useState<string | null>('network:ps:lastSyncedTime', () => null)
  const lastSyncedDate = useState<Date | null>('network:ps:lastSyncedDate', () => null)

  const THROTTLE = 0

  const lastConnectionTime = ref(0)
  const pendingConnectionTimeout = ref<NodeJS.Timeout | null>(null)
  const lastParams = ref<Record<string, any>>({})

  const updatePowerSyncParams = (newParams: Record<string, any>) => {
    const currentParams = useState<Record<string, any>>('powerSyncParams').value || {}
    const mergedParams = { ...currentParams, ...newParams }
    useState<Record<string, any>>('powerSyncParams').value = mergedParams
  }

  const forceReconnect = () => {
    if (powerSyncToken.value) {
      const params = useState<Record<string, any>>('powerSyncParams').value || {}

      console.log('Connecting with token:')
      console.log(powerSyncToken.value)

      connectWithThrottle(params, true)
    }
  }

  const haveParamsChanged = (newParams: Record<string, any> | null | undefined) => {
    if (!newParams) return Object.keys(lastParams.value).length > 0
    const newKeys = Object.keys(newParams)
    const lastKeys = Object.keys(lastParams.value)
    return newKeys.length !== lastKeys.length || newKeys.some((key) => lastParams.value[key] !== newParams[key]) || lastKeys.some((key) => !(key in newParams))
  }

  const connectWithThrottle = (params: any, forceConnect = false) => {
    if (pendingConnectionTimeout.value) clearTimeout(pendingConnectionTimeout.value)

    pendingConnectionTimeout.value = setTimeout(() => {
      const rawParams = params ? toRaw(params) : null
      const hasParams = rawParams && typeof rawParams === 'object' && Object.keys(rawParams).length > 0

      // Track if this is the very first connection attempt since page load
      const isFirstConnectionAttempt = lastConnectionTime.value === 0

      // Force connection on first attempt or if params changed or if explicitly forced
      if (isFirstConnectionAttempt || forceConnect || haveParamsChanged(rawParams)) {
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

  async function refreshPowerSyncToken() {
    if (DEBUG) console.log('Refreshing PowerSync token... (New kemal yes kemal)')

    const res = await useAuthRefresh()
    console.log(res)
    if (res.success && res.data?.powerSyncToken) {
      console.log('SET FROM RES')
      console.log(res.data.powerSyncToken)
      powerSyncToken.value = res.data.powerSyncToken
      return res
    }
  }

  if (!watchersInitialized) {
    watchersInitialized = true

    watch(
      () => useState<any>('powerSyncParams').value,
      (to) => {
        if (to !== undefined && powerSyncToken.value) connectWithThrottle(to)
      },
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
            console.log(`JWT error detected in PowerSync connection! Count: ${errorCount}`)
            console.log(errorMsg?.message)
            console.log(status)
            await refreshPowerSyncToken()
            await forceReconnect()
          }
        }
      },
    })
  }

  // If initialize flag is true and we have a token but no params yet
  if (initialize && powerSyncToken.value && !useState<any>('powerSyncParams').value && Date.now() - lastConnectionTime.value > THROTTLE) {
    if (DEBUG) console.log('useDynamicPS: Initializing PowerSync connection with empty params...')

    // For a new session, force the connection
    const isFirstConnection = lastConnectionTime.value === 0
    useState<any>('powerSyncParams').value = {}
    // Directly trigger a forced connection for new users
    if (isFirstConnection) connectWithThrottle({}, true)
  }

  if (!useState<Boolean>('isPSConsoledOnce').value && powerSyncToken.value) useState<Boolean>('isPSConsoledOnce').value = true

  return {
    updatePowerSyncParams,
    forceReconnect,
    refreshPowerSyncToken,
  }
}
