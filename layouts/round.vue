<template>
  <div class="space-y-8">
    <div :class="`bg-${roundStatusColor}-500/50`">
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
import type { User, _P_Season } from '~/types'
import { useRoute as useNativeRoute } from 'vue-router' // Necessary in layouts (Nuxt router limitation)

const rid = useNativeRoute().params.rid as string

const user = useState<User>('user')
const season = useState<_P_Season>('season')
const stage = useState<any>('stage')

const { data: round } = await usePopulatedRound(rid, user.value?.id)

useState<any>('pickerSeasonId').value = round.value?._season
useState<any>('pickerStageId').value = round.value?._stage

useDynamicPS().updatePowerSyncParams({ selected_round: rid })

const sKey = 'real-fixture'
const roundTournaments = computed(() => (season.value?.tournaments?.filter((t) => t.snapshotConfig?.some((c) => c.name === sKey)) || []).sort((a, b) => getOrder(a, sKey) - getOrder(b, sKey)))

interface FixturesByTournament {
  [tournamentId: string]: any[]
}

const tournamentFixtures = computed<FixturesByTournament>(() => {
  if (!round.value?.userFixtures) return {} as FixturesByTournament

  const fixturesByTournament: FixturesByTournament = {}
  roundTournaments.value?.forEach((tournament) => {
    if (tournament.id) {
      fixturesByTournament[tournament.id] = round.value?.userFixtures.filter((fixture: any) => fixture._tournament === tournament.id) || []
    }
  })

  return fixturesByTournament
})

const headers = computed(() => [
  { name: 'You' },
  ...roundTournaments.value?.map((t) => {
    const fixture = tournamentFixtures.value[t.id]?.[0]
    const fixtureDetails = fixture ? round.value?.fixtureData?.find((fd: any) => fd.id === fixture.id) : null
    return {
      id: t.id,
      name: t.name,
      fixture,
      fixtureDetails,
    }
  }),
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

// const { data: userFixtures } = usePSWatch<any>('SELECT * FROM "group_fixtures"', [''])
// wecl(userFixtures, 'userFixturesWhy')

wecl(round, 'round')
</script>
