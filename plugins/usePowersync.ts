import { PowerSyncDatabase } from '@powersync/web'
import { createPowerSyncPlugin } from '@powersync/vue'
import { Connector } from '~/powersync/Connector'
import { AppSchema } from '~/powersync/AppSchema'

export default defineNuxtPlugin((nuxtApp) => {
  const db = new PowerSyncDatabase({
    schema: AppSchema,
    database: {
      dbFilename: 'powersync2.db',
    },
  })

  const connector = new Connector()
  db.connect(connector)

  nuxtApp.vueApp.use(createPowerSyncPlugin({ database: db }))
})
