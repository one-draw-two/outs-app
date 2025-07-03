<template>
  <div class="bg-yellow-100 lg:flex items-stretch hover:bg-gray-100">
    <div class="flex-1 bg-yellow-200">
      <slot />
    </div>
    <div class="flex-2 bg-blue-200 flex items-stretch gap-4">
      <div v-for="h in tournamentCols" class="flex-1 bg-blue-200 flex-col gap-2">
        <NuxtLink :to="useSL(`round/${useRoute().params.rid}/fixtures/${h.id}`)" class="block">
          {{ h.name }}
        </NuxtLink>

        <NuxtLink v-if="h.name === 'Curves'" :to="useSL(`standings/${getStandingIdForTournament(h.id)?.id}`)" class="block"> Curve view </NuxtLink>

        <NuxtLink v-if="h.fixture" :to="useSL(`round/${useRoute().params.rid}/fixture/${h.fixture.id}`)" class="block">
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
const getStandingIdForTournament = (tournamentId: string) => round?.value?.userStandings?.find((s: any) => s._tournament === tournamentId) // You can generaise as group to include standings or fixtures
</script>
