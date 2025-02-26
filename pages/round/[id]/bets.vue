<template>
  <main class="space-y-8">
    <h2>Bets</h2>
    <BetsTest class="space-y-8" />
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'round' })
const { round, isLoading } = inject(roundKey)!
useHead({ title: `${round.value?.name} | Bets` })
</script>
