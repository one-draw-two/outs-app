<template>
  <div class="h-12 main-container flex gap-8 relative">
    <!-- 
    <AppSeasonPicker>
      <NuxtLink :to="useSL('')" class="block"><img src="/outstanding.svg" class="h-3" alt="Logo" /></NuxtLink>
    </AppSeasonPicker>
    -->
    <div class="flex flex-col h-12 w-48 relative">
      <NuxtLink :to="useSL('')" class="block"><img src="/outstanding.svg" class="h-3" alt="Logo" /></NuxtLink>
      <img src="/Season26.png" class="absolute -bottom-12 left-0 h-24" alt="Logo" />
    </div>

    <AppUserButton />
  </div>
</template>

<script setup lang="ts"></script>
