<template>
  <h1>Round {{ selectedRound?.name }}</h1>
  <p>
    {{ selectedRound }}
  </p>
</template>

<script setup lang="ts">
const route = useRoute()

// definePageMeta({ layout: 'season' })
useHead({ title: `Round ${route.params.id}` })

const { selectedRound, isLoading } = usePopulatedRound(route.params.id as string)
</script>
