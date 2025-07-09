<template>
  <div class="relative">
    <div class="pb-8 flex items-center justify-between">
      <div class="flex gap-4">
        <h1>{{ standingsName }}</h1>
        <NuxtLink v-if="standings?._parentGroup" :to="useSL(`standings/${standings?._parentGroup}`)" class="block"> Parent </NuxtLink>
        <NuxtLink v-if="childrenFixtures?.length > 0" :to="useSL(`standings/${standings?.id}/fixtures`)" class="block"> Fixtures </NuxtLink>
      </div>

      <div class="flex gap-4 items-center">
        <FormsToggleSwitch />
        <button @click="shufflePoints" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">Shuffle Points</button>
      </div>
    </div>

    <div class="bg-white z-3 sticky top-0">
      <!-- Top header row with spanned titles -->
      <div class="z-1 relative flex py-2 border-y border-gray-500/10">
        <div class="flex-1 flex gap-2" />
        <StandingsColumns :children-standings="childrenStandings" :scoped-tournamnet-points-def="scopedTournamnetPointsDef" header-type="spanned" />
      </div>
      <!-- Original header row -->
      <div class="z-1 relative flex py-4 border-b border-gray-500/10">
        <div class="flex-1 flex gap-2">
          <div class="tabular-nums w-8">#</div>
          <div>User</div>
        </div>
        <StandingsColumns
          :children-standings="childrenStandings"
          :scoped-tournamnet-points-def="scopedTournamnetPointsDef"
          :sort-by="sortBy"
          header-type="simple"
          @sort-by-point-index="sortByPointIndex"
        />
      </div>
    </div>

    <TransitionGroup tag="div" name="standing-row" class="relative standings-list">
      <div
        v-for="(row, ri) of sortedRows"
        :key="row._user.id || ri"
        class="flex py-2 border-b border-gray-100 gap-8"
        :class="[row.isCurve ? 'bg-yellow-50 text-yellow-800 font-medium' : 'bg-white', rowClass]"
      >
        <div class="flex-1 flex gap-2 truncate">
          <div class="tabular-nums w-8 shrink-0">{{ row.isCurve ? '—' : ri + 1 - sortedRows.slice(0, ri).filter((r: any) => r.isCurve).length }}</div>
          <div class="flex-1 truncate">{{ row._user.name }}</div>
        </div>
        <StandingsColumns :children-standings="childrenStandings" :scoped-tournamnet-points-def="scopedTournamnetPointsDef" :row="row" header-type="data" />
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { _Standing, ParsedBPTournament } from '~/types'

interface Props {
  standings: any
  childrenStandings: _Standing[]
  childrenFixtures: any[]
  tournament?: ParsedBPTournament
  rowClass?: string
}

const props = withDefaults(defineProps<Props>(), { rowClass: '' })

const scopedTournamnetPointsDef = computed(() => props.tournament?.pointsDef?.[props.standings._link._refColl?.toLowerCase() as keyof ParsedBPTournament['pointsDef']] || [])
const standingsName = computed(() => props.standings?.name || 'Standings')
const localRows = ref<any>([])
const sortBy = ref({ index: 0 })

watchEffect(() => (localRows.value = props.standings?.rows ? JSON.parse(JSON.stringify(props.standings.rows)) : []))

// Function to sort by specific point index
const sortByPointIndex = (index: number) => {
  sortBy.value.index = index
}

// Sort rows by points descending
const sortedRows = computed<any>(() => {
  if (!localRows.value?.length) return []

  // Define a type that matches your row structure
  type StandingRow = {
    _user: { id: string; name: string }
    points: number[]
    isCurve?: boolean
  }

  // Create pseudo rows for curves
  const curveRows: StandingRow[] = []
  const curves = props.standings?.stats_numbers?.curves

  if (curves?.length >= 3) {
    curveRows.push(
      { _user: { id: 'hi-curve', name: 'HI' }, points: [curves[0]], isCurve: true },
      { _user: { id: 'mi-curve', name: 'MI' }, points: [curves[1]], isCurve: true },
      { _user: { id: 'lo-curve', name: 'LO' }, points: [curves[2]], isCurve: true }
    )
  }

  const combined: StandingRow[] = [...localRows.value, ...curveRows]

  return combined.sort((a: StandingRow, b: StandingRow) => {
    const pointsA = Array.isArray(a.points) ? a.points[sortBy.value.index] ?? 0 : sortBy.value.index === 0 ? a.points : 0
    const pointsB = Array.isArray(b.points) ? b.points[sortBy.value.index] ?? 0 : sortBy.value.index === 0 ? b.points : 0

    return pointsB - pointsA // Always descending
  })
})

const shufflePoints = () => {
  if (!localRows.value?.length) return
  localRows.value = localRows.value.map((row: any) => {
    const randomPoints = Math.floor(Math.random() * 100) + 50
    if (Array.isArray(row.points)) return { ...row, points: [randomPoints, ...row.points.slice(1)] }
    return { ...row, points: randomPoints }
  })
}

defineExpose({
  sortedRows,
  localRows,
})
</script>
