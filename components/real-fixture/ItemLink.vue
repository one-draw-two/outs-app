<template>
  <NuxtLink :to="useSL(`round/${useRoute().params.rid}/match/${rf?.id}`)" class="block">
    <div class="grid grid-cols-[2rem_4rem_3rem_1fr_3rem] gap-4">
      <div class="font-mono">{{ (rf.$index + 1).toString().padStart(2, '0') }}</div>
      <div class="font-mono">{{ $day(rf?.startingAt).format('HH:mm') }}</div>
      <div v-highlight="rf" class="tabular-nums">{{ rf?.liveMinute?.padStart(2, '0') }}</div>
      <div class="min-w-0 truncate">{{ rf?.name }}</div>
      <div v-highlight="rf">{{ rf?.result }}</div>
    </div>
    <div v-if="false">
      <div v-for="$challenge of rf?.$challenges" class="flex justify-between">
        <div class="font-mono text-sm inline">{{ `${$challenge.id} / ${$challenge.name} / ${$challenge.type}` }}</div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { _RealFixture } from '~/types'

const props = defineProps<{
  rf: _RealFixture
}>()
</script>
