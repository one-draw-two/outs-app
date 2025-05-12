<template>
  <div class="space-y-8">
    <div :class="`bg-${round?._stage?.color}-500/50`">
      <div class="h-12 main-container flex gap-8 items-center">
        <h1>Round {{ round?.name }}</h1>
        <div class="flex-1 flex justify-end gap-8">
          <p>Deadline {{ $day(round?._h_roundDeadline).format('ddd DD/MM HH:mm') }}</p>
          <p v-highlight="round">Cursor {{ round?._h_lastFinishedMatchIndex }}</p>
          <p v-highlight="round">{{ round?.status }}</p>
        </div>
      </div>
    </div>

    <div class="main-container flex gap-8">
      <div class="flex-1 space-y-8">
        <div class="flex gap-8">
          <NuxtLink :to="useSL(`round/${round?.id}`)"><h2>Overview</h2></NuxtLink>
          <NuxtLink :to="useSL(`round/${round?.id}/matches`)"><h2>Matches</h2></NuxtLink>
          <NuxtLink :to="useSL(`round/${round?.id}/challenges`)"><h2>Challenges</h2></NuxtLink>
          <NuxtLink :to="useSL(`round/${round?.id}/fixtures`)"><h2>Fixtures</h2></NuxtLink>
        </div>
      </div>
    </div>

    <div class="main-container">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _P_Bet } from '~/types'

import { useRoute as useNativeRoute } from 'vue-router' // Necessary in layouts (Nuxt router limitation)

const rid = useNativeRoute().params.rid as string

const { data: round, isLoading } = await usePopulatedRound(rid as string)
useLoadingWatcher(round, 'Round fully populated')

const { data: bets } = (await usePopulatedBet({ roundId: rid as string })) as { data: Ref<_P_Bet[]> }
useLoadingWatcher(bets, 'Bets fully populated')

useState<any>('pickerSeasonId').value = round.value?._season
useState<any>('pickerStageId').value = round.value?._stage?.id

provide(roundKey, { round, bets, isLoading })

useState<any>('powerSyncParams').value = { selected_round: rid } // Need to decide whether to move above usePopulatedRound or not
</script>
