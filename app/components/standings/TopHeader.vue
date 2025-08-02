<template>
  <div class="flex w-full items-center gap-8">
    <div class="max-lg:flex-1 lg:w-48 shrink-0">
      <UtilLineBar color="blue-500" text-color="gray-700" variant="subtle">
        <span class="text-xs">User</span>
      </UtilLineBar>
    </div>
    <div class="flex-1">
      <UtilLineBar color="green-500" text-color="gray-700" variant="subtle">
        <span class="text-xs">Contributions</span>
      </UtilLineBar>
    </div>
    <div class="max-lg:flex-1 lg:w-48">
      <UtilLineBar color="blue-500" text-color="gray-700" variant="subtle">
        <span class="text-xs">Points</span>
      </UtilLineBar>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  childrenStandings: any[]
}>()
</script>
