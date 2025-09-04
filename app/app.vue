<template>
  <AppHeader v-if="user" :user="user" />
  <NuxtPage />
  <AppFooter />
  <AppUserOverlay v-if="user" />
  <AppNetworkTray />
  <AppDecorations />
  <AppUpdateNotification />

  <AppPerformanceDisplay />
  <div class="hidden ml-24 ml-12 ml-8 ml-6 mr-24 mr-12 mr-8 mr-6"></div>
</template>

<script setup lang="ts">
import '@tailwindplus/elements'

import type { User } from '~/../types'
const user = useState<User | null>('user')

useKeyboard()
useServiceWorker()
useViewportDims()
useUiTheme().setTheme(user.value?.settings?.ui?.theme || 'system')

usePerformanceDebug().startTimer('app-init')

onMounted(async () => {
  // Immediately check for and prevent default service worker update behavior
  if (process.client && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'PREVENT_DEFAULT_REFRESH' })
      }
    } catch (e) {
      console.error('Error preventing default SW update behavior:', e)
    }
  }

  useAppVersion().checkSwVersion()
  usePerformanceDebug().endTimer('app-init')
})
</script>
