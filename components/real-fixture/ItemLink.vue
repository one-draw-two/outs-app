<template>
  <NuxtLink :to="useSL(`round/${useRoute().params.rid}/match/${rf?.id}`)" class="block">
    <div class="grid grid-cols-[2rem_4rem_3rem_3rem_1fr_3rem] gap-4 items-center">
      <div class="font-mono">{{ (rf.$index + 1).toString().padStart(2, '0') }}</div>
      <div class="font-mono">{{ $day(rf?.startingAt).format('HH:mm') }}</div>
      <div v-highlight="rf" class="tabular-nums">{{ minuteDisplay }}</div>

      <PrevTripleCrop :clip="'flag'">
        <img :src="challengePath" class="flag w-full h-full object-cover bg-white" />
      </PrevTripleCrop>
      <div class="min-w-0 truncate">{{ displayName }}</div>
      <div v-highlight="rf">{{ rf?.result }}</div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { _RealFixture } from '~/types'

const props = defineProps<{
  rf: _RealFixture
}>()

const displayName = computed(() => (props.rf?.$challenge?.type === 'RoundGoalCount' ? 'RoundGoalCount' : props.rf?.name))

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

// <PrevFlag :challenge-code="props.rf.$challenge.type!" />
// const challengeDisplayText = computed(() => `${props.rf.$challenge.type}${props.rf.$challenge.name !== 'X' ? props.rf.$challenge.name : ''}`.trim())
</script>
