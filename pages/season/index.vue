<template>
  <h1>All avaliable seasons</h1>
  <div class="space-y-4">
    <NuxtLink class="block" v-for="season of seasons" :to="`/season/${season.id}`">{{ season.id }} / {{ season.name }}</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { _Season } from '~/types'
definePageMeta({ layout: 'season' })
useHead({ title: 'Outstanding' })

const _bpSeason = 'BSPV2425'
const { data: seasons } = await usePSWatch<_Season>('SELECT * FROM "calendar_seasons" WHERE "_bpSeason" = ?', [_bpSeason])
</script>
