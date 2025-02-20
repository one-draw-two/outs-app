<template>
  <div class="bg-gray-200/50 w-48 h-12 rounded-md flex-center">
    <select @change="change">
      <option value="">Select a season</option>
      <option v-for="season of seasons" :value="season.id" :disabled="!subscriptions.map((sb) => sb._season)?.includes(season.id)">{{ season.name }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
const { seasons, isLoading: ilse } = useSeasons()
const { subscriptions, isLoading: ilsb } = useUserSubscriptions()

useLoadingWatcher(ilse, seasons, 'Seasons')
useLoadingWatcher(ilsb, subscriptions, 'Subscriptions')

const change = (event: any) => navigateTo(event.target.value ? { name: 'season-id', params: { id: event.target.value } } : '/season')
</script>
