<template>
  <AppHeader v-if="user" :user="user" />
  <NuxtPage />
  <AppUserOverlay v-if="user" />
  <AppNetworkTray />
  <AppDecorations />
</template>

<script setup lang="ts">
import type { User } from '~/types'
const user = useState<User | null>('user')

useKeyboard()

// useServiceWorker() Promlematic at the moment, disable
</script>
