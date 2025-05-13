<template>
  <div>
    <div class="h-48 bg-repeat-x bg-[length:512px_auto]" :style="{ backgroundImage: season.bgUrl ? `url(${getSanityUrl(season.bgUrl)})` : 'none' }">
      <div class="main-container flex justify-between items-center h-full">
        <h1 class="text-5xl stroke-text">Season {{ season?.name }}</h1>
      </div>
    </div>
    <main class="main-container py-8">
      <details v-for="stage in season?.stages" :key="stage.id" :open="stage.status !== 'unknown'">
        <summary class="flex gap-8">
          <NuxtLink :to="useSL(`stage/${stage.id}`)">{{ stage.name }}</NuxtLink>
          <span>{{ stage.status }}</span>
        </summary>

        <div class="flex gap-8 items-stretch">
          <div>
            <NuxtLink v-for="round in stage.rounds" :to="useSL(`round/${round.id}`)" class="flex gap-8" :class="round.status === 'current' ? 'bg-green-500' : ''">
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
import type { _Season, _Stage, _Round } from '~/types'
const season = useState<any>('season')
watch(toRef(useRoute().params.sid as string), async (to) => !to || season.value?.id === to || (useState<any>('season').value = (await usePopulatedSeason(to)).data.value), { immediate: true })
const pageTitle = computed(() => `Season ${season.value?.name}`)
useHead({ title: pageTitle })
</script>
