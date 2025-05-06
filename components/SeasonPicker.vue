<template>
  <div class="w-48 h-12 rounded-md flex-center bg-repeat-x bg-[length:512px_auto]" :style="{ backgroundImage: season?.blueprint?.bgUrl ? `url(${getSanityUrl(season.blueprint?.bgUrl)})` : 'none' }">
    <select v-model="selectedSeason" @change="change">
      <option value="">Select a season</option>
      <option v-for="season of seasons" :value="season.id" :disabled="false && !activeUserSubscriptionSeasons?.includes(season.id)">{{ season.name }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useRoute as useNativeRoute } from 'vue-router'
const nativeRoute = useNativeRoute()

const { data: seasons, isLoading: ilse } = usePSWatch<any>('SELECT * FROM "calendar_seasons" ORDER BY name ASC', [], { abortController: new AbortController() })
const { data: subscriptions, isLoading: ilsb } = usePSWatch<any>('SELECT * FROM "account_subscriptions"', [], { abortController: new AbortController() })

const selectedSeason = useState<any>('pickerSeasonId')
const { data: season, isLoading } = await useSeasonWithStages((nativeRoute.params.sid as string) || useState<any>('pickerSeasonId')) // This is what im trying to make so that it watches the useState<any>('pickerSeasonId')
useLoadingWatcher(isLoading, season, 'Season fully populated', {
  onDataChange: (value) => (useState<any>('season').value = value),
})

const change = (event: any) => navigateTo(event.target.value ? `/season/${event.target.value}` : '/season')

const activeUserSubscriptionSeasons = computed(() => subscriptions.value.filter((sb: any) => sb.status === 'active').map((sb) => sb._season))
</script>
