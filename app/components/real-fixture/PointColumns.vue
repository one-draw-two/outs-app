<template>
  <div class="bg-yellow-100 lg:flex items-stretch hover:bg-gray-100">
    <div class="max-lg:w-[var(--container-width)] lg:w-96 h-32 bg-yellow-100">
      <slot />
    </div>

    <div class="flex-2 bg-blue-200 flex items-stretch gap-4">
      <div v-for="h in tournamentCols" class="flex-1 bg-blue-200 flex flex-col justify-stretch gap-2">
        <p v-if="!h.standings && !h.fixture">{{ h.name }}</p>
        <NuxtLink v-if="h.standings" :to="useSL(`standings/${h.standings.id}`)" class="bg-gray-100/25 flex-1 flex items-center gap-2">
          {{ h.standings.name }}
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
const tournamentCols = useState<any>('tournamentCols')
const { getOpponentRow, getOpponentName } = useUserHelpers()
</script>
