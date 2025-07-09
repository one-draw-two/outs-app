<template>
  <div class="space-y-8">
    <div :class="`bg-${roundStatusColor}-500/20`">
      <div class="h-12 main-container flex gap-8 items-center">
        <div class="flex items-center gap-4">
          <!-- 
          <NuxtLink :to="useSL(`stage/${round?._stage}`)" class="hover:underline">Stage {{ stage?.name }}</NuxtLink>
          -->

          <NuxtLink :to="useSL(`round/${round?.id}`)" class="hover:underline">Round {{ round?.name }}</NuxtLink>

          <PrevTripleCrop :clip="'circle'" :title="`Round status: ${round?.status}`">
            <div class="size-3" :class="`bg-${roundStatusColor}-500`" />
          </PrevTripleCrop>
        </div>

        <div class="flex-1 flex justify-end items-center gap-8">
          <NuxtLink :to="useSL(`round/${round?.id}/challenges`)">Challenges Deadline {{ $day(round?._h_roundDeadline).format('ddd DD/MM HH:mm') }}</NuxtLink>
          <p v-highlight="round">Cursor {{ round?._h_lastFinishedMatchIndex }}</p>
          <RoundHorizontalProgress :round="round" :status-color="`bg-${roundStatusColor}-500`" />
          <!--
                    <p v-highlight="round">{{ round?.status }}</p>
          -->
        </div>
      </div>
    </div>

    <!--
    <div class="main-container flex gap-8">
      <div class="flex-1 space-y-8">
        <div class="flex gap-8">
          <NuxtLink :to="useSL(`round/${round?.id}`)"><h2>Overview</h2></NuxtLink>
          <NuxtLink :to="useSL(`round/${round?.id}/matches`)"><h2>Matches</h2></NuxtLink>
        </div>
      </div>
    </div>    
    -->

    <div class="main-container">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User, _P_Season, ParsedBPTournament } from '~/types'
import { useRoute as useNativeRoute } from 'vue-router'

const rid = useNativeRoute().params.rid as string
const user = useState<User>('user')
const season = useState<_P_Season>('season')
const stage = useState<any>('stage')

const { data: round } = await usePopulatedRound(rid, user.value?.id)
const { getUserRow } = useUserHelpers()

useState<any>('pickerSeasonId').value = round.value?._season
useState<any>('pickerStageId').value = round.value?._stage

useDynamicPS().updatePowerSyncParams({ selected_round: rid })

const sKey = 'realFixture'
const getOrder = (t: ParsedBPTournament, key: string) => t.snapshotConfig?.find((c) => c.name === key)?.order || 0

const roundTournaments = computed(() => (season.value?.tournaments?.filter((t) => t.snapshotConfig?.some((c) => c.name === sKey)) || []).sort((a, b) => getOrder(a, sKey) - getOrder(b, sKey)))

const headers = computed(() => [
  { name: 'You' },
  ...roundTournaments.value?.map((t) => ({
    id: t.id,
    name: t.name,
    fixture: round.value?.userFixtures?.find((fixture) => fixture._tournament === t.id && getUserRow(fixture)),
    standings: round?.value?.userStandings?.find((s: any) => s._tournament === t.id),
  })),
])

const roundStatusColor = computed(() => {
  if (round.value?.status === 'current-published') return 'orange'
  if (round.value?.status === 'current-points-getting-calculated') return 'yellow'
  if (round.value?.status === 'current-points-calculated') return 'teal'
  if (round.value?.status === 'current-live') return 'green'
  if (round.value?.status === 'completed') return 'blue'
  else return 'gray'
})

provide(roundKey, { round, tournamentCols: headers })

wecl(round, 'round')
</script>
