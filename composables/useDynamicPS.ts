import { Connector } from '~/powersync/Connector'

export default function (initialize?: boolean) {
  const { $db }: any = useNuxtApp()
  const powerSyncToken = useState<String>('powerSyncToken').value

  const THROTTLE = 300

  const lastConnectionTime = ref(0)
  const pendingConnectionTimeout = ref<NodeJS.Timeout | null>(null)

  const connectWithThrottle = (params: any) => {
    if (pendingConnectionTimeout.value) clearTimeout(pendingConnectionTimeout.value)

    pendingConnectionTimeout.value = setTimeout(() => {
      console.log('Connecting to PowerSync with params:', params || 'none')

      const rawParams = params ? toRaw(params) : null
      const hasParams = rawParams && typeof rawParams === 'object' && Object.keys(rawParams).length > 0

      $db.connect(new Connector(powerSyncToken as string), hasParams ? { params: rawParams } : {})

      lastConnectionTime.value = Date.now()
      pendingConnectionTimeout.value = null
    }, THROTTLE)
  }

  watch(
    () => useState<any>('powerSyncParams').value,
    (to) => {
      if (to !== undefined && powerSyncToken) connectWithThrottle(to)
    },
    { immediate: true }
  )

  if (initialize && powerSyncToken && !useState<any>('powerSyncParams').value && Date.now() - lastConnectionTime.value > THROTTLE) useState<any>('powerSyncParams').value = {}

  if (!useState<Boolean>('isPSConsoledOnce').value && powerSyncToken) useState<Boolean>('isPSConsoledOnce').value = true
}
