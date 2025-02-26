<template>
  <div>
    <div class="h-full container overflow-hidden">
      <h2 @click="clear">Clear bets</h2>
    </div>
  </div>
  <div class="container">
    <component v-if="challenge" ref="comp" :is="returnComponent(challenge.type!)!" :challenge="challenge" :isSubmitable="round?.status === 'current-published'" />
  </div>
</template>

<script setup lang="ts">
import type { _Challenge } from '~/types'

const { round, isLoading } = inject(roundKey)!

const { challenge, isLoading: challengeIsLoading } = inject(challengeKey)!

const returnComponent = (challengeType: string) => {
  if (challengeType === '1x2' || challengeType === 'Goals' || challengeType === 'Bonus') return Challenge_Type_FixtureSlots
  if (challengeType === 'RoundGoalCount') return Challenge_Type_RoundGoalCount
}

const Challenge_Type_FixtureSlots = markRaw(defineAsyncComponent(() => import('~/components/challenges/FixtureSlots.vue')))
const Challenge_Type_RoundGoalCount = markRaw(defineAsyncComponent(() => import('~/components/challenges/RoundGoalCount.vue')))

const comp = ref()
const clear = () => comp.value?.clearSlots()
</script>
