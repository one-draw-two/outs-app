import { Capacitor } from '@capacitor/core'
import { PowerSyncDatabase, WASQLiteOpenFactory, WASQLiteVFS } from '@powersync/web'
import { AppSchema } from '~/../powersync/AppSchema'
import { opfsNotSupportedMessage, purgeVFS, listVfsEntries } from '~/../powersync/utils'

const DEBUG = false

export default defineNuxtPlugin(async (nuxtApp) => {
  // const isUseIndexDB = useRuntimeConfig().public.platform === 'cap' // Set in package.json (build:s > nuxt generate) script
  // In package.json -> "build:s": "pnpm build && NUXT_PUBLIC_PLATFORM=cap pnpm generate && pnpm cap:sync", the NUXT_PUBLIC_PLATFORM=cap is unused at the moment
  // An example from PS on how to use conditional db type: https://github.com/powersync-ja/powersync-js/blob/main/demos/example-capacitor/src/components/providers/SystemProvider.tsx

  const isUseIndexDB = Capacitor.getPlatform() === 'android'
  const baseFlags = { broadcastLogs: true, enableMultiTabs: false } // Where to display these? Asked on Discord

  useState('dbInitialized').value = false

  try {
    const db = new PowerSyncDatabase({
      schema: AppSchema,
      database: isUseIndexDB ? { dbFilename: 'outs-ps-idb.db' } : new WASQLiteOpenFactory({ dbFilename: 'outs-ps-opfs.db', vfs: WASQLiteVFS.OPFSCoopSyncVFS }),
      flags: isUseIndexDB ? Object.assign({}, baseFlags, { enableMultiTabs: typeof SharedWorker !== 'undefined' }) : baseFlags,
    })

    await db.waitForReady()

    // Wait for database to initialize (at least open)
    /*
    try {
      await db.execute('SELECT 1')
      if (DEBUG) console.log('PowerSync database test query successful')
    } catch (queryError) {
      console.error('PowerSync database test query failed:', queryError)
      throw queryError
    }
    */

    nuxtApp.provide('db', db)

    // Signal that the database is initialized
    useState('dbInitialized').value = true
    if (DEBUG) console.log('PowerSync database initialized successfully')

    nuxtApp.vueApp.config.globalProperties.$vfsPurge = isUseIndexDB ? opfsNotSupportedMessage : () => purgeVFS(db)
    nuxtApp.vueApp.config.globalProperties.$vfsList = isUseIndexDB
      ? async () => Promise.resolve(['OPFS operations not supported with IndexDB'])
      : async () => {
          const entries: string[] = []
          const root: any = await navigator.storage.getDirectory()
          for await (const [name, entry] of root.entries!()) entries.push(`${entry.kind}: ${name}`)
          return entries
        }
  } catch (error) {
    console.error('Failed to initialize PowerSync database:', error)
    useState('dbInitialized').value = false
  }

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    // Log to your error tracking service
    if (event.reason?.message?.includes('module script')) {
      console.error('Module loading failed - possible MIME type or caching issue')
      // Attempt recovery by clearing caches
      caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
    }
  })
})
