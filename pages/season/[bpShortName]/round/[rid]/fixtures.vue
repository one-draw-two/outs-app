<template>
  <main class="space-y-8">
    <h2>FIXTURES</h2>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'round' })
const { round, isLoading } = inject(roundKey)!
useHead({ title: `${round.value?.name} | Fixtures` })

useState<any>('powerSyncParams').value = { selected_round: round.value?.id }

await sleep(1000) // Wait for the round to be populated
const { data: roundWithDynamicGroups, isLoading: ilrdg } = await usePopulatedRound(round.value?.id)
useLoadingWatcher(ilrdg, roundWithDynamicGroups, 'Round fully populated')
</script>
