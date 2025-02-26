<template>
  <main class="space-y-8">
    <h2>Challenges</h2>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'round' })
const { round, isLoading } = inject(roundKey)!
useHead({ title: `${round.value?.name} | Challenges` })
</script>
