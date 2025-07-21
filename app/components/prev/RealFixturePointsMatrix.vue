<template>
  <div class="w-full">
    <div class="grid rounded-md text-sm overflow-hidden border border-gray-100 border-opacity-25" :class="gridTemplateClass">
      <div class="border-b border-gray-100 border-opacity-25 flex-center font-bold">
        {{ totalPoints }}
      </div>
      <div v-for="r of colHeaders" :key="`${r}`" class="font-bold flex-center border-b border-l border-gray-100 border-opacity-25">
        {{ r }}
      </div>
      <template v-for="l of rowHeaders" :key="l">
        <div class="font-bold flex-center border-b border-gray-100 border-opacity-25">{{ l }}</div>

        <div v-for="r of colHeaders" :key="`${r}${l}`" class="border-b border-l border-gray-100 border-opacity-25 flex flex-col items-center gap-2 p-2">
          <p class="text-micro rounded-sm text-center w-full">
            {{ pointsMatrix?.find((pm: any) => pm.matrixSlotLabel === `${r}${l}`)?.potentialPoints?.[0] ?? 0 }}
          </p>
          <div class="bg-gray-200 rounded-full text-center p-1 aspect-square">
            {{ pointsMatrix?.find((pm: any) => pm.matrixSlotLabel === `${r}${l}`)?._users?.length ?? 0 }}
          </div>
          <!--
          <PropsUserCircles
            :users="gameStore.allUsersInSeason.filter((u:User) => pointsMatrix?.find((pm) => pm.matrixSlotLabel === `${r}${l}`)?._users?.includes(u._id))"
            :pms="`${r}${l}`"
            :user="userStore.user!"
            :fixture="fixture"
          />          
          -->
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EnhancedRealFixture, _P_RealFixture } from '~/types'
const props = defineProps<{
  rf: EnhancedRealFixture | _P_RealFixture
  // fixture?: Fixture
  fixtureSlot?: any
}>()

// const userStore = useUserStore()
// const gameStore = useGameStore()

const totalPoints = computed(() => props.fixtureSlot?.totalPoints)
const pointsMatrix = computed(() => props.fixtureSlot?.pointsMatrix)

const challengeType = computed(() => props.rf.$challenge?.type)

const isTwoOption = computed(() => challengeType.value === 'Goals')
const isBonusMatch = computed(() => challengeType.value === 'Bonus')

const colHeaders = isTwoOption.value ? ['+', '-'] : ['1', 'X', '2']
const rowHeaders = isBonusMatch.value ? ['Y'] : isTwoOption.value ? ['G', 'S'] : ['P', 'G', 'S', 'B']
const gridTemplateClass = isBonusMatch.value
  ? 'grid-cols-4 grid-rows-3 grid-cols-[3rem_1fr_1fr_1fr] grid-rows-[3rem_1fr_3rem]'
  : isTwoOption.value
  ? 'grid-cols-3 grid-rows-4 grid-cols-[3rem_1fr_1fr] grid-rows-[3rem_1fr_1fr_3rem]'
  : 'grid-cols-4 grid-rows-6 grid-cols-[3rem_1fr_1fr_1fr] grid-rows-[3rem_1fr_1fr_1fr_1fr_3rem]'
</script>
