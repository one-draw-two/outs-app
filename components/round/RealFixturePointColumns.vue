<template>
  <div class="h-24 bg-yellow-100 lg:flex items-stretch py-4 hover:bg-gray-100">
    <div class="flex-1 bg-yellow-200"></div>
    <div class="flex-2 bg-blue-200 flex items-stretch gap-4">
      <div v-for="h in headers" class="flex-1 bg-blue-200 flex-center">
        {{ h.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _P_Bet } from '~/types'

const props = defineProps<{
  round: any
  realFixtures?: any[]
}>()
const headers = ref([{ name: 'Result' }, { name: 'You' }])
// wecl(props.realFixtures)

// const { data: bets } = (await usePopulatedBet({ roundId: props.round.id })) as { data: Ref<_P_Bet[]> }

// wecl(bets, 'bet')
</script>
