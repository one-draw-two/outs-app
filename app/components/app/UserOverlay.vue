<template>
  <Transition name="fade">
    <div v-if="isUserOverlayOpen" class="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs" @click="isUserOverlayOpen = false"></div>
  </Transition>
  <Transition name="slide-panel">
    <aside v-if="isUserOverlayOpen" class="fixed top-0 right-0 z-50 h-full w-[80vw] lg:max-w-1/2 bg-white" @click.stop>
      <div class="safe-area-padding-top">
        <div class="flex items-center justify-between h-24 bg-gray-400 px-8">
          <h1>{{ userName }}</h1>
        </div>
        <div class="px-8">
          <NetworkButton />
          <ClearButton />
          <UserUiThemeSelector />
          <LogoutButton @clear-user="clearUser" />
          <div class="mt-4 text-xs text-gray-500">
            App version: {{ appVersion }}
            <template v-if="swVersion && swVersion !== appVersion"> (SW: {{ swVersion }}) </template>
          </div>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import type { User } from '~/../types'

// const { clearAuth, clearRefresh } = useAuthStorage()
// const { $capacitor } = useNuxtApp()

const isUserOverlayOpen = useState<boolean>('isUserOverlayOpen')
const userName = useState<User>('user').value?.name

// Get versions from global state
const appVersion = useState('appVersion').value || 'AV:Unknown'
const swVersion = useState('swVersion').value || 'SW:Unknown'

const clearUser = async () => await useClearUser().logOutUser()

/*
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
  */
</script>
