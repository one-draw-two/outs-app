import { PowerSyncDatabase, WASQLiteOpenFactory, WASQLiteVFS } from '@powersync/web'
import { createPowerSyncPlugin } from '@powersync/vue'
import { Connector } from '~/powersync/Connector'
import { AppSchema } from '~/powersync/AppSchema'
import { opfsNotSupportedMessage, purgeVFS, listVfsEntries } from '~/powersync/utils'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const isPlatformCapacitor = config.public.platform === 'cap'
  const db = new PowerSyncDatabase({
    schema: AppSchema,
    database: isPlatformCapacitor
      ? {
          dbFilename: 'outs-ps-idb.db',
        }
      : new WASQLiteOpenFactory({
          dbFilename: 'outs-ps-opfs.db',
          vfs: WASQLiteVFS.OPFSCoopSyncVFS,
        }),
    flags: isPlatformCapacitor
      ? {
          enableMultiTabs: typeof SharedWorker !== 'undefined',
        }
      : undefined,
  })

  const connector = new Connector()
  db.connect(connector)

  nuxtApp.vueApp.use(createPowerSyncPlugin({ database: db }))

  nuxtApp.vueApp.config.globalProperties.$vfsPurge = isPlatformCapacitor ? opfsNotSupportedMessage : () => purgeVFS(db)
  nuxtApp.vueApp.config.globalProperties.$vfsList = isPlatformCapacitor ? opfsNotSupportedMessage : listVfsEntries
})
