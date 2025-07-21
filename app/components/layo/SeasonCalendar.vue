<template>
  <div>
    <div class="py-8 bg-repeat-x bg-[length:512px_auto] relative" :style="{ backgroundImage: season?.bgUrl ? `url(${getSanityUrl(season.bgUrl)})` : 'none' }">
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 to-black/80 pointer-events-none"></div>
      <div class="main-container space-y-8 relative z-10 overflow-x-auto hide-scroll w-full whitespace-nowrap" style="scroll-padding-left: 2rem; scroll-padding-right: 2rem">
        <NuxtLink :to="useSL(`campaign/${season?.id}`)" class="block">
          <h1 class="sticky left-0 text-5xl stroke-text">Season {{ season?.name }}</h1>
        </NuxtLink>
        <SeasonHorizontalCalendar />
      </div>
    </div>
    <main class="main-container py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import type { _Season } from '~/../types'
const season = useState<_Season>('season')
</script>
