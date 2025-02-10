export const opfsNotSupportedMessage = () => console.log('OPFS operations not supported in Capacitor environment')
export const purgeVFS = async (db: any) => {
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

export const listVfsEntries = async () => {
  const root: any = await navigator.storage.getDirectory()
  for await (const [name, entry] of root.entries!()) {
    console.log(`${entry.kind}: ${name}`)
  }
}
