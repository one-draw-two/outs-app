<template>
  <h1>Season {{ selectedSeason?.name }}</h1>
  <div
    class="size-128 bg-cover bg-center bg-no-repeat"
    :style="{ backgroundImage: selectedSeason?.bgUrl ? `url(${getSanityUrl(selectedSeason.bgUrl)})` : 'none' }"
  ></div>

  <div class="space-y-8">
    <details v-for="stage in selectedSeason?.stages" :key="stage.id" open>
      <summary>{{ stage.name }}</summary>

      <NuxtLink v-for="round in stage.rounds" :key="round.id" :to="`/round/${round.id}`" class="block">
        {{ round.name }}
      </NuxtLink>
    </details>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

definePageMeta({ layout: 'season' })
useHead({ title: `Season ${route.params.id}` })

const { selectedSeason, isLoading } = useSeasonWithStages(route.params.id as string)

useLoadingWatcher(isLoading, selectedSeason, 'Season fully populated')

// wecl(selectedSeason)
</script>
