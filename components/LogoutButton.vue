<template>
  <div class="flex items-center gap-8">
    <div class="size-10 rounded-full bg-blue-300 shrink-0" />
    <p class="shrink-0">{{ user.name }}</p>
    <button @click="handleLogout" class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">Logout</button>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'
defineProps<{ user: User }>()
const emit = defineEmits(['clearUser'])

const handleLogout = async () => {
  navigateTo('/access/login')
  // await sleep(1000) // To remove flickering
  emit('clearUser')
  useSecureFetch('logout', 'auth', 'post')
}
</script>
