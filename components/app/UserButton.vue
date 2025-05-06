<template>
  <div class="size-12 rounded-full bg-gray-200/50"></div>
</template>

<script setup lang="ts">
import type { User } from '~/types'
defineProps<{ user: User }>()
</script>
