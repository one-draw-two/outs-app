<template>
  <main>
    <h1>Season {{ season?.name }}</h1>
    <div class="size-48 bg-cover bg-center bg-no-repeat" :style="{ backgroundImage: season?.blueprint?.bgUrl ? `url(${getSanityUrl(season.blueprint?.bgUrl)})` : 'none' }"></div>

    <div class="space-y-8">
      <details v-for="stage in season?.stages" :key="stage.id" open>
        <summary>{{ stage.name }}</summary>

        <NuxtLink v-for="round in stage.rounds" :key="round.id" :to="`/round/${round.id}`" class="flex gap-8" :class="round.status === 'current' ? 'bg-green-500' : ''">
          <div class="w-32">
            {{ round.name }}
          </div>
          <div>
            {{ round.status }}
          </div>
        </NuxtLink>
      </details>
    </div>
  </main>
</template>

<script setup lang="ts">
import { getSanityUrl } from '~/composables/useHelpers'

const route = useRoute()

definePageMeta({ layout: 'season' })
useHead({ title: `Season ${route.params.id}` })

const { data: season, isLoading } = await useSeasonWithStages(route.params.id as string)
useLoadingWatcher(isLoading, season, 'Season fully populated')
</script>
