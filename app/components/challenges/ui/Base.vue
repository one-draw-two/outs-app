<template>
  <component v-if="challenge" ref="comp" :is="returnComponent(challenge.type!)!" :challenge="challenge" :rf="realFixture!" :fixture-slot="fixtureSlot" />
</template>

<script setup lang="ts">
import type { _P_Challenge } from '~/types'

const props = defineProps<{
  challenge: _P_Challenge
  rfid: string
  fixtureSlot?: any
}>()

const returnComponent = (challengeType: string) => {
  if (challengeType === '1x2' || challengeType === 'Goals' || challengeType === 'Bonus') return Challenge_UI_Type_FixtureSlots
  if (challengeType === 'RoundGoalCount') return Challenge_UI_Type_RoundGoalCount
}

const Challenge_UI_Type_FixtureSlots = markRaw(defineAsyncComponent(() => import('~/components/challenges/ui/FixtureSlots.vue')))
const Challenge_UI_Type_RoundGoalCount = markRaw(defineAsyncComponent(() => import('~/components/challenges/ui/RoundGoalCount.vue')))

const { data: realFixture } = await usePopulatedRealFixture(props.rfid as string)

wecl(props.fixtureSlot)
</script>
