<template>
  <div class="px-4 h-12 rounded-xl flex-center bg-repeat-x bg-[length:256px_auto]" :style="{ backgroundImage: season?.blueprint?.bgUrl ? `url(${getSanityUrl(season.blueprint?.bgUrl)})` : 'none' }">
    <select v-model="selectedSeasonId" @change="change" class="stroke-text !not-italic">
      <option value="">Select a season</option>
      <option v-for="season of seasons" :value="season.id" :disabled="false && !activeUserSubscriptionSeasons?.includes(season.id)">Season {{ season.name }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useRoute as useNativeRoute } from 'vue-router'
const nativeRoute = useNativeRoute()

const selectedSeasonId = useState<any>('pickerSeasonId')
if (!selectedSeasonId.value && nativeRoute.params.sid) {
  console.log('Setting selectedSeasonId from route', nativeRoute.params.sid)
  selectedSeasonId.value = nativeRoute.params.sid as string
}

const { data: seasons } = usePSWatch<any>('SELECT * FROM "calendar_seasons" ORDER BY name ASC', [], { abortController: new AbortController() })
const { data: subscriptions } = usePSWatch<any>('SELECT * FROM "account_subscriptions"', [], { abortController: new AbortController() })
const { data: season, isLoading } = await useSeasonWithStages(selectedSeasonId)

useLoadingWatcher(isLoading, season, '', {
  onDataChange: (value) => (useState<any>('season').value = value),
})

const change = (event: any) => navigateTo(event.target.value ? `/season/${event.target.value}` : '/season')
const activeUserSubscriptionSeasons = computed(() => subscriptions.value.filter((sb: any) => sb.status === 'active').map((sb) => sb._season))
</script>
