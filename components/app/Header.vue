<template>
  <div class="main-container flex justify-between">
    <SeasonPicker />
    <AppUserButton :user="user" />
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'
defineProps<{ user: User }>()
</script>
