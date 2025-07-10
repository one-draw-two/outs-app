<template>
  <div class="space-y-8">
    <div :class="`bg-${roundStatusColor}-500/20`">
      <div class="h-12 main-container flex gap-8 items-center">
        <div class="flex items-center gap-4">
          <NuxtLink :to="useSL(`stage/${round?._stage}`)" class="hover:underline">Stage {{ stage?.name }}</NuxtLink>
          <NuxtLink v-for="r of stage?.rounds" :key="r?.id" :to="getRoundLink(r?.id)" class="hover:underline"> Round {{ r?.name }} </NuxtLink>
          <NuxtLink :to="useSL(`round/${round?.id}`)" class="hover:underline">Round {{ round?.name }}</NuxtLink>

          <PrevTripleCrop :clip="'circle'" :title="`Round status: ${round?.status}`">
            <div class="size-3" :class="`bg-${roundStatusColor}-500`" />
          </PrevTripleCrop>
        </div>

        <div class="flex-1 flex justify-end items-center gap-8">
          <NuxtLink :to="useSL(`round/${round?.id}/challenges`)">Challenges Deadline {{ $day(round?._h_roundDeadline).format('ddd DD/MM HH:mm') }}</NuxtLink>
          <p v-highlight="round">Cursor {{ round?._h_lastFinishedMatchIndex }}</p>
          <RoundHorizontalProgress :round="round" :status-color="`bg-${roundStatusColor}-500`" />
        </div>
      </div>
    </div>

    <div class="main-container" :key="round?.id">
      <!-- Navigation tabs -->
      <div class="flex gap-8 border-b border-gray-200 mb-8">
        <NuxtLink :to="useSL(`round/${round?.id}`)" class="pb-2 hover:border-b-2 hover:border-gray-400" active-class="border-b-2 border-blue-500"> Overview </NuxtLink>
        <NuxtLink :to="useSL(`round/${round?.id}/matches`)" class="pb-2 hover:border-b-2 hover:border-gray-400" active-class="border-b-2 border-blue-500"> Matches </NuxtLink>
        <NuxtLink :to="useSL(`round/${round?.id}/challenges`)" class="pb-2 hover:border-b-2 hover:border-gray-400" active-class="border-b-2 border-blue-500"> Challenges </NuxtLink>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const round = useState('round')
const tournamentCols = useState('tournamentCols')
const season = useState('season')
const route = useRoute()
const stage = computed(() => season.value?.stages?.find((s: any) => s.id === round.value?._stage))

const roundStatusColor = computed(() => {
  if (round.value?.status === 'current-published') return 'orange'
  if (round.value?.status === 'current-points-getting-calculated') return 'yellow'
  if (round.value?.status === 'current-points-calculated') return 'teal'
  if (round.value?.status === 'current-live') return 'green'
  if (round.value?.status === 'completed') return 'blue'
  else return 'gray'
})

// Helper to keep subpage (matches/challenges) when switching rounds
function getRoundLink(newRid: string) {
  const subpage = route.path.split('/').pop()
  if (subpage === 'matches' || subpage === 'challenges') {
    return useSL(`round/${newRid}/${subpage}`)
  }
  return useSL(`round/${newRid}`)
}
</script>
