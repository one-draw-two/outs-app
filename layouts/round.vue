<template>
  <div class="space-y-8">
    <div :class="`bg-${stage?.color}-500/50`">
      <div class="h-12 main-container flex gap-8 items-center">
        <div class="flex gap-4">
          <!-- 
          <NuxtLink :to="useSL(`stage/${round?._stage}`)" class="hover:underline">Stage {{ stage?.name }}</NuxtLink>
          -->

          <NuxtLink :to="useSL(`round/${round?.id}`)" class="hover:underline">Round {{ round?.name }}</NuxtLink>
        </div>

        <div class="flex-1 flex justify-end gap-8">
          <NuxtLink :to="useSL(`round/${round?.id}/challenges`)">Challenges Deadline {{ $day(round?._h_roundDeadline).format('ddd DD/MM HH:mm') }}</NuxtLink>
          <p v-highlight="round">Cursor {{ round?._h_lastFinishedMatchIndex }}</p>
          <p v-highlight="round">{{ round?.status }}</p>
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

const fixtureData = computed(() => {
  if (!round.value?.userFixtures || !round.value?.userCursors) return []

  // Map fixtures to include their cursor data
  return round.value.userFixtures.map((fixture) => {
    const cursor = round.value?.userCursors[fixture.id]

    // Process snapshots for this fixture with user/oppo structure
    const formattedSnapshots = round.value?.snapshots?.map((s) => {
      const cursorSnapshot = cursor?.betsAddedSnapshots?.find((bas) => bas._snapshot === s.id)

      // Process bets to include user and opponent information
      const formattedBets =
        cursorSnapshot?._bets?.map((bet) => {
          const isUserBet = bet._user === fixture.userRow?._user?.id
          const isOppoBet = bet._user === fixture.oppoRow?._user?.id

          return {
            ...bet,
            isUserBet,
            isOppoBet,
          }
        }) || []

      return {
        ...s,
        $bets: formattedBets,
        // Include these for backward compatibility
        $userBet: formattedBets.find((b) => b.isUserBet)?.betFixtureSlot,
        $oppoBet: formattedBets.find((b) => b.isOppoBet)?.betFixtureSlot,
      }
    })

    return {
      id: fixture.id,
      fixture,
      userRow: fixture.userRow,
      oppoRow: fixture.oppoRow,
      betsAddedSnapshots: formattedSnapshots,
    }
  })
})

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
  // { name: 'Result' },
  { name: 'You' },
  ...roundTournaments.value?.map((t) => {
    const fixture = tournamentFixtures.value[t.id]?.[0]
    const fixtureDetails = fixture ? fixtureData.value.find((fd) => fd.id === fixture.id) : null

    return {
      id: t.id,
      name: t.name,
      fixture,
      fixtureDetails,
    }
  }),
])

provide(roundKey, { round, tournamentCols: headers })

// const { data: userFixtures } = usePSWatch<any>('SELECT * FROM "group_fixtures"', [''])
// wecl(userFixtures, 'userFixturesWhy')

wecl(round, 'round')
</script>
