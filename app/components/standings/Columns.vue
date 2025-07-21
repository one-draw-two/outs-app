<template>
  <div class="flex gap-4">
    <!-- Children Standings Columns -->
    <template v-if="childrenStandings?.length > 0">
      <!-- Spanned Header for Children -->
      <div v-if="headerType === 'spanned'" class="flex gap-4">
        <div :style="{ width: `${childrenStandings.length * 3 + (childrenStandings.length - 1) * 1}rem` }">
          <UtilLineBar color="blue-500" background-color="white" text-color="gray-700" variant="subtle">
            <span class="text-xs font-medium">Contributions</span>
          </UtilLineBar>
        </div>
      </div>
      <!-- Individual columns for Simple Header or Data -->
      <template v-else>
        <div v-for="(cs, csi) of childrenStandings" :key="cs.id" class="w-12">
          <UtilLineBar v-if="headerType === 'simple'" color="blue-500" background-color="white" text-color="gray-700" variant="subtle">
            <NuxtLink :to="useSL(`standings/${cs.id}`)" class="text-xs"> R{{ csi + 1 }} </NuxtLink>
          </UtilLineBar>
          <div v-else class="bg-gray-100 rounded-md h-6"></div>
        </div>
      </template>
    </template>

    <!-- Points Columns -->
    <!-- Spanned Header for Points -->
    <div v-if="headerType === 'spanned'" class="flex gap-4">
      <div :style="{ width: `${filteredScopedTournamnetPointsDef.length * 8 + (filteredScopedTournamnetPointsDef.length - 1) * 1}rem` }">
        <UtilLineBar color="green-500" background-color="white" text-color="gray-700" variant="subtle">
          <span class="text-xs font-medium">Points</span>
        </UtilLineBar>
      </div>
    </div>
    <!-- Individual columns for Simple Header or Data -->
    <template v-else>
      <div
        v-for="(pointItem, displayIndex) in filteredScopedTournamnetPointsDef"
        :key="pointItem.originalIndex"
        class="tabular-nums text-right w-32 px-2"
        :class="headerType === 'simple' ? ['cursor-pointer', { 'text-blue-100': sortBy?.index === pointItem.originalIndex }] : []"
        @click="headerType === 'simple' ? $emit('sortByPointIndex', pointItem.originalIndex) : undefined"
      >
        <UtilLineBar v-if="headerType === 'simple'" color="blue-500" background-color="white" text-color="gray-700" variant="subtle">
          <span class="text-xs">{{ pointItem.pointDef.label }}</span>
        </UtilLineBar>
        <span v-else>{{ row?.points?.[pointItem.originalIndex] }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { _Standing, ParsedBPTournament } from '~/../types'

interface Props {
  childrenStandings: _Standing[]
  scopedTournamnetPointsDef: Array<{ isDisplayed: boolean; label: string }>
  headerType?: 'spanned' | 'simple' | 'data'
  row?: any
  sortBy?: { index: number }
}

const props = defineProps<Props>()
defineEmits<{
  sortByPointIndex: [index: number]
}>()

// Keep track of original indices when filtering
const filteredScopedTournamnetPointsDef = computed(() => props.scopedTournamnetPointsDef.map((pointDef, originalIndex) => ({ pointDef, originalIndex })).filter(({ pointDef }) => pointDef.isDisplayed))
</script>
