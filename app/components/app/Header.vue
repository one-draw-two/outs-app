<template>
  <div class="safe-area-padding-top">
    <div class="relative top-0 w-screen h-24 flex items-center bg-white dark:bg-gray-800">
      <div class="bg-gray-300 h-12 absolute w-full bottom-0"></div>
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
    
    <NuxtLink :to="useSL('')" class="block"><img src="/26Blank.png" class="h-18" alt="Logo" /></NuxtLink>
    -->
      <div class="relative main-container flex items-center justify-between">
        <div class="flex items-center gap-2">
          <NuxtLink :to="useSL(`campaign/${season?.id}`)" class="z-1 block bg-white rounded-md py-2 px-4 shrink-0"><img src="/outstanding.svg" class="h-3" alt="Logo" /></NuxtLink>
          <img v-if="false" src="/C3.png" class="h-8" alt="Season Label" />
          <AppSeasonPicker v-if="true" class="opacity-0"></AppSeasonPicker>
        </div>
        <AppUserButton />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Temporary changes in the routing of the logo click
// Back to Season 26 home - <NuxtLink :to="useSL('')" class="z-1 block bg-white rounded-md py-2 px-4 shrink-0"><img src="/outstanding.svg" class="h-3" alt="Logo" /></NuxtLink>
// Back to index and then middleware to season - <NuxtLink :to="'/'" class="z-1 block bg-white rounded-md py-2 px-4 shrink-0"><img src="/outstanding.svg" class="h-3" alt="Logo" /></NuxtLink>
const season = useState<any>('season')
</script>
