<template>
  <div v-if="season && season.stages" class="px-4 h-12 rounded-xl flex-center" :class="`bg-${stage?.color ?? 'gray'}-500`">
    <select v-model="selectedStageId" @change="change" class="stroke-text !not-italic">
      <option value="">Select a stage</option>
      <option v-for="stage in season.stages" :key="stage.id" :value="stage.id">Stage {{ stage.name }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useRoute as useNativeRoute } from 'vue-router'
const nativeRoute = useNativeRoute()

const season = useState<any>('season')

const selectedStageId = useState<any>('pickerStageId')
if (!selectedStageId.value && nativeRoute.params.stid) {
  console.log('Setting selectedStageId from route', nativeRoute.params.stid)
  selectedStageId.value = nativeRoute.params.stid as string
}

// const selectedStage = computed(() => season.value?.stages?.find((stage: any) => stage.id === selectedStageId.value))
const { data: stage, isLoading } = await usePopulatedStage(selectedStageId)
useLoadingWatcher(isLoading, stage, '', {
  onDataChange: (value) => {
    useState<any>('stage').value = value
    useState<any>('pickerSeasonId').value = stage.value?._season
  },
})

const change = (event: any) => navigateTo(event.target.value ? `/stage/${event.target.value}` : '/stage')

/*

import { useRoute as useNativeRoute } from 'vue-router'
const nativeRoute = useNativeRoute()

const selectedSeasonId = useState<any>('pickerSeasonId')
if (!selectedSeasonId.value && nativeRoute.params.sid) selectedSeasonId.value = nativeRoute.params.sid as string

const { data: seasons } = usePSWatch<any>('SELECT * FROM "calendar_seasons" ORDER BY name ASC', [], { abortController: new AbortController() })
const { data: subscriptions } = usePSWatch<any>('SELECT * FROM "account_subscriptions"', [], { abortController: new AbortController() })
const { data: season, isLoading } = await useSeasonWithStages(selectedSeasonId)

useLoadingWatcher(isLoading, season, '', {
  onDataChange: (value) => (useState<any>('season').value = value),
})

const change = (event: any) => navigateTo(event.target.value ? `/season/${event.target.value}` : '/season')
const activeUserSubscriptionSeasons = computed(() => subscriptions.value.filter((sb: any) => sb.status === 'active').map((sb) => sb._season))

*/
</script>
