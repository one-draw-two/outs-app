<template>
  <div class="bg-gray-200/50 w-48 h-12 rounded-md flex-center">
    <select @change="change">
      <option value="">Select a season</option>
      <option v-for="season of seasons" :value="season._id">{{ season.name }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
const { seasons, isLoading, isFetching, error } = useSeasons()

useLoadingWatcher(isLoading, seasons, 'Seasons')

const change = (event: any) => navigateTo(event.target.value ? { name: 'season-id', params: { id: event.target.value } } : '/')
</script>
