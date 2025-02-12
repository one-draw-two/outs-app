<template>
  <h1>Hello index</h1>
  <button class="bg-blue-500" @click="listVFS">List VFS</button>
  <button class="bg-red-500" @click="deleteVFS">Delete VFS</button>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'season',
})

useHead({
  title: 'Outstanding',
})

const { $vfsList, $vfsPurge }: any = useNuxtApp().vueApp.config.globalProperties

const listVFS = () => {
  console.log('Listando')
  $vfsList()
}

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
