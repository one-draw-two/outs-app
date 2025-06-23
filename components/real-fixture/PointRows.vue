<template>
  <div class="bg-blue-200 flex items-stretch gap-4">
    <div v-for="(col, index) in tournamentCols" :key="index" class="flex-1 bg-blue-200 flex-center">
      <template v-if="col.name === 'Result'"> </template>

      <template v-else-if="col.name === 'You'">
        <div class="flex flex-col justify-center w-full">
          <!--
          <div v-for="$challenge of props.rf?.$challenges" class="font-mono text-sm text-center py-1" :class="$challenge.$userBet?.potentialPoints ? '' : 'text-gray-200'">
            {{ $challenge.$userBet?.bet || '???' }}
          </div>          
          -->
          <div class="font-mono text-sm text-center py-1" :class="props.rf?.$challenge.$userBet?.potentialPoints ? '' : 'text-gray-200'">
            {{ props.rf?.$challenge.$userBet?.bet || '???' }}
          </div>
        </div>
      </template>

      <template v-else> </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _RealFixture } from '~/types'

const props = defineProps<{
  rf: _RealFixture
}>()

const { tournamentCols } = inject(roundKey)!
</script>
