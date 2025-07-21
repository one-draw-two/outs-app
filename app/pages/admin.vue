<template>
  <button class="bg-blue-500" @click="$vfsList()">List VFS</button>
  <button class="bg-red-500" @click="deleteVFS">Delete VFS</button>
  <div>
    <h3>Live Activity Debug Logs</h3>
    <div>
      <button @click="unregister" class="block">Unregister capacitor</button>
      <button @click="register" class="block">Register capacitor</button>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Outstanding | Admin',
})

const { $vfsList, $vfsPurge }: any = useNuxtApp().vueApp.config.globalProperties

const deleteVFS = async () => {
  console.log('Deleting')
  try {
    await $vfsPurge()
    console.log('Database cleanup completed')
  } catch (error) {
    console.error('Database cleanup failed:', error)
  }
}

const { $capacitor } = useNuxtApp()

const unregister = async () => {
  console.log('Unregistering')
  const unregresp = $capacitor.$platform !== 'web' ? await $capacitor.$pushNotifications.unregister() : null
  console.log(unregresp)
}

const register = async () => {
  console.log('Registering')
  useGetPushTokens({})
}
</script>
