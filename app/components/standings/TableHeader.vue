<template>
  <div class="bg-gray-50 sticky -top-px z-10 border-y border-gray-200">
    <div class="main-container flex items-center justify-between h-20">
      <div class="flex gap-4">
        <StandingsBreadcrumbs v-if="breadcrumbChain" :breadCrumbChain="breadcrumbChain" />
        <NuxtLink :to="useSL(`standings/${standings?.id}`)" class="block">{{ standings?.name }}</NuxtLink>

        <NuxtLink v-if="childrenFixtures?.length > 0" :to="useSL(`standings/${standings?.id}/fixtures`)" class="block"> Fixtures </NuxtLink>
      </div>

      <div class="flex gap-4 items-center">
        <div @click="emit('shuffle')">Shuffle</div>
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
  breadcrumbChain?: any[]
}>()

wecl(props.breadcrumbChain, 'breadcrumbChain')

const emit = defineEmits<{ 'update:isDetailsOn': [value: boolean]; shuffle: []; 'toggle-grouping': [value: boolean] }>()

const dgGrouping = computed(() => props.tournament?.displayConfig?.grouping?.[props.standings?._link?._refColl?.toLowerCase()])
</script>
