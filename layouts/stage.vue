<template>
  <div class="space-y-8">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useRoute as useNativeRoute } from 'vue-router'
const nativeRoute = useNativeRoute()

const { data: stage, isLoading } = await usePopulatedStage(nativeRoute.params.stid as string)
useLoadingWatcher(isLoading, stage, 'Stage fully populated')

provide(stageKey, { stage, isLoading })
</script>
