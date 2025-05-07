<template>
  <div class="main-container space-y-8">
    <slot />
  </div>
</template>

<script setup lang="ts">
/*
import { useRoute as useNativeRoute } from 'vue-router'
const nativeRoute = useNativeRoute()

const { data: stage, isLoading } = await usePopulatedStage(nativeRoute.params.stid as string)
useLoadingWatcher(isLoading, stage, 'Stage fully populated')

useState<any>('pickerSeasonId').value = stage.value?._season

provide(stageKey, { stage, isLoading })
*/

import type { _P_Stage } from '~/types'
const stage = useState<_P_Stage>('stage')
</script>
