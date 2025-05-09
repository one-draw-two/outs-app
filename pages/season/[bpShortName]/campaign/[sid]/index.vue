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

const sid = useRoute().params.sid
const { data: seasons } = usePSWatch<_Season>('SELECT * FROM "calendar_seasons" WHERE id = ?', [sid])
const { data: stages } = usePSWatch<_Stage>('SELECT * FROM "calendar_stages" WHERE _season = ? ORDER BY sePI ASC', [sid])
const { data: rounds } = usePSWatch<_Round>('SELECT * FROM "calendar_rounds" WHERE _season = ? ORDER BY sePI ASC', [sid])

const season = computed(() => ({ ...seasons.value[0], stages: stages.value?.map((stage) => ({ ...stage, rounds: rounds.value?.filter((round) => round._stage === stage.id) || [] })) || [] }))

const pageTitle = computed(() => `Season ${season.value?.name}`)
useHead({ title: pageTitle })
</script>
