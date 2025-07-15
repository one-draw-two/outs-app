<template>
  <div class="space-y-8">
    <h2 @click="clear">Clear bets</h2>
    <component
      v-if="challenge"
      ref="comp"
      :is="returnComponent(challenge.type!)!"
      :challenge="challenge"
      :bet="bet"
      :isSubmitable="round?.status === 'current-published' || true"
      @submit="submitToServer"
    />
  </div>
</template>

<script setup lang="ts">
import type { _P_Round, _P_Challenge, _P_Bet } from '~/types'

const round = useState<_P_Round>('round')

const { challenge, isLoading: challengeIsLoading } = inject(challengeKey)!

const { data: bet } = (await usePopulatedBet({ challengeId: challenge?.value?.id as string })) as { data: Ref<_P_Bet | null> }

const returnComponent = (challengeType: string) => {
  if (challengeType === '1x2' || challengeType === 'Goals' || challengeType === 'Bonus') return Challenge_Type_FixtureSlots
  if (challengeType === 'RoundGoalCount') return Challenge_Type_RoundGoalCount
}

const Challenge_Type_FixtureSlots = markRaw(defineAsyncComponent(() => import('~/components/challenges/entry/FixtureSlots.vue')))
const Challenge_Type_RoundGoalCount = markRaw(defineAsyncComponent(() => import('~/components/challenges/entry/RoundGoalCount.vue')))

const comp = ref()
const clear = () => comp.value?.clearSlots()

const submitToServer = async (betData: any) => {
  console.log(betData)
  const res = await useSecureFetch('submit-bet', 'base', 'post', betData)
  console.log(res)
}
</script>
