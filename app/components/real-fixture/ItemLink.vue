<template>
  <NuxtLink :to="useSL(`round/${useRoute().params.rid}/snapshot/${rf?.$snapshotId}`)" class="block flex items-center">
    <div class="w-full grid grid-cols-[3rem_2rem_1fr_1rem] gap-4 items-center">
      <div class="flex flex-col items-center">
        <div class="tabular-nums">{{ $day(rf?.startingAt).format('HH:mm') }}</div>
        <div v-highlight="rf" class="tabular-nums">{{ minuteDisplay }}</div>
      </div>

      <div class="space-y-1">
        <PrevFlag v-if="challengePath" :challenge-code="challengePath!" class="h-4 w-6 shrink-0" />
        <PrevFlag v-if="seasonCountryCode" :country-code="seasonCountryCode!" class="h-4 w-6 shrink-0" />
      </div>

      <div class="min-w-0 flex flex-col">
        <div class="truncate">{{ homeTeamName }}</div>
        <div class="truncate">{{ awayTeamName }}</div>
      </div>

      <div v-if="false" class="italic text-gray-500">{{ rf?.$correctBet }}</div>

      <div v-highlight="rf" class="flex flex-col min-w-0 items-end">
        <div>{{ resultTopRow }}</div>
        <div>{{ resultBottomRow }}</div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { _RealFixture } from '~/../types'

/*
// grid-cols-[2rem_4rem_3rem_3rem_1fr_1rem_3rem]

<div v-if="false" class="font-mono">{{ (rf.$index + 1).toString().padStart(2, '0') }}</div>

<PrevTripleCrop :clip="'flag'">
  <img :src="challengePath" class="flag w-full h-full object-cover bg-white" />
</PrevTripleCrop>
*/

const props = defineProps<{
  rf: _RealFixture
}>()

const teamNames = computed(() => {
  if (props.rf?.$challenge?.type === 'RoundGoalCount') return ['Round', 'Goal Count']
  const parts = (props.rf?.name || '').split('-').map((part) => part.trim())
  return parts.length === 1 ? [parts[0], ''] : [parts[0], parts[1]]
})

const homeTeamName = computed(() => teamNames.value[0])
const awayTeamName = computed(() => teamNames.value[1])

const resultParts = computed(() => {
  if (props.rf?.$challenge?.type === 'RoundGoalCount') return [props.rf?.$correctBet || '', '']

  const result = props.rf?.result || ''
  if (result.includes(' ') || result.includes(':') || result.includes('-')) {
    const parts = result.split(/[\s:-]/).filter(Boolean)
    return parts.length >= 2 ? [parts[0], parts[1]] : [result, '']
  }
  return [result, '']
})

const resultTopRow = computed(() => resultParts.value[0])
const resultBottomRow = computed(() => resultParts.value[1])

// Keep the original computed properties for other parts of the component
const displayName = computed(() => (props.rf?.$challenge?.type === 'RoundGoalCount' ? 'RoundGoalCount' : props.rf?.name))
const displayResult = computed(() => (props.rf?.$challenge?.type === 'RoundGoalCount' ? props.rf?.$correctBet : props.rf?.result))

const minuteDisplay = computed(() => {
  if (props.rf?.status === 'halftime') return 'HT'
  if (props.rf?.status === 'fulltime') return 'FT'
  if (props.rf?.status === 'notstarted') return 'NS'
  return props.rf?.liveMinute?.padStart(2, '0') || ''
})

const challengePath = computed(() => {
  if (props.rf?.$challenge?.type === '1x2') return '/png/1x2.png'
  if (props.rf?.$challenge?.type === 'Goals') return '/png/2x5.png'
  if (props.rf?.$challenge?.type === 'Bonus') return '/png/bonus.png'
  if (props.rf?.$challenge?.type === 'RoundGoalCount') return '/png/goals.png'
})

const seasonCountryCode = computed(() => {
  const code = props.rf?.afFullLocation?.split('~')[0]?.trim()
  if (code === '39') return 'ENG'
  if (code === '61') return 'FRA'
  if (code === '78') return 'GER'
  if (code === '135') return 'ITA'
  if (code === '140') return 'ESP'
  if (code === '203') return 'TUR'
})

// <PrevFlag :challenge-code="props.rf.$challenge.type!" />
// const challengeDisplayText = computed(() => `${props.rf.$challenge.type}${props.rf.$challenge.name !== 'X' ? props.rf.$challenge.name : ''}`.trim())
</script>
