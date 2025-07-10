<template>
  <div class="h-12 main-container flex gap-8 relative">
    <NuxtLink v-if="false" :to="useSL('')" class="block size-12 bg-gray-300"></NuxtLink>
    <div class="flex items-center gap-4">
      <NuxtLink :to="useSL('')" class="block"><img src="/outstanding.svg" class="h-4" alt="Logo" /></NuxtLink>
      <AppSeasonPicker v-if="/(round|stage)/.test(useRoute().path) || true" />
    </div>

    <AppUserButton />
  </div>
</template>

<script setup lang="ts"></script>
