<template>
  <div class="">
    <h1>
      {{ realFixture?.name }} <span class="text-gray-500 italic font-normal text-sm">{{ realFixture?.id }}</span>
    </h1>

    <div class="flex gap-4">
      <div class="flex-1">
        <h2>Points Matrix</h2>
        <PrevRealFixturePointsMatrix :rf="rf!" :fixture-slot="fixtureSlot" />
      </div>
      <div class="flex-1">
        <h2>Events</h2>
        <div v-for="(re, i) of timeSortedEvents" class="flex gap-6 tabular-nums">
          <p class="w-12 font-mono">{{ i }}</p>
          <p v-highlight="re" class="font-mono">{{ re?.id }}</p>
          <p>{{ re?.time }}</p>
          <p>{{ re?.type }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _P_Challenge, _P_RealFixture, _P_Bet } from '~/../types'

const props = defineProps<{
  challenge: _P_Challenge
  rf: _P_RealFixture
  fixtureSlot?: any
}>()

useDynamicPS().updatepsParams({ selected_rf: props.rf.id })
const { data: realFixture } = await usePopulatedRealFixture(props.rf.id as string)

const timeSortedEvents = computed(() => realFixture.value?._events?.sort((a: any, b: any) => a.time - b.time))
</script>
