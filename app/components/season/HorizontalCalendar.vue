<template>
  <div class="flex gap-2">
    <div v-for="(stage, si) in season?.stages" :key="stage.id" class="w-120" :class="getContainerPaddingClass(si)">
      <div class="flex flex-col">
        <div class="h-12 flex-shrink-0 rounded-md flex items-center justify-center mb-2 font-bold" :class="getStageBackgroundClass(stage, 50)">
          <NuxtLink :to="useSL(`stage/${stage.id}`)" class="w-full h-full flex items-center justify-center">
            {{ stage.name }}
          </NuxtLink>
        </div>

        <div class="h-10 w-full relative rounded-full" :class="getStageBackgroundClass(stage, 20)">
          <div class="flex justify-between h-full items-center">
            <div v-for="round in stage.rounds" :key="round.id" class="flex flex-col items-center p-2">
              <NuxtLink
                :to="useSL(`round/${round.id}`)"
                class="size-6 rounded-full text-white text-xs font-bold cursor-pointer transition-opacity duration-500 flex items-center justify-center hover:opacity-80"
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
import type { _P_Season } from '~/../types'
const season = useState<_P_Season>('season')
const route = useRoute()

const stid = computed(() => route.params.stid)

const getStageBackgroundClass = (stage: any, opacity?: number) => (stid.value === stage.id ? `bg-${stage.color}-500` : `bg-${stage.color}-500/${opacity}`)

const getRoundColorClass = (status: string) => {
  if (status === 'unknown') return 'bg-gray-500'
  if (status === 'current-points-calculated') return 'bg-blue-500'
  if (status === 'current') return 'bg-green-500'
  if (status === 'current-published') return 'bg-yellow-500'
  return 'bg-gray-300'
}

const getContainerPaddingClass = (index: number) => {
  if (!season.value?.stages?.length) return ''
  if (index === 0) return 'pl-[var(--container-gap)]'
  if (index === season.value.stages.length - 1) return 'pr-[var(--container-gap)]'
  return ''
}
</script>
