<template>
  <div
    class="px-4 w-48 h-12 rounded-xl flex items-center gap-2"
    :class="season?.id ? 'bg-repeat-x bg-[length:256px_auto]' : 'bg-gray-300'"
    :style="season?.bgUrl ? { backgroundImage: `url(${getSanityUrl(season.bgUrl)})` } : {}"
  >
    <select v-model="selectedSeasonId" @change="change" class="stroke-text !not-italic w-full min-w-0 truncate">
      <option class="truncate" value="">Select a season</option>
      <option class="truncate" v-for="s of seasons" :value="s.id" :disabled="false && !activeUserSubscriptionSeasons?.includes(s.id)">Season {{ s.name }}</option>
    </select>
    <button v-if="selectedSeasonId" @click="goToDetails" class="stroke-text flex-shrink-0 w-6 text-center">→</button>
  </div>
</template>

<script setup lang="ts">
import type { _Season, _Stage } from '~/types'

const season = useState<any>('season')
const selectedSeasonId = useState<any>('pickerSeasonId')

if (!selectedSeasonId.value) selectedSeasonId.value = useRoute().params.sid

watch(
  selectedSeasonId,
  async (to) => {
    if (!to || season.value?.id === to) return

    const seasonsQuery = usePSWatch<_Season>('SELECT * FROM "calendar_seasons" WHERE id = ?', [to])
    const stagesQuery = usePSWatch<_Stage>('SELECT * FROM "calendar_stages" WHERE _season = ? ORDER BY sePI ASC', [to])

    await Promise.all([seasonsQuery.await(), stagesQuery.await()])

    useState<any>('season').value = { ...seasonsQuery.data.value[0], stages: stagesQuery.data.value.map((stage) => ({ ...stage })) }
  },
  { immediate: true }
)

const { data: seasons } = usePSWatch<any>('SELECT * FROM "calendar_seasons" ORDER BY name ASC', [], { abortController: new AbortController() })
const { data: subscriptions } = usePSWatch<any>('SELECT * FROM "account_subscriptions"', [], { abortController: new AbortController() })

const activeUserSubscriptionSeasons = computed(() => subscriptions.value.filter((sb: any) => sb.status === 'active').map((sb) => sb._season))

const change = (event: any) => navigateTo(event.target.value ? useSL(`campaign/${event.target.value}`) : useSL(''))
const goToDetails = () => navigateTo(useSL(`campaign/${selectedSeasonId.value}`))
</script>
