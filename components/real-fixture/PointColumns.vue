<template>
  <div class="bg-yellow-100 lg:flex items-stretch hover:bg-gray-100">
    <div class="flex-1 bg-yellow-200">
      <slot />
    </div>
    <div class="flex-2 bg-blue-200 flex items-stretch gap-4">
      <div v-for="h in tournamentCols" class="flex-1 bg-blue-200 flex-col gap-2">
        <NuxtLink :to="useSL(`round/${useRoute().params.rid}/fixtures/${h.id}`)" class="block">
          {{ h.name }}
        </NuxtLink>

        <NuxtLink v-if="h.fixture" :to="useSL(`round/${useRoute().params.rid}/fixture/${h.fixture.id}`)" class="block">
          <div>vs {{ h.fixture.oppoRow?._user.name }}</div>
          <div>{{ h.fixture.oppoRow?.points ?? 0 }}</div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { tournamentCols } = inject(roundKey)!
</script>
