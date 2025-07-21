<template>
  <div
    class="relative px-4 w-48 h-12 rounded-xl flex flex-col justify-center shadow"
    :class="season?.id ? 'bg-repeat-x bg-[length:256px_auto]' : 'bg-gray-300'"
    :style="season?.bgUrl ? { backgroundImage: `url(${getSanityUrl(season.bgUrl)})` } : {}"
  >
    <div class="rounded-xl absolute inset-0 bg-gradient-to-t from-white/30 to-white/30 pointer-events-none"></div>
    <div class="relative z-1">
      <slot />
      <h1 class="h-5 stroke-text">Season {{ season?.name }}</h1>
      <select v-model="selectedSeasonId" @change="change" class="stroke-text !not-italic w-full min-w-0 truncate absolute opacity-0">
        <option class="truncate" value="">Select a season</option>
        <option class="truncate" v-for="s of seasons" :value="s.id" :disabled="false && !activeUserSubscriptionSeasons?.includes(s.id)">Season {{ s.name }}</option>
      </select>
      <button v-if="selectedSeasonId && false" @click="goToDetails" class="stroke-text flex-shrink-0 w-6 text-center">→</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _Season, _Stage } from '~/../types'

const season = useState<any>('season')
const stage = useState<any>('stage')
const selectedSeasonId = useState<any>('pickerSeasonId')
const selectedStageId = useState<any>('pickerStageId')

if (!selectedSeasonId.value) selectedSeasonId.value = useRoute().params.sid
if (!selectedStageId.value) selectedStageId.value = useRoute().params.stid

watch(selectedSeasonId, async (to) => !to || season.value?.id === to || (useState<any>('season').value = (await usePopulatedSeason(to)).data.value), { immediate: true })

watch(
  selectedStageId,
  async (to) => {
    if (!to || stage.value?.id === to) return
    const { data: stages } = usePSWatch<_Stage>('SELECT * FROM "calendar_stages" WHERE id = ?', [to])
    watch(stages, (to) => {
      if (!to || to.length === 0) return
      const value = to[0]
      useState<any>('stage').value = value
      useState<any>('pickerStageId').value = value.id
      useState<any>('pickerSeasonId').value = value._season
    })
  },
  { immediate: true }
)

const { data: seasons } = usePSWatch<any>('SELECT * FROM "calendar_seasons" ORDER BY name ASC', [], { abortController: new AbortController() })
const { data: subscriptions } = usePSWatch<any>('SELECT * FROM "account_subscriptions"', [], { abortController: new AbortController() })

// Will fix the missing season selection options when considering which seasons sould immediately be available to users in the header/picker
// wecl(seasons, 'seasons')
// wecl(subscriptions, 'subscriptions')

const activeUserSubscriptionSeasons = computed(() => subscriptions.value.filter((sb: any) => sb.status === 'active').map((sb) => sb._season))

const change = (event: any) => navigateTo(event.target.value ? useSL(`campaign/${event.target.value}`) : useSL(''))
const goToDetails = () => navigateTo(useSL(`campaign/${selectedSeasonId.value}`))
</script>
