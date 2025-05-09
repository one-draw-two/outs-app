<template>
  <div v-if="season && season.stages" class="px-4 h-12 rounded-xl flex-center" :class="`bg-${stage?.color ?? 'gray'}-500`">
    <select v-model="selectedStageId" @change="change" class="stroke-text !not-italic">
      <option value="">Select a stage</option>
      <option v-for="stage in season.stages" :key="stage.id" :value="stage.id">Stage {{ stage.name }}</option>
    </select>
    <button v-if="selectedStageId" @click="goToDetails" class="stroke-text">→</button>
  </div>
</template>

<script setup lang="ts">
import { useRoute as useNativeRoute } from 'vue-router'
const nativeRoute = useNativeRoute()

const selectedStageId = useState<any>('pickerStageId')
if (!selectedStageId.value && nativeRoute.params.stid) selectedStageId.value = nativeRoute.params.stid as string

const { data: stage, isLoading } = await usePopulatedStage(selectedStageId)
useLoadingWatcher(isLoading, stage, '', {
  onDataChange: (value) => {
    useState<any>('stage').value = value
    useState<any>('pickerSeasonId').value = stage.value?._season
  },
})

const season = useState<any>('season')

const change = (event: any) => navigateTo(event.target.value ? useSL(`stage/${event.target.value}`) : useSL(`season/${useState<any>('stage').value?._season}`))
const goToDetails = () => navigateTo(useSL(`stage/${selectedStageId.value}`))
</script>
