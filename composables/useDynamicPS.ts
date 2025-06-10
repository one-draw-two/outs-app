import { Connector } from '~/powersync/Connector'

let watcherInitialized = false

const DEBUG = true

export default function (initialize?: boolean) {
  const { $db }: any = useNuxtApp()
  const powerSyncToken = useState<String>('powerSyncToken').value

  const THROTTLE = 300

  const lastConnectionTime = ref(0)
  const pendingConnectionTimeout = ref<NodeJS.Timeout | null>(null)
  const lastParams = ref<Record<string, any>>({})

  const updatePowerSyncParams = (newParams: Record<string, any>) => {
    const currentParams = useState<Record<string, any>>('powerSyncParams').value || {}
    const mergedParams = { ...currentParams, ...newParams }
    useState<Record<string, any>>('powerSyncParams').value = mergedParams
  }

  const forceReconnect = () => {
    if (powerSyncToken) {
      const params = useState<Record<string, any>>('powerSyncParams').value || {}
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
          console.log(rawParams)
        }
        $db.connect(new Connector(powerSyncToken as string), hasParams ? { params: rawParams } : {})
        lastParams.value = rawParams ? { ...rawParams } : {}
      } else {
        if (DEBUG) console.log('Skipping PowerSync connection - params unchanged')
      }

      lastConnectionTime.value = Date.now()
      pendingConnectionTimeout.value = null
    }, THROTTLE)
  }

  if (!watcherInitialized) {
    watcherInitialized = true
    watch(
      () => useState<any>('powerSyncParams').value,
      (to) => {
        if (to !== undefined && powerSyncToken) connectWithThrottle(to)
      },
      { immediate: true }
    )
  }

  // If initialize flag is true and we have a token but no params yet
  if (initialize && powerSyncToken && !useState<any>('powerSyncParams').value && Date.now() - lastConnectionTime.value > THROTTLE) {
    // For a new session, force the connection
    const isFirstConnection = lastConnectionTime.value === 0
    useState<any>('powerSyncParams').value = {}
    // Directly trigger a forced connection for new users
    if (isFirstConnection) connectWithThrottle({}, true)
  }

  if (!useState<Boolean>('isPSConsoledOnce').value && powerSyncToken) useState<Boolean>('isPSConsoledOnce').value = true

  return {
    updatePowerSyncParams,
    forceReconnect,
  }
}
