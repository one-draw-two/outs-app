<template>
  <div class="bg-gray-200/50 w-48 h-12 rounded-md flex-center">
    <select @change="change">
      <option value="">Select a season</option>
      <option v-for="season of seasons" :value="season.id" :disabled="false && !activeUserSubscriptionSeasons?.includes(season.id)">{{ season.name }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
const { data: seasons, isLoading: ilse } = usePSWatch<any>('SELECT * FROM seasons ORDER BY name ASC', [], { abortController: new AbortController() })
const { data: subscriptions, isLoading: ilsb } = usePSWatch<any>('SELECT * FROM subscriptions', [], { abortController: new AbortController() })
const change = (event: any) => navigateTo(event.target.value ? { name: 'season-id', params: { id: event.target.value } } : '/season')
// useLoadingWatcher(ilse, seasons, 'Seasons')
// useLoadingWatcher(ilsb, subscriptions, 'Subscriptions')

const activeUserSubscriptionSeasons = computed(() => subscriptions.value.filter((sb: any) => sb.status === 'active').map((sb) => sb._season))
</script>
