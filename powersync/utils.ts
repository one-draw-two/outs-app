export const opfsNotSupportedMessage = () => console.log('OPFS operations not supported in Capacitor environment')
export const purgeVFS = async (db: any) => {
  console.log('Starting aggressive VFS purge...')

  // Force disconnect and close
  try {
    await db.disconnect()
    await db.close()
  } catch (e) {
    console.log('Disconnect/close error (continuing):', e)
  }

  // Clear IndexedDB databases
  try {
    const databases = await window.indexedDB.databases()
    for (const db of databases) {
      if (db.name) {
        console.log('Deleting IndexedDB:', db.name)
        await window.indexedDB.deleteDatabase(db.name)
      }
    }
  } catch (e) {
    console.log('IndexedDB cleanup error (continuing):', e)
  }

  // Clear OPFS storage
  try {
    const root: any = await navigator.storage.getDirectory()
    await new Promise((resolve) => setTimeout(resolve, 100)) // Increased wait time

    for await (const [name, entry] of root.entries()) {
      try {
        console.log('Attempting to delete:', name)
        if (entry.kind === 'file') {
          await root.removeEntry(name, { recursive: true })
        } else if (entry.kind === 'directory') {
          await root.removeEntry(name, { recursive: true })
        }
      } catch (err) {
        console.error(`Failed to delete ${entry.kind}: ${name}`, err)
      }
    }
  } catch (e) {
    console.log('OPFS cleanup error (continuing):', e)
  }

  // Clear localStorage items related to PowerSync
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.includes('powersync') || key.includes('ps-') || key.includes('.db')) localStorage.removeItem(key)
    })
  } catch (e) {
    console.log('localStorage cleanup error (continuing):', e)
  }

  return true
}

export const listVfsEntries = async () => {
  const root: any = await navigator.storage.getDirectory()
  for await (const [name, entry] of root.entries!()) {
    console.log(`${entry.kind}: ${name}`)
  }
}
