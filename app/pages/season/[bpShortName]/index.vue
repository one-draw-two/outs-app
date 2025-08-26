<template>
  <div>
    <div v-if="loading" class="main-container py-8">
      <p>Loading season data...</p>
    </div>
    <template v-else>
      <div class="h-48 bg-repeat-x bg-[length:512px_auto]" :style="{ backgroundImage: bpSeason?.bgUrl ? `url(${getSanityUrl(bpSeason?.bgUrl)})` : 'none' }">
        <div class="main-container flex justify-between items-center h-full">
          <h1 class="text-5xl stroke-text">Season {{ bpSeason?.name }}</h1>
        </div>
      </div>
      <main class="main-container py-8 space-y-4">
        <h1>All avaliable seasons</h1>
        <NuxtLink class="block" v-for="season of seasons" :to="useSL(`campaign/${season.id}`)">{{ season.id }} / {{ season.name }}</NuxtLink>
      </main>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { _BPSeasonRecord, _Season } from '~/../types'

const loading = ref(true)
const bpShortName = useRoute().params.bpShortName
const bpsQuery = usePSWatch<_BPSeasonRecord>('SELECT * FROM "blueprint_seasons" WHERE "shortName" = ?', [bpShortName])
await bpsQuery.await()

const bpSeason = computed(() => bpsQuery.data.value[0])

if (!bpSeason.value) {
  // If bpSeason is undefined/empty, wait for 2 seconds to allow data to sync
  console.log('WAITING BECAUSE NEW USER AND PS IS EMPTY')
  await new Promise((resolve) => setTimeout(resolve, 2000))
  // Re-check after waiting
  await bpsQuery.await()
}

const { data: seasons } = usePSWatch<_Season>('SELECT * FROM "calendar_seasons" WHERE "_bpSeason" = ?', [bpSeason.value?.id])
loading.value = false

const pageTitle = computed(() => `Season ${bpSeason.value?.name ?? ''}`)
useHead({ title: pageTitle })
</script>
