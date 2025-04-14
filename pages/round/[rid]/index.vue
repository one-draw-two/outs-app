<template>
  <main class="space-y-8">
    <div class="flex gap-8" v-for="rf in realFixtures" :key="rf?.id">
      <NuxtLink :to="`/round/${route.params.rid}/match/${rf?.id}`" class="flex gap-8">
        <div class="grid grid-cols-3 md:grid-cols-5 gap-4">
          <div v-highlight="rf" class="w-12 tabular-nums min-w-[3rem]">{{ rf?.liveMinute?.padStart(2, '0') }}</div>
          <div class="w-24 min-w-[6rem]">{{ rf?.status }}</div>
          <div class="w-48 min-w-[12rem] font-mono">{{ $day(rf?.startingAt).format('ddd DD/MM HH:mm') }}</div>
          <div class="col-span-3 md:col-span-1 min-w-0 truncate">{{ rf?.name }}</div>
          <div v-highlight="rf" class="col-span-3 md:col-span-1 w-12 min-w-[3rem]">{{ rf?.result }}</div>
        </div>
      </NuxtLink>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'round' })
const { round, isLoading } = inject(roundKey)!
useHead({ title: `${round.value?.name} | Matches` })

const route = useRoute()

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
</script>
