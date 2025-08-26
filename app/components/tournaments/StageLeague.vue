<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold">{{ tournament.parsedTournament?.name }}</h2>
    <div class="flex gap-8 flex-wrap">
      <div v-for="group of filteredGroups" :key="group.id" class="flex-1 min-w-0 basis-1/4" :class="isUserInGroup(group) ? 'bg-green-100' : 'bg-gray-100'">
        <NuxtLink :to="useSL(`standings/${group.id}`)">{{ group.name }}</NuxtLink>
        <div v-for="(row, ri) of group.rows" :key="row._user?.id" class="flex gap-4" :class="isCurrentUserRow(row) ? 'bg-green-200' : ''">
          <span class="flex-1">{{ ri + 1 }} {{ row._user?.name }}</span>
          <FixturePointsDisplay :row="row" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _P_Group } from '~/../types'

const props = defineProps<{
  tournament: any
  stageId?: string
}>()

const { isUserInGroup, isCurrentUserRow } = useUserHelpers()

console.log('Turno')
console.log(props.tournament)

const filteredGroups = computed(() => props.tournament.groups.filter((group: _P_Group) => !group.meta.isContributionGroup))
</script>
