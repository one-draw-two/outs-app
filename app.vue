<template>
  <div class="container mx-auto px-4 my-24 space-y-8">
    <LogoutButton v-if="user" :user="user" @clear-user="clearUser" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <NetworkTray />
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'
const user = useState<User | null>('user')
const { clearAuth, clearRefresh } = useAuthStorage()
const { $capacitor } = useNuxtApp()

const clearUser = async () => {
  await useSecureFetch('logout', 'auth', 'post', { fcmToken: useState<string>('fcmToken').value })
  user.value = null
  useState('accessToken').value = null
  useState('powerSyncToken').value = null
  useState('fcmToken').value = null
  const unregresp = $capacitor.$platform !== 'web' ? await $capacitor.$pushNotifications.unregister() : null
  console.log(unregresp) // Check if i need to do this?
  clearAuth()
  clearRefresh()
  navigateTo('/access/login')
}

// useServiceWorker() Promlematic at the moment, disable
</script>
