<template>
  <div class="h-12 main-container flex gap-8 relative items-center">
    <!-- 
    <AppSeasonPicker>
      <NuxtLink :to="useSL('')" class="block"><img src="/outstanding.svg" class="h-3" alt="Logo" /></NuxtLink>
    </AppSeasonPicker>
    -->
    <!-- 
    <div class="flex flex-col xitems-center relative">
      <NuxtLink :to="useSL('')" class="block"><img src="/outstanding.svg" class="absolute h-3 top-0.5" alt="Logo" /></NuxtLink>
      <img src="/Season26Label.png" class="h-12" alt="Logo" />
    </div>    
    -->
    <NuxtLink :to="useSL('')" class="block"><img src="/Test2.png" class="h-18" alt="Logo" /></NuxtLink>
    <AppSeasonPicker v-if="false"></AppSeasonPicker>

    <AppUserButton />
  </div>
</template>

<script setup lang="ts"></script>
