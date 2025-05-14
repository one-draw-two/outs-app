<template>
  <div class="bg-blue-200 flex items-stretch gap-4">
    <div v-for="(col, index) in tournamentCols" :key="index" class="flex-1 bg-blue-200 flex-center">
      <template v-if="col.name === 'BTCAMP'">
        <div>{{ row.rowMeta._points }}</div>
      </template>

      <template v-else-if="col.name === 'BTCURV'">
        <div>{{ row.$BTCURV._points }}</div>
      </template>

      <template v-else> </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  tournamentCols: any[]
  row: any
}>()
</script>
