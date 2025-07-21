<template>
  <button @click="emit('clearUser')" class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">Logout</button>
</template>

<script setup lang="ts">
const emit = defineEmits(['clearUser'])
</script>
