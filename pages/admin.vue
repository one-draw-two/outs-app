<template>
  <button class="bg-blue-500" @click="$vfsList()">List VFS</button>
  <button class="bg-red-500" @click="deleteVFS">Delete VFS</button>
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
</script>
