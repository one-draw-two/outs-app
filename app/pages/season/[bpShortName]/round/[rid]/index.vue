<template>
  <LayoRound>
    <main class="space-y-4 relative">
      <RealFixturePointColumns class="sticky top-0 max-lg:-top-32 z-10">
        <RoundHorizontalProgress :round="round" :status-color="`bg-${round.$statusColor}-500`" />
      </RealFixturePointColumns>
      <div v-for="(dateGroup, di) in groupedRealFixtures" :key="di" class="space-y-4">
        <h3 class="font-bold bg-gray-50">{{ dateGroup.dateLabel }}</h3>
        <div>
          <div
            v-for="rf in dateGroup.realFixtures"
            :key="rf.$index"
            :id="`rfi-${rf.$index}`"
            class="lg:flex items-stretch py-4 hover:bg-gray-100"
            @mouseenter="setHoveredItem(rf.$index)"
            @mouseleave="clearHoveredItem"
          >
            <RealFixtureItemLink :rf="rf" :isHovered="hoveredItemIndex === rf.$index" class="lg:w-1/2" />
            <RealFixturePointRows :rf="rf" class="flex-2 max-lg:hidden" />
          </div>
        </div>
      </div>
    </main>
  </LayoRound>
</template>

<script setup lang="ts">
import type { _P_Round, _RealFixture } from '~/../types'

definePageMeta({ middleware: 'round' })
const round = useState<_P_Round>('round')
useHead({ title: `${round.value?.name} | Matches` })

const $day = useNuxtApp().vueApp.config.globalProperties.$day

const realFixtures = computed(() => round.value?.snapshots?.map((s: any) => s.$realFixture).filter(Boolean))

// wecl(realFixtures)

const groupedRealFixtures = computed(() => {
  if (!realFixtures.value?.length) return []

  const groups = (realFixtures.value ?? []).reduce((acc: Record<string, _RealFixture[]>, fixture: _RealFixture) => {
    const startingAt = fixture.startingAt
    if (!startingAt) return acc

    // Parse the date to ensure consistency
    const date = $day(startingAt).format('YYYY-MM-DD') // Normalize to a consistent format
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

// wecl(groupedRealFixtures)

// Hover state management
const hoveredItemIndex = ref<number | null>(null)
const setHoveredItem = (index: number) => (hoveredItemIndex.value = index)
const clearHoveredItem = () => (hoveredItemIndex.value = null)
</script>
