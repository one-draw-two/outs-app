<template>
  <NuxtLink :to="useSL(`round/${useRoute().params.rid}/match/${rf?.id}`)" class="block flex items-center" :class="isHovered ? 'bg-indigo-400' : ''">
    <div class="w-full grid grid-cols-[2rem_4rem_3rem_3rem_1fr_1rem_3rem] gap-4 items-center">
      <div class="font-mono">{{ (rf.$index + 1).toString().padStart(2, '0') }}</div>

      <div class="font-mono">{{ $day(rf?.startingAt).format('HH:mm') }}</div>

      <div v-highlight="rf" class="tabular-nums">{{ minuteDisplay }}</div>

      <PrevTripleCrop :clip="'flag'">
        <img :src="challengePath" class="flag w-full h-full object-cover bg-white" />
      </PrevTripleCrop>

      <div class="min-w-0 flex flex-col overflow-hidden">
        <div ref="homeTeamRef" :class="getTeamClasses('home')" @animationend="handleAnimationEnd('home')" @animationiteration="handleAnimationIteration('home')">
          {{ homeTeamName }}
        </div>
        <div ref="awayTeamRef" :class="getTeamClasses('away')" @animationend="handleAnimationEnd('away')" @animationiteration="handleAnimationIteration('away')">
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

// Animation state for each team
const homeTeamAnimation = ref({
  isActive: false,
  isReturning: false,
  shouldStop: false,
})

const awayTeamAnimation = ref({
  isActive: false,
  isReturning: false,
  shouldStop: false,
})

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

// Get CSS classes for team name
const getTeamClasses = (team: 'home' | 'away') => {
  const animation = team === 'home' ? homeTeamAnimation.value : awayTeamAnimation.value
  const isTruncated = team === 'home' ? isHomeTeamTruncated.value : isAwayTeamTruncated.value

  return {
    'team-name': true,
    'home-team': team === 'home',
    'away-team': team === 'away',
    'team-name-scrolling': animation.isActive && isTruncated,
    'team-name-returning': animation.isReturning && isTruncated,
    truncate: (!animation.isActive && !animation.isReturning) || !isTruncated,
  }
}

// Get CSS styles for team name
const getTeamStyles = (team: 'home' | 'away') => {
  // We'll use v-bind in CSS instead of inline styles
  return {}
}

// Check if text is truncated
const checkTruncation = () => {
  // Use setTimeout to ensure DOM is fully rendered
  setTimeout(() => {
    if (homeTeamRef.value) {
      const element = homeTeamRef.value
      const isOverflowing = element.scrollWidth > element.clientWidth
      isHomeTeamTruncated.value = isOverflowing
      if (isOverflowing) {
        homeTeamScrollDistance.value = element.scrollWidth - element.clientWidth + 20
      }
    }

    if (awayTeamRef.value) {
      const element = awayTeamRef.value
      const isOverflowing = element.scrollWidth > element.clientWidth
      isAwayTeamTruncated.value = isOverflowing
      if (isOverflowing) {
        awayTeamScrollDistance.value = element.scrollWidth - element.clientWidth + 20
      }
    }
  }, 0)
}

// Handle animation iteration (when one cycle completes)
const handleAnimationIteration = (team: 'home' | 'away') => {
  const animation = team === 'home' ? homeTeamAnimation.value : awayTeamAnimation.value

  if (animation.shouldStop && animation.isActive) {
    animation.isActive = false
    animation.isReturning = true
  }
}

// Handle animation end
const handleAnimationEnd = (team: 'home' | 'away') => {
  const animation = team === 'home' ? homeTeamAnimation.value : awayTeamAnimation.value

  if (animation.isReturning) {
    animation.isReturning = false
    animation.shouldStop = false
  }
}

// Watch hover state
watch(
  () => props.isHovered,
  (isHovered) => {
    if (isHovered) {
      // Start animations for truncated text
      if (isHomeTeamTruncated.value && !homeTeamAnimation.value.isActive && !homeTeamAnimation.value.isReturning) {
        homeTeamAnimation.value.isActive = true
        homeTeamAnimation.value.shouldStop = false
      }
      if (isAwayTeamTruncated.value && !awayTeamAnimation.value.isActive && !awayTeamAnimation.value.isReturning) {
        awayTeamAnimation.value.isActive = true
        awayTeamAnimation.value.shouldStop = false
      }
    } else {
      // Flag animations to stop gracefully - let current cycle complete
      if (homeTeamAnimation.value.isActive) homeTeamAnimation.value.shouldStop = true
      if (awayTeamAnimation.value.isActive) awayTeamAnimation.value.shouldStop = true
    }
  }
)

// Watch for changes in team names and check truncation
watch([homeTeamName, awayTeamName], checkTruncation, { flush: 'post' })

onMounted(() => {
  // Add a small delay to ensure all components are mounted
  setTimeout(checkTruncation, 100)
})
</script>

<style scoped>
.team-name {
  transition: transform 0.3s ease;
}

.team-name-scrolling {
  white-space: nowrap;
  animation: marquee-scroll 1.5s linear infinite;
}

.team-name-returning {
  white-space: nowrap;
  animation: marquee-return 0.4s ease forwards;
}

/* Home team styles */
.team-name-scrolling.home-team {
  --scroll-distance: v-bind('"-" + homeTeamScrollDistance + "px"');
}

.team-name-returning.home-team {
  --scroll-distance: v-bind('"-" + homeTeamScrollDistance + "px"');
}

/* Away team styles */
.team-name-scrolling.away-team {
  --scroll-distance: v-bind('"-" + awayTeamScrollDistance + "px"');
}

.team-name-returning.away-team {
  --scroll-distance: v-bind('"-" + awayTeamScrollDistance + "px"');
}

@keyframes marquee-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(var(--scroll-distance));
  }
}

@keyframes marquee-return {
  0% {
    transform: translateX(var(--scroll-distance));
  }
  100% {
    transform: translateX(0);
  }
}
</style>
