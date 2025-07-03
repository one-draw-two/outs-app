<template>
  <div class="bg-yellow-100 lg:flex items-stretch hover:bg-gray-100">
    <div class="flex-1 bg-yellow-200">
      <slot />
    </div>
    <div class="flex-2 bg-blue-200 flex items-stretch gap-4">
      <div v-for="h in tournamentCols" class="flex-1 bg-blue-200 flex flex-col justify-stretch gap-2">
        <NuxtLink :to="useSL(`standings/${getStandingIdForTournament(h.id)}`)" class="bg-gray-100/25 flex-1 flex items-center gap-2">
          {{ h.name }}
        </NuxtLink>
        <NuxtLink v-if="h.fixture" :to="useSL(`round/${useRoute().params.rid}/fixture/${h.fixture.id}`)" class="bg-gray-100/25 flex-1 flex items-center gap-2">
          <div>vs {{ getOpponentName(h.fixture) }}</div>
          <div><FixturePointsDisplay :row="getOpponentRow(h.fixture)" /></div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { round, tournamentCols } = inject(roundKey)!
const { getOpponentRow, getOpponentName } = useUserHelpers()

const getStandingIdForTournament = (tournamentId: string) =>
  round?.value?.userStandings?.find((s: any) => s._tournament === tournamentId)?.id ?? round?.value?.userFixtures?.find((f: any) => f._tournament === tournamentId)?._parentGroup
</script>
