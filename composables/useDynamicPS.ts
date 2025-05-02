import { Connector } from '~/powersync/Connector'

export default function () {
  const { $db }: any = useNuxtApp()
  const powerSyncToken = useState<String>('powerSyncToken').value

  watch(
    () => useState<Boolean>('powerSyncParams').value,
    (to) => {
      if (to) $db.connect(new Connector(powerSyncToken as string), { params: to })
    },
    { immediate: true }
  )

  if (!useState<Boolean>('isPSConsoledOnce').value) {
    console.log('Dynamic PS token:', powerSyncToken)
    useState<Boolean>('isPSConsoledOnce').value = true
  }
}
