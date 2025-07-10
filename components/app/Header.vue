<template>
  <div class="h-12 main-container flex gap-8 relative">
    <AppSeasonPicker>
      <NuxtLink :to="useSL('')" class="block"><img src="/outstanding.svg" class="h-3" alt="Logo" /></NuxtLink>
    </AppSeasonPicker>
    <AppUserButton />
  </div>
</template>

<script setup lang="ts"></script>
