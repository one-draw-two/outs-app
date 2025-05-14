import { Capacitor } from '@capacitor/core'
import { PowerSyncDatabase, WASQLiteOpenFactory, WASQLiteVFS } from '@powersync/web'
import { AppSchema } from '~/powersync/AppSchema'
import { opfsNotSupportedMessage, purgeVFS, listVfsEntries } from '~/powersync/utils'

export default defineNuxtPlugin((nuxtApp) => {
  // const isUseIndexDB = useRuntimeConfig().public.platform === 'cap' // Set in package.json (build:s > nuxt generate) script
  // In package.json -> "build:s": "pnpm build && NUXT_PUBLIC_PLATFORM=cap pnpm generate && pnpm cap:sync", the NUXT_PUBLIC_PLATFORM=cap is unused at the moment
  // An example from PS on how to use conditional db type: https://github.com/powersync-ja/powersync-js/blob/main/demos/example-capacitor/src/components/providers/SystemProvider.tsx

  const isUseIndexDB = Capacitor.getPlatform() === 'android'

  const baseFlags = { broadcastLogs: true } // Where to display these? Asked on Discord

  const db = new PowerSyncDatabase({
    schema: AppSchema,
    database: isUseIndexDB ? { dbFilename: 'outs-ps-idb.db' } : new WASQLiteOpenFactory({ dbFilename: 'outs-ps-opfs.db', vfs: WASQLiteVFS.OPFSCoopSyncVFS }),
    flags: isUseIndexDB ? Object.assign({}, baseFlags, { enableMultiTabs: typeof SharedWorker !== 'undefined' }) : baseFlags,
  })

  nuxtApp.provide('db', db)

  nuxtApp.vueApp.config.globalProperties.$vfsPurge = isUseIndexDB ? opfsNotSupportedMessage : () => purgeVFS(db)
  nuxtApp.vueApp.config.globalProperties.$vfsList = isUseIndexDB
    ? async () => Promise.resolve(['OPFS operations not supported with IndexDB'])
    : async () => {
        const entries: string[] = []
        const root: any = await navigator.storage.getDirectory()
        for await (const [name, entry] of root.entries!()) entries.push(`${entry.kind}: ${name}`)
        return entries
      }
})
