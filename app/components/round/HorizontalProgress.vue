<template>
  <div class="w-full px-4 space-y-2">
    <h1>Round {{ round?.name }}</h1>
    <NuxtLink class="block" :to="useSL(`round/${round?.id}/challenges`)">Last submissions by {{ $day(round?._h_roundDeadline).format('ddd DD/MM HH:mm') }}</NuxtLink>
    <div class="lg:w-96 w-full flex rounded overflow-hidden">
      <div
        v-for="(snapshot, index) in snapshots"
        :key="index"
        class="relative h-8 flex-grow transition-all duration-200 hover:brightness-90"
        :class="{
          'bg-gray-200': index > lastFinishedIndex,
          'bg-orange-300': index === lastFinishedIndex,
          [statusColor]: index < lastFinishedIndex,
        }"
        @mouseover="hoveredMatch = snapshot"
        @mouseleave="hoveredMatch = null"
      >
        <!-- Diagonal separator -->
        <div v-if="index < snapshots.length - 1" class="absolute top-[-3px] right-0 h-[110%] w-[2px] transform z-10">
          <div class="h-full w-full bg-white transform rotate-[15deg] origin-bottom-left"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Hover details -->
  <div v-if="hoveredMatch && hoveredMatch?._realFixture" class="mt-2 p-2 bg-white shadow rounded text-sm absolute">
    <div class="flex items-center gap-2">
      <span>{{ hoveredMatch?._realFixture.teamA }}</span>
      <span class="font-bold">{{ hoveredMatch?._realFixture.scoreA ?? '?' }}</span>
      <span>-</span>
      <span class="font-bold">{{ hoveredMatch?._realFixture.scoreB ?? '?' }}</span>
      <span>{{ hoveredMatch?._realFixture.teamB }}</span>
      <span v-if="hoveredMatch?._realFixture.status === 'fulltime'" class="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Completed</span>
      <span v-else-if="hoveredMatch?._realFixture.status === 'live'" class="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Live</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _P_Round } from '~~/types'

const props = defineProps<{
  round?: _P_Round
  statusColor: string
}>()

const snapshots = computed(() => props.round?.snapshots || [])
const lastFinishedIndex = computed(() => props.round?._h_lastFinishedMatchIndex ?? -1)
const hoveredMatch = ref()
</script>
