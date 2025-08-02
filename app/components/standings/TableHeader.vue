<template>
  <div class="bg-gray-100 sticky top-0 z-10">
    <div class="main-container flex items-center justify-between h-20">
      <div class="flex gap-4">
        <NuxtLink :to="useSL(`standings/${standings?.id}`)" class="block">{{ standings?.name }}</NuxtLink>
        <div @click="emit('shuffle')">Shuffle</div>
        <NuxtLink v-if="childrenFixtures?.length > 0" :to="useSL(`standings/${standings?.id}/fixtures`)" class="block"> Fixtures </NuxtLink>
      </div>

      <div class="flex gap-4 items-center">
        <FormsToggleSwitch :model-value="isDetailsOn" @change="emit('update:isDetailsOn', !isDetailsOn)" />
        <FormsToggleSwitch v-if="dgGrouping?.availableKeys?.length! > 1" @change="emit('toggle-grouping', $event)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _P_Group } from '~/../types'

const props = defineProps<{
  standings: _P_Group
  childrenFixtures: _P_Group[]
  tournament?: any
  isDetailsOn: boolean
}>()

const emit = defineEmits<{ 'update:isDetailsOn': [value: boolean]; shuffle: []; 'toggle-grouping': [value: boolean] }>()

const dgGrouping = computed(() => props.tournament?.displayConfig?.grouping?.[props.standings?._link?._refColl?.toLowerCase()])
</script>
