<template>
  <main class="space-y-8">
    <h1>Round {{ round?.name }}</h1>

    <div class="flex gap-8">
      <div class="flex-1 space-y-8">
        <h2>Matches</h2>

        <div class="flex gap-8" v-for="rf in realFixtures" :key="rf.id">
          <NuxtLink :to="`/match/${rf.id}`" class="flex gap-8">
            <div class="flex gap-8">
              <div class="w-24">{{ rf.status }}</div>
              <div class="w-96">{{ rf.name }}</div>
              <div v-highlight="rf" class="w-12 text-center">{{ rf.result }}</div>
            </div>
          </NuxtLink>
          <div>[ {{ rf.id }} ]</div>
        </div>
      </div>
      <BetsTest class="space-y-8" />
    </div>
  </main>
</template>

<script setup lang="ts">
import type { _Round } from '~/types'

const route = useRoute()

useHead({ title: `Round ${route.params.id}` })

const { data: round, isLoading } = await usePopulatedRound(route.params.id as string)
const realFixtures = computed(() => round.value?.challenges?.flatMap((c: any) => c.fixtureSlots).map((fs: any) => fs._realFixture))
useLoadingWatcher(isLoading, round, 'Round fully populated')
</script>
