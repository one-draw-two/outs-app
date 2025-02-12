<template>
  <h1>Season {{ selectedSeason?.name }}</h1>
  <div class="size-128 bg-cover bg-center bg-no-repeat" :style="{ backgroundImage: selectedSeason?.bgUrl ? `url(${selectedSeason.bgUrl})` : 'none' }"></div>
</template>

<script setup lang="ts">
const route = useRoute()

definePageMeta({ layout: 'season' })
useHead({ title: `Season ${route.params.id}` })

const { selectedSeason, isLoading } = useSeasonWithStages(route.params.id as string)

useLoadingWatcher(isLoading, selectedSeason, 'Season fully populated')
</script>
