<template>
  <div class="space-y-8">
    <div class="lg:h-24 py-8 flex items-center" :class="`bg-${stage?.color}-500/20`">
      <div class="lg:h-16 main-container flex max-lg:flex-col gap-4 lg:items-center">
        <div class="flex items-center justify-between gap-4 px-4 rounded-full py-2" :class="`bg-${stage?.color}-300`">
          <NuxtLink :to="useSL(`stage/${round?._stage}`)" class="hover:underline">
            <h1>{{ stage?.name }}</h1>
          </NuxtLink>
          <div class="flex items-center gap-2">
            <NuxtLink v-for="r of stage?.rounds" :key="r?.id" :to="getRoundLink(r?.id)" class="relative hover:underline w-5 flex-center">
              <div :title="`Round status: ${r?.status}`" class="rounded-full size-5 ring-2 flex-center" :class="`bg-${getRoundStatusColor(r)}-500`">
                <div v-if="r.id === round.id" class="rounded-full size-2 bg-white ring-2"></div>
              </div>
              <div v-if="r.id === currentRoundId" class="absolute -bottom-4 text-xs font-black font-mini text-center">CUR</div>
            </NuxtLink>
          </div>
        </div>

        <div v-if="false" class="flex-1 flex lg:justify-end items-center gap-8">
          <h1>Round {{ round?.name }}</h1>
        </div>
      </div>
    </div>
    <div class="main-container" :key="round?.id">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _P_Season, _P_Round } from '~/../types'

const season = useState<_P_Season>('season')
const stage = computed(() => season.value?.stages?.find((s: any) => s.id === round.value?._stage))
const round = useState<_P_Round>('round')
const currentRoundId = computed(() => season?.value?._currentRound)

const getRoundLink = (newRid: string) =>
  ['matches', 'challenges'].includes(useRoute().path.split('/').pop() ?? '') ? useSL(`round/${newRid}/${useRoute().path.split('/').pop()}`) : useSL(`round/${newRid}`)

/*
<PrevTripleCrop :clip="'circle'" :title="`Round status: ${r?.status}`">
  <div class="size-3" :class="r.id === round.id ? 'bg-orange-300' : `bg-${round.$statusColor}-500`" />
</PrevTripleCrop>
*/
</script>
