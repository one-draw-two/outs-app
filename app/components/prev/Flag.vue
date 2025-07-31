<template>
  <div class="flag p-[2px] bg-white">
    <img v-if="countryCode" :src="`/flags/${countryCode}.png`" class="flag w-full h-full object-cover" />
    <img v-else-if="challengeCode" :src="challengeCode" class="flag w-full h-full object-cover bg-gray-100" />
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  countryCode?: string
  challengeCode?: string
  isNoOutline?: boolean
}>()
</script>
