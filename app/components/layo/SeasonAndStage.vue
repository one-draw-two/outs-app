<template>
  <div>
    <div class="relative py-8 space-y-8 bg-gray-200 bg-repeat-xXbg-[length:256px_auto]" :style="{ backgroundImage: season?.bgUrl ? `url(${getSanityUrl(season?.bgUrl)}xx)` : 'none' }">
      <div class="space-y-4 relative z-10 overflow-x-auto hide-scroll w-full whitespace-nowrap" style="scroll-padding-left: 2rem; scroll-padding-right: 2rem">
        <SeasonHorizontalCalendar />
      </div>
      <div class="main-container">
        <div class="flex items-center justify-between">
          <div class="h-10 flex items-center gap-2 px-4 p-2 bg-white rounded-md border-indigo-500/20 border">
            <h2 class="font-bold text-xs pr-2X">Season details</h2>
            <div v-if="true" v-for="t of tournaments" :key="t.id">
              <img :src="`/svg/${t.name}.svg`" class="size-6" :alt="t.name" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { _P_Season } from '~/../types'
const season = useState<_P_Season>('season')

wecl(season)

const tournaments = computed(() => season.value?.tournaments?.filter((t) => t.name !== 'Campaign'))
</script>
