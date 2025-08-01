<template>
  <div class="space-y-8">
    <div class="h-24 flex items-center" :class="`bg-${round.$statusColor}-500/20`">
      <div class="lg:h-16 main-container flex max-lg:flex-col gap-8 lg:items-center">
        <div>
          <div class="flex items-center gap-4">
            <NuxtLink :to="useSL(`stage/${round?._stage}`)" class="hover:underline">{{ stage?.name }}</NuxtLink>
            <NuxtLink v-for="r of stage?.rounds" :key="r?.id" :to="getRoundLink(r?.id)" class="hover:underline">
              <PrevTripleCrop :clip="'circle'" :title="`Round status: ${r?.status}`">
                <div class="size-3" :class="r.id === round.id ? 'bg-orange-300' : `bg-${round.$statusColor}-500`" />
              </PrevTripleCrop>
            </NuxtLink>
          </div>
          <h1>Round {{ (round?.sePI ?? 0) + 1 }}</h1>
        </div>

        <div class="flex-1 flex justify-end items-center gap-8">
          <NuxtLink :to="useSL(`round/${round?.id}/challenges`)">Challenges Deadline xxx {{ $day(round?._h_roundDeadline).format('ddd DD/MM HH:mm') }}</NuxtLink>
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

const getRoundLink = (newRid: string) =>
  ['matches', 'challenges'].includes(useRoute().path.split('/').pop() ?? '') ? useSL(`round/${newRid}/${useRoute().path.split('/').pop()}`) : useSL(`round/${newRid}`)
</script>
