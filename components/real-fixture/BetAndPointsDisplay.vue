<template>
  <div class="flex gap-2 items-center">
    <template v-if="bet">
      <PrevTripleCrop v-if="bet.bfsSI <= aboveBetsBasedOnChallengeType" :clip="'octagon'">
        <div class="size-5 flex-center text-sm font-bold" :class="getSlotIndexColor(bet.bfsSI)">
          {{ bet.bfsBet }}
        </div>
      </PrevTripleCrop>
      <div class="px-2 rounded-md" :class="[bet.bfsBet === correctBet ? '' : 'line-through', bet.isCorrect ? 'bg-green-200' : 'bg-gray-200']">
        {{ bet.bfsPotentialPoints?.join(' / ') }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps({
  bet: {
    type: Object,
    required: false,
    default: null,
  },
  correctBet: {
    type: [String, Number],
    required: false,
    default: null,
  },
  aboveBetsBasedOnChallengeType: {
    type: Number,
    required: false,
    default: 0,
  },
})

const getSlotIndexColor = (si: number) => {
  if (si === 0) return 'bg-blue-200'
  if (si === 1) return 'bg-green-200'
  if (si === 2) return 'bg-yellow-200'
  if (si === 3) return 'bg-orange-200'
  return 'opacity-50'
}
</script>
