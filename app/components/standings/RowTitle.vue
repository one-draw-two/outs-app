<template>
  <div class="flex gap-2 items-center" :class="{ truncate: isTruncate }">
    <div class="tabular-nums w-8 shrink-0">{{ ri }}</div>
    <div class="flex-1" :class="{ truncate: isTruncate }">{{ row._user.name }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  row: any
  ri: any
  isTruncate?: boolean
}>()
</script>
