<template>
  <main class="space-y-8">
    <h1>Round {{ selectedRound?.name }}</h1>

    <div class="flex gap-8">
      <div class="space-y-8">
        <h2>Matches</h2>
        <NuxtLink v-for="rf in roundRealFixtures" :key="rf._realFixture" :to="`/match/${rf._realFixture}`" class="flex gap-8"> {{ rf._realFixture }}</NuxtLink>
      </div>
      <div class="space-y-8">
        <h2>Bets</h2>
        <p v-for="bet in bets" :key="bet.id" v-highlight:[options]="bet">{{ bet.name }} // {{ bet.id }}</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { _Bet } from '~/types'
const options = {
  classes: {
    insert: 'bg-emerald-300',
    update: 'bg-sky-300',
    delete: 'bg-red-300',
  },
}

const route = useRoute()

useHead({ title: `Round ${route.params.id}` })

const { selectedRound } = usePopulatedRound(route.params.id as string)

const sql = 'SELECT * FROM bets ORDER BY CAST(name AS INTEGER), name COLLATE NOCASE ASC'
const { data: bets, isLoading: ilbe, changeInfo } = usePSWatch<_Bet>(sql, [], { detectChanges: true, abortController: new AbortController() })
useLoadingWatcher(ilbe, bets, 'Bets', { changeInfo })

// if (changeInfo) watch(changeInfo, (info) => console.log(info))

const roundRealFixtures = computed(() => selectedRound.value?.challenges?.flatMap((c: any) => c.fixtureSlots))

// useLoadingWatcher(isLoading, selectedRound, 'Round fully populated')
</script>
