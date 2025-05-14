<template>
  <div class="flex">
    <div v-for="stage in season?.stages" :key="stage.id" class="w-120">
      <div class="flex flex-col">
        <div class="h-12 flex-shrink-0 rounded-md flex items-center justify-center mb-2 font-bold" :class="{ 'bg-blue-200': stage.status !== 'unknown', 'bg-gray-200': stage.status === 'unknown' }">
          <NuxtLink :to="useSL(`stage/${stage.id}`)" class="w-full h-full flex items-center justify-center">
            {{ stage.name }}
          </NuxtLink>
        </div>

        <div class="h-10 w-full relative rounded-full" :class="{ 'bg-blue-100': stage.status !== 'unknown', 'bg-gray-100': stage.status === 'unknown' }">
          <div class="flex justify-between h-full items-center">
            <div v-for="round in stage.rounds" :key="round.id" class="flex flex-col items-center">
              <NuxtLink
                :to="useSL(`round/${round.id}`)"
                class="w-8 h-8 rounded-full text-white text-xs font-bold cursor-pointer transition-opacity duration-200 flex items-center justify-center hover:opacity-80"
                :class="getRoundColorClass(round.status)"
                :title="round.name"
              >
                {{ round.name.substring(0, 2) }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _P_Season } from '~/types'
const season = useState<_P_Season>('season')

const getRoundColorClass = (status: string) => {
  if (status === 'unknown') return 'bg-gray-500'
  if (status === 'current-points-calculated') return 'bg-blue-500'
  if (status === 'current') return 'bg-green-500'
  return 'bg-gray-300'
}
</script>
