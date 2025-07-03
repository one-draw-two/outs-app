<template>
  <NuxtLink :to="useSL(`round/${useRoute().params.rid}/match/${rf?.id}`)" class="block flex items-center">
    <div class="w-full grid grid-cols-[2rem_4rem_3rem_3rem_1fr_1rem_3rem] gap-4 items-center">
      <div class="font-mono">{{ (rf.$index + 1).toString().padStart(2, '0') }}</div>

      <div class="font-mono">{{ $day(rf?.startingAt).format('HH:mm') }}</div>

      <div v-highlight="rf" class="tabular-nums">{{ minuteDisplay }}</div>

      <PrevTripleCrop :clip="'flag'">
        <img :src="challengePath" class="flag w-full h-full object-cover bg-white" />
      </PrevTripleCrop>

      <div class="min-w-0 flex flex-col overflow-hidden">
        <div ref="homeTeamRef" :class="['team-name', { 'team-name-marquee': isHovered && isHomeTeamTruncated, truncate: !isHovered || !isHomeTeamTruncated }]">
          {{ homeTeamName }}
        </div>
        <div ref="awayTeamRef" :class="['team-name', { 'team-name-marquee': isHovered && isAwayTeamTruncated, truncate: !isHovered || !isAwayTeamTruncated }]">
          {{ awayTeamName }}
        </div>
      </div>

      <div class="italic text-gray-500">{{ rf?.$correctBet }}</div>

      <div v-highlight="rf" class="flex flex-col min-w-0">
        <div>{{ resultTopRow }}</div>
        <div>{{ resultBottomRow }}</div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { _RealFixture } from '~/types'

const props = defineProps<{
  rf: _RealFixture
  isHovered?: boolean
}>()

const homeTeamRef = ref<HTMLElement>()
const awayTeamRef = ref<HTMLElement>()
const homeTeamScrollDistance = ref(0)
const awayTeamScrollDistance = ref(0)
const isHomeTeamTruncated = ref(false)
const isAwayTeamTruncated = ref(false)

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

// Function to check if text is truncated and calculate scroll distance
const checkTruncation = () => {
  nextTick(() => {
    if (homeTeamRef.value) {
      const element = homeTeamRef.value
      const isOverflowing = element.scrollWidth > element.clientWidth
      isHomeTeamTruncated.value = isOverflowing
      if (isOverflowing) {
        homeTeamScrollDistance.value = element.scrollWidth - element.clientWidth + 20 // Add some padding
      }
    }

    if (awayTeamRef.value) {
      const element = awayTeamRef.value
      const isOverflowing = element.scrollWidth > element.clientWidth
      isAwayTeamTruncated.value = isOverflowing
      if (isOverflowing) {
        awayTeamScrollDistance.value = element.scrollWidth - element.clientWidth + 20 // Add some padding
      }
    }
  })
}

// Watch for changes in team names and check truncation
watch([homeTeamName, awayTeamName], checkTruncation, { flush: 'post' })

onMounted(() => checkTruncation())
</script>

<style scoped>
.team-name {
  @apply transition-transform duration-1000 ease-linear;
}

.team-name-marquee {
  @apply whitespace-nowrap;
  transform: translateX(v-bind('homeTeamScrollDistance + "px"'));
  animation: marquee 3s linear infinite;
}

.team-name-marquee:nth-child(2) {
  transform: translateX(v-bind('awayTeamScrollDistance + "px"'));
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
