<template>
  <div>
    <div v-if="season?.blueprint" class="h-48 bg-repeat-x bg-[length:512px_auto]" :style="{ backgroundImage: season?.blueprint?.bgUrl ? `url(${getSanityUrl(season.blueprint?.bgUrl)})` : 'none' }">
      <div class="main-container flex justify-between items-center h-full">
        <h1 class="text-5xl italic font-[900] text-white text-stroke">Season {{ season?.name }}</h1>
      </div>
    </div>
    <div class="main-container py-8">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute as useNativeRoute } from 'vue-router'
const nativeRoute = useNativeRoute()

const { data: season, isLoading } = await useSeasonWithStages(nativeRoute.params.sid as string)
useLoadingWatcher(isLoading, season, 'Season fully populated')

// const { data: season, isLoading } = await useSeasonWithStages(route.params.id as string)
// useLoadingWatcher(isLoading, season, 'Season fully populated')

useState<any>('pickerSeason').value = season.value?.id

provide(seasonKey, { season, isLoading })
</script>
