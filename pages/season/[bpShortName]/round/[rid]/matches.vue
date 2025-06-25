<template>
  <main class="space-y-4 relative">
    <RealFixturePointColumns class="sticky top-0 h-24" />
    <div v-for="(dateGroup, di) in groupedRealFixtures" :key="di" class="space-y-4">
      <h3 class="font-mono font-bold bg-gray-50">{{ dateGroup.dateLabel }}</h3>
      <div>
        <div v-for="rf in dateGroup.realFixtures" :key="rf.$index" :id="`rfi-${rf.$index}`" class="lg:flex items-stretch py-4 hover:bg-gray-100">
          <RealFixtureItemLink :rf="rf" class="flex-1" />
          <RealFixturePointRows :rf="rf" class="flex-2" />
        </div>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import type { _RealFixture } from '~/types'

definePageMeta({ layout: 'round' })
const { round } = inject(roundKey)!
useHead({ title: `${round.value?.name} | Matches` })

const $day = useNuxtApp().vueApp.config.globalProperties.$day

const realFixtures = computed(() => round.value?.snapshots?.map((s: any) => s._realFixture).filter(Boolean))

const groupedRealFixtures = computed(() => {
  if (!realFixtures.value?.length) return []

  const groups = realFixtures.value.reduce((acc: Record<string, _RealFixture[]>, fixture: _RealFixture) => {
    const date = fixture.startingAt!.split('T')[0].split(' ')[0]
    if (!acc[date]) acc[date] = []
    acc[date].push(fixture)
    return acc
  }, {})

  return Object.entries(groups).map(([date, fixtures]) => ({
    date,
    dateLabel: $day(date).format('ddd DD/MM'),
    realFixtures: fixtures as _RealFixture[],
  }))
})
</script>
