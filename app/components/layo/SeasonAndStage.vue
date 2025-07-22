<template>
  <div class="space-y-8">
    <div class="h-48 flex items-center bg-gray-200 bg-repeat-xXbg-[length:256px_auto] relative" :style="{ backgroundImage: season?.bgUrl ? `url(${getSanityUrl(season.bgUrl)}xx)` : 'none' }">
      <div class="absoluteXinset-x-0 top-6 bottom-0 bg-gradient-to-t from-black/90 via-black/80 to-transparent pointer-events-none"></div>
      <div class="space-y-8 relative z-10 overflow-x-auto hide-scroll w-full whitespace-nowrap" style="scroll-padding-left: 2rem; scroll-padding-right: 2rem">
        <NuxtLink v-if="false" :to="useSL(`campaign/${season?.id}`)" class="block">
          <h1 class="sticky left-0 text-5xl stroke-text">Season {{ season?.name }}</h1>
        </NuxtLink>
        <SeasonHorizontalCalendar />
      </div>
    </div>
    <main class="main-container">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import type { _Season } from '~/../types'
const season = useState<_Season>('season')
</script>
