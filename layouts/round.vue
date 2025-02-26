<template>
  <div class="space-y-8">
    <h1>Round {{ round?.name }}</h1>
    <div class="flex gap-8">
      <div class="flex-1 space-y-8">
        <div class="flex gap-8">
          <h2>Matches</h2>
          <NuxtLink :to="`/round/${round?.id}/challenges`"><h2>Challenges</h2></NuxtLink>
          <NuxtLink :to="`/round/${round?.id}/bets`"><h2>Bets</h2></NuxtLink>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { _Round } from '~/types'

const route = useRoute()

const { data: round, isLoading } = await usePopulatedRound(route.params.id as string)
useLoadingWatcher(isLoading, round, 'Round fully populated')

provide(roundKey, { round, isLoading })
</script>
