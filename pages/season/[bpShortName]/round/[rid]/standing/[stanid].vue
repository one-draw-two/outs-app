<template>
  <main class="relative">
    <div class="flex items-center justify-between">
      <h1>{{ standings?.name }}</h1>

      <button @click="shufflePoints" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">Shuffle Points</button>
    </div>

    <div class="flex py-4">
      <div class="flex-1 flex gap-2">
        <div class="tabular-nums w-12">#</div>
        <div>User</div>
      </div>
      <div>Points</div>
    </div>

    <TransitionGroup tag="div" name="standing-row" class="relative standings-list">
      <div v-for="(row, ri) of sortedRows" :key="row._user.id || ri" class="flex py-2 bg-white border-b border-gray-100 standing-row">
        <div class="flex-1 flex gap-2">
          <div class="tabular-nums w-12">{{ ri + 1 }}</div>
          <div>{{ row._user.name }}</div>
        </div>
        <div class="tabular-nums text-right w-16">{{ row.points?.[0] }}</div>
      </div>
    </TransitionGroup>
  </main>
</template>

<script setup lang="ts">
import type { _P_RealFixture } from '~/types'

definePageMeta({ layout: 'round' })

const stanid = useRoute().params.stanid
const { processedGroups } = await useGroupsWithUsers({ id: stanid }, false)

const standings = computed(() => processedGroups?.value?.[0])
const localRows = ref<any>([])

watchEffect(() => {
  if (standings.value?.rows) localRows.value = JSON.parse(JSON.stringify(standings.value.rows))
})

// Sort rows by points descending
const sortedRows = computed<any>(() => {
  if (!localRows.value?.length) return []
  return [...localRows.value].sort((a: any, b: any) => {
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
}

const pageTitle = computed(() => `Standing ${stanid}`)
useHead({ title: pageTitle })
</script>
