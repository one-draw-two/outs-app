<template>
  <div class="container mx-auto my-24 space-y-8">
    <LogoutButton v-if="user" :user="user" @clear-user="clearUser" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'
const user = useState<User | null>('user')
const { clearAuth } = useAuthStorage()

const clearUser = () => {
  user.value = null
  useState('accessToken').value = null
  useState('powerSyncToken').value = null
  clearAuth()
}

onMounted(() => {
  console.log('Component mounted')

  if ('serviceWorker' in navigator) {
    console.log('Service worker is supported')

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope)
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error)
      })
  }
})
</script>
