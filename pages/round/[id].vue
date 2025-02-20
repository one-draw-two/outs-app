<template>
  <main>
    <h1>Round {{ selectedRound?.name }}</h1>

    <div class="space-y-8">
      <NuxtLink v-for="rf in roundRealFixtures" :key="rf._realFixture" :to="`/match/${rf._realFixture}`" class="flex gap-8"> {{ rf._realFixture }}</NuxtLink>
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()

useHead({ title: `Round ${route.params.id}` })

const { selectedRound, isLoading } = usePopulatedRound(route.params.id as string)

const roundRealFixtures = computed(() => selectedRound.value?.challenges?.flatMap((c: any) => c.fixtureSlots))

useLoadingWatcher(isLoading, selectedRound, 'Round fully populated')
</script>
