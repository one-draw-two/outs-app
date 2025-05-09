<template>
  <div
    class="px-4 w-48 h-12 rounded-xl flex items-center gap-2"
    :class="season?.id ? 'bg-repeat-x bg-[length:256px_auto]' : 'bg-gray-300'"
    :style="season?.bgUrl ? { backgroundImage: `url(${getSanityUrl(season.bgUrl)})` } : {}"
  >
    <select v-model="selectedSeasonId" @change="change" class="stroke-text !not-italic w-full min-w-0 truncate">
      <option class="truncate" value="">Select a season</option>
      <option class="truncate" v-for="season of seasons" :value="season.id" :disabled="false && !activeUserSubscriptionSeasons?.includes(season.id)">Season {{ season.name }}</option>
    </select>
    <button v-if="selectedSeasonId" @click="goToDetails" class="stroke-text flex-shrink-0 w-6 text-center">→</button>
  </div>
</template>

<script setup lang="ts">
import { useRoute as useNativeRoute } from 'vue-router'
const nativeRoute = useNativeRoute()

const selectedSeasonId = useState<any>('pickerSeasonId')
selectedSeasonId.value = nativeRoute.path === '/season' ? '' : !selectedSeasonId.value && nativeRoute.params.sid ? (nativeRoute.params.sid as string) : selectedSeasonId.value

const { data: seasons } = usePSWatch<any>('SELECT * FROM "calendar_seasons" ORDER BY name ASC', [], { abortController: new AbortController() })
const { data: subscriptions } = usePSWatch<any>('SELECT * FROM "account_subscriptions"', [], { abortController: new AbortController() })
const { data: season, isLoading } = await useSeasonWithStages(selectedSeasonId)

useLoadingWatcher(isLoading, season, '', {
  onDataChange: (value) => {
    useState<any>('season').value = value
    if (value?.id) useState<any>('pickerSeasonId').value = value.id
  },
})

const activeUserSubscriptionSeasons = computed(() => subscriptions.value.filter((sb: any) => sb.status === 'active').map((sb) => sb._season))

const change = (event: any) => navigateTo(event.target.value ? `/season/${event.target.value}` : '/season')
const goToDetails = () => navigateTo(`/season/${selectedSeasonId.value}`)
</script>
