<template>
  <div class="bg-yellow-100 lg:flex items-stretch hover:bg-gray-100">
    <div class="flex-1 bg-yellow-200">
      <slot />
    </div>
    <div class="flex-2 bg-blue-200 flex items-stretch gap-4">
      <div v-for="h in tournamentCols" class="flex-1 bg-blue-200 flex-center">
        <NuxtLink :to="useSL(`standings/${h.id}`)" class="block">
          {{ h.name }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  tournamentCols: any[]
}>()
</script>
