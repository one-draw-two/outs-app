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
import type { _Stage } from '~/types'

const season = useState<any>('season')
const stage = useState<any>('stage')
const selectedStageId = useState<any>('pickerStageId')

if (!selectedStageId.value) selectedStageId.value = useRoute().params.stid

watch(
  selectedStageId,
  async (to) => {
    if (!to || stage.value?.id === to) return
    const { data: stages } = usePSWatch<_Stage>('SELECT * FROM "calendar_stages" WHERE id = ?', [to])
    watch(stages, (to) => {
      if (!to || to.length === 0) return
      const value = to[0]
      useState<any>('stage').value = value
      useState<any>('pickerStageId').value = value.id
      useState<any>('pickerSeasonId').value = value._season
    })
  },
  { immediate: true }
)

const change = (event: any) => navigateTo(event.target.value ? useSL(`stage/${event.target.value}`) : useSL(`campaign/${useState<any>('stage').value?._season}`))
const goToDetails = () => navigateTo(useSL(`stage/${selectedStageId.value}`))
</script>
