<template>
  <Transition name="fade">
    <div v-if="isUserOverlayOpen" class="fixed inset-0 z-40 bg-black/30 backdrop-blur-xsXXX" @click="isUserOverlayOpen = false"></div>
  </Transition>
  <Transition name="slide-panel">
    <aside v-if="isUserOverlayOpen" class="fixed top-0 right-0 z-50 h-full w-[80vw] lg:max-w-1/2 bg-white" @click.stop>
      <div class="safe-area-padding-top space-y-8">
        <div class="flex items-center justify-between h-12 bg-gray-400 px-8">
          <h1>{{ userName }}</h1>
        </div>
        <div class="px-8">
          <NetworkButton />
          <ClearButton />
          <LogoutButton @clear-user="clearUser" />
        </div>
        <NuxtLink to="/admin" class="text-blue-500 hover:underline">Admin</NuxtLink>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import type { User } from '~/../types'

const { clearAuth, clearRefresh } = useAuthStorage()
const { $capacitor } = useNuxtApp()

const isUserOverlayOpen = useState<boolean>('isUserOverlayOpen')

const userName = useState<User>('user').value?.name

const clearUser = async () => {
  await useSecureFetch('logout', 'auth', 'post', { fcmToken: useState<string>('fcmToken').value })
  useState('user').value = null
  useState('accessToken').value = null
  useState('powerSyncToken').value = null
  useState('fcmToken').value = null
  const unregresp = $capacitor.$platform !== 'web' ? await $capacitor.$pushNotifications.unregister() : null
  console.log(unregresp) // Check if i need to do this?
  clearAuth()
  clearRefresh()
  navigateTo('/access/login')
}
</script>
