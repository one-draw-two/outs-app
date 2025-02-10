import { PowerSyncDatabase, WASQLiteOpenFactory, WASQLiteVFS } from '@powersync/web'
import { createPowerSyncPlugin } from '@powersync/vue'
import { Connector } from '~/powersync/Connector'
import { AppSchema } from '~/powersync/AppSchema'

export default defineNuxtPlugin((nuxtApp) => {
  const db = new PowerSyncDatabase({
    schema: AppSchema,
    database: new WASQLiteOpenFactory({
      dbFilename: 'powersync.db',
      vfs: WASQLiteVFS.OPFSCoopSyncVFS,
      flags: {
        enableMultiTabs: typeof SharedWorker !== 'undefined',
      },
    }),
    flags: {
      enableMultiTabs: typeof SharedWorker !== 'undefined',
    },
  })

  const connector = new Connector()
  db.connect(connector)

  async function purgeVFS() {
    await db.disconnect()
    await db.close()

    const root: any = await navigator.storage.getDirectory()
    await new Promise((resolve) => setTimeout(resolve, 1)) // Allow .db-wal to become deletable

    for await (const [name, entry] of root.entries!()) {
      try {
        if (entry.kind === 'file') {
          await root.removeEntry(name)
        } else if (entry.kind === 'directory') {
          await root.removeEntry(name, { recursive: true })
        }
      } catch (err) {
        console.error(`Failed to delete ${entry.kind}: ${name}`, err)
      }
    }
  }

  // List OPFS entries
  async function listVfsEntries() {
    const root: any = await navigator.storage.getDirectory()
    for await (const [name, entry] of root.entries!()) {
      console.log(`${entry.kind}: ${name}`)
    }
  }

  nuxtApp.vueApp.use(createPowerSyncPlugin({ database: db }))

  nuxtApp.vueApp.config.globalProperties.$vfsPurge = purgeVFS
  nuxtApp.vueApp.config.globalProperties.$vfsList = listVfsEntries
})
