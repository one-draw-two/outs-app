<template>
  <span class="inline-flex gap-2">
    <span class="font-bold">{{ row?.points?.[1]?.toFixed(2) }}</span>
    <span class="text-gray-500 italic">{{ row?.points?.[0]?.toFixed(2) }}</span>
  </span>
</template>

<script setup lang="ts">
defineProps({
  row: { type: Object, required: false, default: () => ({ points: [0, 0] }) },
})
</script>
