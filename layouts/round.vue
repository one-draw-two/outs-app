<template>
  <div class="main-container space-y-8">
    <div class="flex gap-8">
      <NuxtLink :to="`/stage/${round?._stage?.id}`">{{ round?._stage?.name }}</NuxtLink>
      <h1>Round {{ round?.name }}</h1>
      <div>
        <p>Deadline {{ $day(round?._h_roundDeadline).format('ddd DD/MM HH:mm') }}</p>
        <p v-highlight="round">Cursor {{ round?._h_lastFinishedMatchIndex }}</p>
      </div>
    </div>

    <div class="flex gap-8">
      <div class="flex-1 space-y-8">
        <div class="flex gap-8">
          <NuxtLink :to="`/round/${round?.id}`"><h2>Overview</h2></NuxtLink>
          <NuxtLink :to="`/round/${round?.id}/matches`"><h2>Matches</h2></NuxtLink>
          <NuxtLink :to="`/round/${round?.id}/challenges`"><h2>Challenges</h2></NuxtLink>
          <NuxtLink :to="`/round/${round?.id}/fixtures`"><h2>Fixtures</h2></NuxtLink>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useRoute as useNativeRoute } from 'vue-router'
const nativeRoute = useNativeRoute()

const { data: round, isLoading } = await usePopulatedRound(nativeRoute.params.rid as string)
useLoadingWatcher(isLoading, round, 'Round fully populated')

useState<any>('pickerSeasonId').value = round.value?._season

provide(roundKey, { round, isLoading })
</script>
