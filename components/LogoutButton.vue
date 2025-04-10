<template>
  <div class="flex items-center gap-8">
    <NetworkButton />
    <ClearButton />
    <p class="shrink-0">{{ user.name }}</p>
    <button @click="handleLogout" class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">Logout</button>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'
import ClearButton from './ClearButton.vue'
defineProps<{ user: User }>()
const emit = defineEmits(['clearUser'])

const handleLogout = async () => {
  navigateTo('/access/login')
  emit('clearUser')
  useSecureFetch('logout', 'auth', 'post')
}
</script>
