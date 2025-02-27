<template>
  <div class="relative pb-[--safe-padded-bottom-16] flex flex-col gap-8">
    <div class="flex items-center gap-4">
      <PrevFlag v-if="seasonCountryCode" :country-code="seasonCountryCode!" class="h-12 w-20 shrink-0" />
      <div class="-space-y-px">
        <h2>{{ challenge.roundGoalCount.side }}</h2>
        <h3>Matchday {{ challenge.roundGoalCount.afRoundInd }}</h3>
      </div>
    </div>
    <div class="grid grid-cols-5 rounded-3xl gap-1 p-1 bg-gray-400 border border-gray-400">
      <div v-for="i of 30" class="h-12 flex-center rounded-3xl pseudo-btn" @click="selectOption(i, $event)" :class="userBetIfExists === i ? 'bg-blue-300 text-black font-bold ring-2' : 'bg-gray-900 '">
        {{ i }}
      </div>
    </div>
    <div>
      <PrevRealFixture v-for="rf of realFixtureIds" :comp-name="'OldStyle'" :real-fixture="rf" :options="rfOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _P_Challenge, _P_RealFixture, _Bet } from '~/types'

const props = defineProps<{
  challenge: _P_Challenge
  bet?: _Bet
  isSubmitable: boolean
}>()
const emit = defineEmits(['submit'])

const userBetIfExists = computed(() => props.bet?.betRoundGoalCount)
const realFixtureIds = computed(() => props.challenge?.fixtureSlots.map((fs) => fs._realFixture).sort((a, b) => new Date(a.startingAt).getTime() - new Date(b.startingAt).getTime()))
const rfOptions = ref({
  isDateShown: true,
  isScoreless: true,
})

const selectOption = async (i: number, e?: MouseEvent) => {
  e?.preventDefault()
  if (props.isSubmitable) {
    await nextTick()
    emit('submit', {
      cid: props.challenge.id,
      rid: props.challenge._round,
      betType: props.challenge.type,
      betName: props.challenge.name,
      bet: i,
    })
  }
}

const seasonCountryCode = computed(() => {
  if (props.challenge?.roundGoalCount.afSeasonId?.toString() === '39') return 'ENG'
  if (props.challenge?.roundGoalCount.afSeasonId?.toString() === '61') return 'FRA'
  if (props.challenge?.roundGoalCount.afSeasonId?.toString() === '78') return 'GER'
  if (props.challenge?.roundGoalCount.afSeasonId?.toString() === '135') return 'ITA'
  if (props.challenge?.roundGoalCount.afSeasonId?.toString() === '140') return 'ESP'
  if (props.challenge?.roundGoalCount.afSeasonId?.toString() === '203') return 'TUR'
})

const isGamesVisible = ref(false)
const clearSlots = () => {
  selectOption(0)
}

defineExpose({
  clearSlots,
  isGamesVisible,
})
</script>
