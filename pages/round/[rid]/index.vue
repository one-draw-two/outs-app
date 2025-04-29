<template>
  <main>
    <NuxtLink v-for="(rf, rfi) in realFixtures" :key="rf?.id" :to="`/round/${route.params.rid}/match/${rf?.id}`" class="block py-4 hover:bg-gray-100">
      <div class="grid grid-cols-[12rem_3rem_1fr_3rem] gap-4">
        <div class="font-mono">{{ (rfi + 1).toString().padStart(2, '0') }} {{ $day(rf?.startingAt).format('ddd DD/MM HH:mm') }}</div>
        <div v-highlight="rf" class="tabular-nums">{{ rf?.liveMinute?.padStart(2, '0') }}</div>
        <div class="min-w-0 truncate">{{ rf?.name }}</div>
        <div v-highlight="rf">{{ rf?.result }}</div>
      </div>
    </NuxtLink>
  </main>
</template>
<script setup lang="ts">
definePageMeta({ layout: 'round' })
const { round, isLoading } = inject(roundKey)!
useHead({ title: `${round.value?.name} | Matches` })
useDynamicPS({ selected_round: round.value?.id })

const route = useRoute()

/*
const realFixtures = computed(() =>
  round.value?.challenges
    ?.flatMap((c: any) => c.fixtureSlots)
    .map((fs: any) => fs._realFixture)
    .sort((a: any, b: any) => {
      const aTime = new Date(a.startingAt).getTime()
      const bTime = new Date(b.startingAt).getTime()
      return aTime - bTime
    })
)
*/

const realFixtures = computed(() =>
  round.value?.snapshots
    .map((s: any) => s._realFixture)
    .sort((a: any, b: any) => {
      const aTime = new Date(a.startingAt).getTime()
      const bTime = new Date(b.startingAt).getTime()
      return aTime - bTime
    })
)

// <div v-if="false" class="w-24 min-w-[6rem]">{{ rf?.status }}</div>
</script>
