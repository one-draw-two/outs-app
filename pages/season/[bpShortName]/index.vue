<template>
  <div>
    <div class="h-48 bg-repeat-x bg-[length:512px_auto]" :style="{ backgroundImage: bpSeason ? `url(${getSanityUrl(bpSeason?.bgUrl!)})` : 'none' }">
      <div class="main-container flex justify-between items-center h-full">
        <h1 class="text-5xl stroke-text">Season {{ bpSeason?.name }}</h1>
      </div>
    </div>
    <main class="main-container py-8 space-y-4">
      <h1>All avaliable seasons</h1>
      <NuxtLink class="block" v-for="season of seasons" :to="useSL(`campaign/${season.id}`)">{{ season.id }} / {{ season.name }}</NuxtLink>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { _BPSeasonRecord, _Season } from '~/types'

const bpShortName = useRoute().params.bpShortName
const bpsQuery = usePSWatch<_BPSeasonRecord>('SELECT * FROM "blueprint_seasons" WHERE "shortName" = ?', [bpShortName])
await bpsQuery.await()

const bpSeason = computed(() => bpsQuery.data.value[0])

const { data: seasons } = usePSWatch<_Season>('SELECT * FROM "calendar_seasons" WHERE "_bpSeason" = ?', [bpSeason.value?.id])

const pageTitle = computed(() => `Season ${bpSeason.value?.name ?? ''}`)
useHead({ title: pageTitle })
</script>
