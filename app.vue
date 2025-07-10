<template>
  <div class="safe-area-padding-top">
    <div class="space-y-8">
      <AppHeader v-if="user" :user="user" />
      <NuxtPage />
    </div>

    <AppUserOverlay v-if="user" />
    <AppNetworkTray />
    <AppDecorations />
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'
const user = useState<User | null>('user')

useKeyboard()

// useServiceWorker() Promlematic at the moment, disable
</script>
