<template>
  <div class="relative group" @click="goToDetails">
    <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-[#A3F2D1] via-[#B9A9F2] to-[#9ED9F4] to-[#F2F6A2] bg-[length:200%_200%] animate-gradient-hover"></div>
    <div class="relative px-2 h-8 rounded-xl flex items-center gap-2 font-posterama cursor-pointer bg-white/90 m-[2px] transition-all duration-200 group-hover:text-blue-500">
      <select v-model="selectedSeasonId" @change="change" class="stroke-textX !not-italic w-full min-w-0 truncate bg-transparent text-whiteX" :class="isInRouteContext ? 'pointer-events-none' : ''">
        <option class="truncate bg-gray-100" value="">Select a season</option>
        <option class="truncate bg-gray-100" v-for="s of seasons" :key="s.id" :value="s.id" :disabled="false && !activeUserSubscriptionSeasons?.includes(s.id)">Season {{ s.name }}</option>
      </select>
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

const isInRouteContext = computed(() => /(round|stage|standings)/.test(useRoute().path))

watch(selectedSeasonId, async (to) => await useSeasonState().setSeason(to), { immediate: true })

watch(
  selectedStageId,
  async (to) => {
    if (!to || stage.value?.id === to) return
    const { data: stages } = usePSWatch<_Stage>('SELECT * FROM "calendar_stages" WHERE id = ?', [to])
    watch(stages, (to) => {
      if (!to || to.length === 0 || !to[0]) return
      const value = to[0]

      useState<any>('stage').value = value
      useState<any>('pickerStageId').value = value.id
      useState<any>('pickerSeasonId').value = value._season
    })
  },
  { immediate: true }
)

const { data: seasons } = usePSWatch<any>('SELECT * FROM "calendar_seasons" ORDER BY name ASC', [])
const { data: subscriptions } = usePSWatch<any>('SELECT * FROM "account_subscriptions"', [])

const activeUserSubscriptionSeasons = computed(() => subscriptions.value.filter((sb: any) => sb.status === 'active').map((sb) => sb._season))

const change = (event: any) => navigateTo(event.target.value ? useSL(`campaign/${event.target.value}`) : useSL(''))

const goToDetails = () => isInRouteContext.value && navigateTo(useSL(`campaign/${selectedSeasonId.value}`))
</script>
