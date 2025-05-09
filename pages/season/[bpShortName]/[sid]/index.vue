<template>
  <div>
    <div class="h-48 bg-repeat-x bg-[length:512px_auto]" :style="{ backgroundImage: season ? `url(${getSanityUrl(season?.bgUrl!)})` : 'none' }">
      <div class="main-container flex justify-between items-center h-full">
        <h1 class="text-5xl stroke-text">Season {{ season?.name }}</h1>
      </div>
    </div>
    <main class="main-container py-8">
      <details v-for="stage in season?.stages" :key="stage.id" :open="stage.status !== 'unknown'">
        <summary class="flex gap-8">
          <NuxtLink :to="`${$route.path}/stage/${stage.id}`">{{ stage.name }}</NuxtLink>
          <span>{{ stage.status }}</span>
        </summary>

        <div class="flex gap-8 items-stretch">
          <div>
            <NuxtLink v-for="round in stage.rounds" :to="`${$route.path}/stage/${stage.id}/round/${round.id}`" class="flex gap-8" :class="round.status === 'current' ? 'bg-green-500' : ''">
              <div class="font-mono">
                {{ round.name }}
              </div>
              <div>
                {{ round.status }}
              </div>
            </NuxtLink>
          </div>
          <div class="bg-blue-200 flex-1"></div>
        </div>
      </details>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { _P_Season } from '~/types'
// definePageMeta({ layout: 'season' })
const season = useState<_P_Season>('season')
const pageTitle = computed(() => `Season ${season.value?.name}`)
useHead({ title: pageTitle })
</script>
