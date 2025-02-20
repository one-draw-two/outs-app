<template>
  <div class="container mx-auto mt-24 space-y-8">
    <LogoutButton v-if="user" :user="user" @clear-user="user = null" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'
const user = useState<User | null>('user')
</script>
