<template>
  <div class="container">
    <h1 class="text-5xl text-blue-300">Rounds</h1>
    <button class="bg-blue-500" @click="listVFS">List VFS</button>
    <button class="bg-red-500" @click="deleteVFS">Delete VFS</button>
    <ul>
      <li v-for="r in rounds" :key="r.id">{{ r.name }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@powersync/vue'

const { $vfsList, $vfsPurge }: any = useNuxtApp().vueApp.config.globalProperties

const query = ref('SELECT * from rounds')
const { data: rounds, isLoading, isFetching, error } = useQuery(query, [], {})

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

watch(
  rounds,
  (to) => {
    console.log('Rounds')
    console.log(to)
  },
  { immediate: true }
)

watch(
  error,
  (to) => {
    console.log('Error YOYYOY')
    console.log(to)
  },
  { immediate: true }
)
</script>
