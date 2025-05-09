<template>
  <div class="h-12 main-container flex gap-8 relative">
    <NuxtLink :to="useSL('')" class="block size-12 bg-gray-300"></NuxtLink>
    <AppSeasonPicker v-if="/(round|stage)/.test(useRoute().path)" />
    <AppStagePicker v-if="/(round|stage)/.test(useRoute().path)" />
    <AppUserButton />
  </div>
</template>

<script setup lang="ts"></script>
