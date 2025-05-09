<template>
  <main class="space-y-4 relative">
    <h1>Round overview</h1>
  </main>
</template>
<script setup lang="ts">
import type { _RealFixture } from '~/types'

definePageMeta({ layout: 'round' })
const { round, isLoading } = inject(roundKey)!
useHead({ title: `${round.value?.name}` })

const route = useRoute()
const $day = useNuxtApp().vueApp.config.globalProperties.$day

const realFixtures = computed(() =>
  round.value?.snapshots
    .map((s: any) => s._realFixture)
    .sort((a: any, b: any) => new Date(a.startingAt).getTime() - new Date(b.startingAt).getTime())
    .map((f: any, index: number) => ({ ...f, $index: index }))
)

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
