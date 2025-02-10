import { Capacitor } from '@capacitor/core'
import { PowerSyncDatabase, WASQLiteOpenFactory, WASQLiteVFS } from '@powersync/web'
import { createPowerSyncPlugin } from '@powersync/vue'
import { Connector } from '~/powersync/Connector'
import { AppSchema } from '~/powersync/AppSchema'
import { opfsNotSupportedMessage, purgeVFS, listVfsEntries } from '~/powersync/utils'

export default defineNuxtPlugin((nuxtApp) => {
  // const isUseIndexDB = useRuntimeConfig().public.platform === 'cap' // Set in package.json (build:s > nuxt generate) script
  // In package.json -> "build:s": "pnpm build && NUXT_PUBLIC_PLATFORM=cap pnpm generate && pnpm cap:sync", the NUXT_PUBLIC_PLATFORM=cap is unused at the moment
  // An example from PS on how to use conditional db type: https://github.com/powersync-ja/powersync-js/blob/main/demos/example-capacitor/src/components/providers/SystemProvider.tsx

  const isUseIndexDB = Capacitor.getPlatform() === 'android'

  const db = new PowerSyncDatabase({
    schema: AppSchema,
    database: isUseIndexDB
      ? {
          dbFilename: 'outs-ps-idb.db',
        }
      : new WASQLiteOpenFactory({
          dbFilename: 'outs-ps-opfs.db',
          vfs: WASQLiteVFS.OPFSCoopSyncVFS,
        }),
    flags: isUseIndexDB
      ? {
          enableMultiTabs: typeof SharedWorker !== 'undefined',
        }
      : undefined,
  })

  const connector = new Connector()
  db.connect(connector)

  nuxtApp.vueApp.use(createPowerSyncPlugin({ database: db }))

  nuxtApp.vueApp.config.globalProperties.$vfsPurge = isUseIndexDB ? opfsNotSupportedMessage : () => purgeVFS(db)
  nuxtApp.vueApp.config.globalProperties.$vfsList = isUseIndexDB ? opfsNotSupportedMessage : listVfsEntries
})
