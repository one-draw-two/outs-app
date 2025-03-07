import { Connector } from '~/powersync/Connector'

export default function (params: any) {
  const { $db }: any = useNuxtApp()
  const powerSyncToken = useState<String>('powerSyncToken').value
  console.log('Dynamic PS token:', powerSyncToken)
  $db.connect(new Connector(powerSyncToken as string), { params })
}
