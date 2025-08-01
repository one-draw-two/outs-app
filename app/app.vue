<template>
  <AppHeader v-if="user" :user="user" />
  <NuxtPage class="pt-12" />
  <AppFooter />
  <AppUserOverlay v-if="user" />
  <AppNetworkTray />
  <AppDecorations />
</template>

<script setup lang="ts">
import type { User } from '~/../types'
const user = useState<User | null>('user')

useKeyboard()
useServiceWorker()
useViewportDims()
</script>
