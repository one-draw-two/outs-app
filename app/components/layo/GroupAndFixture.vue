<template>
  <div class="space-y-8">
    <div class="py-12" :class="`bg-${color}-500/20`">
      <div class="h-12 main-container flex gap-8 items-center">
        <div>
          <slot name="header-left" />
        </div>
        <div>
          <slot name="header-right" />
        </div>
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
