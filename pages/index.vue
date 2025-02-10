<template>
  <div class="container">
    <h1 class="text-5xl text-blue-300">Rounds</h1>
    <ul>
      <li v-for="r in rounds" :key="r.id">{{ r.name }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@powersync/vue'

const query = ref('SELECT * from rounds')
const { data: rounds, isLoading, isFetching, error } = useQuery(query, [], {})

watch(
  rounds,
  (to) => {
    console.log('Rounds')
    console.log(to)
  },
  { immediate: true }
)
</script>
