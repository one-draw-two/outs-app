<template>
  <div class="space-y-8">
    <div class="h-48 flex items-center" :class="`bg-${color}-500/20`">
      <div class="h-12 main-container flex gap-8 items-center">
        <slot name="header-left" />
        <slot name="header-right" />
      </div>
    </div>
    <div class="main-container">
      <slot name="page" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  color?: string
}>()
</script>
