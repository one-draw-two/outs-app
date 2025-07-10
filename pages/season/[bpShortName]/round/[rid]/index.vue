<template>
  <LayoRound>
    <main class="space-y-4 relative">
      <RealFixturePointColumns>
        <div class="h-32 bg-green-500"></div>
      </RealFixturePointColumns>
      <div>
        <!-- <NuxtLink :to="`${useSL(`round/${round?.id}/matches`)}#rfi-${round?._h_lastFinishedMatchIndex}`"><h2>See all matches</h2></NuxtLink> -->
        <NuxtLink :to="`${useSL(`round/${round?.id}/matches`)}`"><h2>See all matches</h2></NuxtLink>
        <div v-for="(rf, rfi) in realFixtures" :key="rf?.id" class="lg:flex items-stretch py-4 hover:bg-gray-100">
          <RealFixtureItemLink :rf="rf" class="flex-1" />
          <RealFixturePointRows :rf="rf" class="flex-2" />
        </div>
      </div>
    </main>
  </LayoRound>
</template>

<script setup lang="ts">
import type { _RealFixture } from '~/types'

definePageMeta({
  middleware: 'round',
})

const route = useRoute()
const rid = route.params.rid as string

// Get round data from useState (populated by middleware)
const round = useState('round')
const tournamentCols = useState('tournamentCols')
const season = useState<_P_Season>('season')
const stage = useState<any>('stage')

// Set page title
useHead({ title: `${round.value?.name}` })

const $day = useNuxtApp().vueApp.config.globalProperties.$day

const allRealFixtures = computed(() => round.value?.snapshots?.map((s: any) => s.$realFixture).filter(Boolean))

// Get 5 fixtures around the lastFinishedMatchIndex
const realFixtures = computed(() => {
  const fixtures = allRealFixtures.value
  if (!fixtures) return []

  const totalFixtures = fixtures.length

  // If we have 5 or fewer fixtures, return all
  if (totalFixtures <= 5) return fixtures

  // Get the central index
  const centerIndex = round.value?._h_lastFinishedMatchIndex || 0

  // Calculate desired start and end (2 before, 2 after)
  let startIndex = Math.max(0, centerIndex - 2)
  let endIndex = startIndex + 5

  // Adjust if we're going past the end
  if (endIndex > totalFixtures) {
    endIndex = totalFixtures
    startIndex = Math.max(0, endIndex - 5)
  }

  return fixtures.slice(startIndex, endIndex)
})
</script>
