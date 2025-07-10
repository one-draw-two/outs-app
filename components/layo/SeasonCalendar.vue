<template>
  <div>
    <div class="py-8 bg-repeat-xX bg-none bg-[length:512px_auto] relative" :style="{ backgroundImage: season?.bgUrl ? `none` : 'none' }">
      <div class="absolute inset-0 bg-gradient-to-tXfrom-black/60 to-black/10 pointer-events-none"></div>
      <div class="main-container space-y-8 relative z-10 overflow-x-auto hide-scroll w-full whitespace-nowrap" style="scroll-padding-left: 2rem; scroll-padding-right: 2rem">
        <h1 class="sticky left-0 text-5xl stroke-text">Season {{ season?.name }}</h1>
        <SeasonHorizontalCalendar />
      </div>
    </div>
    <div class="bg-gray-200/20 border-t border-gray-300/30">
      <main class="main-container py-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _Season } from '~/types'
const season = useState<_Season>('season')
wecl(season)
</script>
