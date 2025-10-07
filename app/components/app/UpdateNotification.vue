<template>
  <Transition name="slide-up">
    <div v-if="updateAvailable" class="fixed bottom-5 left-5 z-50 bg-blue-600 text-white rounded-lg shadow-lg max-w-xs overflow-hidden">
      <div class="flex items-center p-3">
        <div class="flex-1">
          <strong class="block text-sm mb-0.5">Update Available</strong>
          <p class="text-xs opacity-90 m-0">
            A new version ({{ appVersion !== 'Unknown' ? appVersion : '' }}) is ready to install (current version: {{ storedVersion !== 'Unknown' ? storedVersion : '' }})
          </p>
        </div>
        <button @click="applySWUpdate" class="bg-white text-blue-600 rounded px-3 py-1.5 text-xs font-medium ml-2 hover:bg-gray-50 transition-colors">Update Now</button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { appVersion, storedVersion, updateAvailable } = useAppVersion()
const { applySWUpdate } = useServiceWorker()
</script>
