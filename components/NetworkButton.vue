<template>
  <div class="size-10 rounded-full shrink-0 flex items-center justify-center cursor-pointer" :class="connectionColorClass" @click="toggleNetworkTray()" />
</template>

<script setup lang="ts">
const connectionColorClass = useState<string>('network:connectionColorClass')
const toggleTrigger = useState<number>('network:networkTrayToggleTrigger')
const toggleNetworkTray = () => (toggleTrigger.value += 1)
</script>
