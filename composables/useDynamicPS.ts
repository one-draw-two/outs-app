import { Connector } from '~/powersync/Connector'

export default function (params: any) {
  const { $db }: any = useNuxtApp()

  const powerSyncToken = useState<String>('powerSyncToken').value

  $db.connect(new Connector(powerSyncToken as string), { params })

  if (!useState<Boolean>('isPSConsoledOnce').value) {
    console.log('Dynamic PS token:', powerSyncToken)
    useState<Boolean>('isPSConsoledOnce').value = true
  }
}
