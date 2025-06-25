<template>
  <div class="flex gap-2 items-center">
    <template v-if="bet">
      <PrevTripleCrop v-if="bet.slotIndex <= aboveBetsBasedOnChallengeType" :clip="'octagon'">
        <div class="size-5 flex-center text-sm font-bold" :class="getSlotIndexColor(bet.slotIndex)">
          {{ bet.bet }}
        </div>
      </PrevTripleCrop>
      <div class="px-2 bg-gray-200 rounded-md" :class="bet.bet === correctBet ? '' : 'line-through'">
        {{ bet.potentialPoints?.join(' / ') }}
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

// Color function for bet display
const getSlotIndexColor = (si: number) => {
  if (si === 0) return 'bg-blue-200'
  if (si === 1) return 'bg-green-200'
  if (si === 2) return 'bg-yellow-200'
  if (si === 3) return 'bg-orange-200'
  return 'opacity-50'
}
</script>
