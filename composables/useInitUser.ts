import { Connector } from '~/powersync/Connector'
import type { User, AuthResponseSuccess } from '~/types'

export default function (res: AuthResponseSuccess, navToPath?: string) {
  console.log('Initializing user with response...')
  console.log(res)
  useState<User>('user').value = res.data.user
  useState<String>('accessToken').value = res.data.accessToken
  const { $db }: any = useNuxtApp()
  const connector = new Connector(res.data.powerSyncToken)

  $db.connect(connector, {
    params: { selected_round: 'RO250000' },
  })
  if (navigateTo) navigateTo(navToPath, { replace: true })
}
