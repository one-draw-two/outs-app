<template>
  <div class="space-y-8">
    <div class="flex gap-8">
      <h1>Round {{ round?.name }}</h1>
      <div>
        <p>Deadline {{ $day(round?._h_roundDeadline).format('ddd DD/MM HH:mm') }}</p>
        <p v-highlight="round">Cursor {{ round?._h_lastFinishedMatchIndex }}</p>
      </div>
    </div>

    <div class="flex gap-8">
      <div class="flex-1 space-y-8">
        <div class="flex gap-8">
          <NuxtLink :to="`/round/${round?.id}`"><h2>Matches</h2></NuxtLink>
          <NuxtLink :to="`/round/${round?.id}/challenges`"><h2>Challenges</h2></NuxtLink>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { _Round } from '~/types'
import { useRoute as useNativeRoute } from 'vue-router'
const nativeRoute = useNativeRoute()

const { data: round, isLoading } = await usePopulatedRound(nativeRoute.params.rid as string)
useLoadingWatcher(isLoading, round, 'Round fully populated')

provide(roundKey, { round, isLoading })
</script>
