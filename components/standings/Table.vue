<template>
  <div>
    <div class="flex items-center justify-between" v-if="showHeader">
      <div class="flex gap-4">
        <h1>{{ standingsName }}</h1>
        <NuxtLink v-if="standings?._parentGroup" :to="useSL(`standings/${standings?._parentGroup}`)" class="block"> Parent </NuxtLink>
      </div>

      <button v-if="allowShuffle" @click="shufflePoints" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">Shuffle Points</button>
    </div>

    <div class="flex py-4">
      <div class="flex-1 flex gap-2">
        <div class="tabular-nums w-12">#</div>
        <div>User</div>
      </div>
      <div>Points</div>
    </div>

    <TransitionGroup tag="div" name="standing-row" class="relative standings-list">
      <div
        v-for="(row, ri) of sortedRows"
        :key="row._user.id || ri"
        class="flex py-2 border-b border-gray-100 standing-row"
        :class="[row.isCurve ? 'bg-yellow-50 text-yellow-800 font-medium' : 'bg-white', rowClass]"
      >
        <div class="flex-1 flex gap-2">
          <div class="tabular-nums w-12">{{ row.isCurve ? '—' : ri + 1 - sortedRows.slice(0, ri).filter((r: any) => r.isCurve).length }}</div>
          <div>{{ row._user.name }}</div>
        </div>
        <div class="tabular-nums text-right w-16">{{ row.points?.[0] }}</div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'

const props = defineProps({
  standings: {
    type: Object,
    required: true,
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  allowShuffle: {
    type: Boolean,
    default: false,
  },
  rowClass: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['shuffle-complete'])

const standingsName = computed(() => props.standings?.name || 'Standings')
const localRows = ref<any>([])

watchEffect(() => {
  if (props.standings?.rows) {
    localRows.value = JSON.parse(JSON.stringify(props.standings.rows))
  }
})

// Sort rows by points descending
// Update the sortedRows computed property to include curve indicators
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

  console.log('Curves:', curves)

  if (curves?.length >= 3) {
    curveRows.push(
      { _user: { id: 'hi-curve', name: 'HI' }, points: [curves[0]], isCurve: true },
      { _user: { id: 'mi-curve', name: 'MI' }, points: [curves[1]], isCurve: true },
      { _user: { id: 'lo-curve', name: 'LO' }, points: [curves[2]], isCurve: true }
    )
  }

  const combined: StandingRow[] = [...localRows.value, ...curveRows]

  return combined.sort((a: StandingRow, b: StandingRow) => {
    const pointsA = Array.isArray(a.points) ? a.points[0] : a.points
    const pointsB = Array.isArray(b.points) ? b.points[0] : b.points
    return pointsB - pointsA
  })
})

const shufflePoints = () => {
  if (!localRows.value?.length) return
  localRows.value = localRows.value.map((row: any) => {
    const randomPoints = Math.floor(Math.random() * 100) + 50
    if (Array.isArray(row.points)) return { ...row, points: [randomPoints, ...row.points.slice(1)] }
    return { ...row, points: randomPoints }
  })
  emit('shuffle-complete', localRows.value)
}

defineExpose({
  sortedRows,
  localRows,
  shufflePoints,
})
</script>
