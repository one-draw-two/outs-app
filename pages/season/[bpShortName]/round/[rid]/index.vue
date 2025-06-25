<template>
  <main class="space-y-4 relative">
    <RealFixturePointColumns>
      <div class="h-24 bg-green-500"></div>
    </RealFixturePointColumns>
    <div>
      <NuxtLink :to="`${useSL(`round/${round?.id}/matches`)}`"><h2>See all matches</h2></NuxtLink>
      <div v-for="(rf, rfi) in realFixtures" :key="rf?.id" class="lg:flex items-stretch py-4 hover:bg-gray-100">
        <RealFixtureItemLink :rf="rf" class="flex-1" />
        <RealFixturePointRows :rf="rf" class="flex-2" />
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
// Dont delete the comment below, it is whoing how to link to the matches page with a specific match index
// <NuxtLink :to="`${useSL(`round/${round?.id}/matches`)}#rfi-${round?._h_lastFinishedMatchIndex}`"><h2>See all matches</h2></NuxtLink>

import type { _RealFixture } from '~/types'

definePageMeta({ layout: 'round' })
const { round, isLoading } = inject(roundKey)!
useHead({ title: `${round.value?.name}` })

const route = useRoute()
const $day = useNuxtApp().vueApp.config.globalProperties.$day

const allRealFixtures = computed(() => round.value?.snapshots?.map((s: any) => s._realFixture).filter(Boolean))

// Get 5 fixtures around the lastFinishedMatchIndex
const realFixtures = computed(() => {
  const fixtures = allRealFixtures.value
  const totalFixtures = fixtures!.length

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

  return fixtures!.slice(startIndex, endIndex)
})
</script>
