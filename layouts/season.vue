<template>
  <div>
    <div v-if="season?.blueprint" class="h-48 bg-repeat-x bg-[length:512px_auto]" :style="{ backgroundImage: season?.blueprint?.bgUrl ? `url(${getSanityUrl(season.blueprint?.bgUrl)})` : 'none' }">
      <div class="main-container flex justify-between items-center h-full">
        <h1 class="text-5xl stroke-text">Season {{ season?.name }}</h1>
      </div>
    </div>

    <div class="main-container py-8">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _P_Season } from '~/types'
const season = useState<_P_Season>('season')
</script>
