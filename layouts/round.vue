<template>
  <div class="space-y-8">
    <div :class="`bg-${stage?.color}-500/50`">
      <div class="h-12 main-container flex gap-8 items-center">
        <div class="flex gap-4">
          <NuxtLink :to="useSL(`stage/${round?._stage}`)">Stage {{ stage?.name }}</NuxtLink>
          <NuxtLink :to="useSL(`round/${round?.id}`)">Round {{ round?.name }}</NuxtLink>
        </div>

        <div class="flex-1 flex justify-end gap-8">
          <NuxtLink :to="useSL(`round/${round?.id}/challenges`)">Challenges Deadline {{ $day(round?._h_roundDeadline).format('ddd DD/MM HH:mm') }}</NuxtLink>
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
import type { _P_Season } from '~/types'
import { useRoute as useNativeRoute } from 'vue-router' // Necessary in layouts (Nuxt router limitation)

const rid = useNativeRoute().params.rid as string

const season = useState<_P_Season>('season')
const stage = useState<any>('stage')

const { data: round } = await usePopulatedRound(rid)

useState<any>('pickerSeasonId').value = round.value?._season
useState<any>('pickerStageId').value = round.value?._stage

useDynamicPS().updatePowerSyncParams({ selected_round: rid })

const sKey = 'real-fixture'
const roundTournaments = computed(() => (season.value?.tournaments?.filter((t) => t.snapshotConfig?.some((c) => c.name === sKey)) || []).sort((a, b) => getOrder(a, sKey) - getOrder(b, sKey)))
const headers = computed(() => [{ name: 'Result' }, { name: 'You' }, ...(roundTournaments.value?.map((t) => ({ name: t.name })) || [])])

provide(roundKey, { round, tournamentCols: headers })

wecl(round)
</script>
