<template>
  <main class="space-y-4 relative">
    <RoundRealFixturePointColumns :round="round" :realFixtures="realFixtures" class="sticky top-0" />
    <div v-for="(dateGroup, di) in groupedRealFixtures" :key="di" class="space-y-4">
      <h3 class="font-mono font-bold bg-gray-50">{{ dateGroup.dateLabel }}</h3>
      <div>
        <div v-for="(rf, rfi) in dateGroup.realFixtures" :key="rf?.id" class="lg:flex items-center py-4 hover:bg-gray-100">
          <NuxtLink :to="useSL(`round/${route.params.rid}/match/${rf?.id}`)" class="block flex-1">
            <div class="grid grid-cols-[2rem_4rem_3rem_1fr_3rem] gap-4">
              <div class="font-mono">{{ (rf.$index + 1).toString().padStart(2, '0') }}</div>
              <div class="font-mono">{{ $day(rf?.startingAt).format('HH:mm') }}</div>
              <div v-highlight="rf" class="tabular-nums">{{ rf?.liveMinute?.padStart(2, '0') }}</div>
              <div class="min-w-0 truncate">{{ rf?.name }}</div>
              <div v-highlight="rf">{{ rf?.result }}</div>
            </div>
            <div>
              <div v-for="$challenge of rf?.$challenges" class="flex justify-between">
                <div class="font-mono text-sm inline">{{ `${$challenge.id} / ${$challenge.name} / ${$challenge.type}` }}</div>
                <div class="font-mono text-sm inline" :class="$challenge.$userBet?.potentialPoints ? '' : 'text-gray-200'">{{ $challenge.$userBet?.bet }}</div>
              </div>
            </div>
          </NuxtLink>
          <div class="flex-2 bg-blue-200 h-12"></div>
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

const route = useRoute()
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
