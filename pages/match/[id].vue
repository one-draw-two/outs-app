<template>
  <main>
    <h1>{{ selectedRealFixture?.name }}</h1>
    <p>
      {{ selectedRealFixture }}
    </p>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()

useHead({ title: `Match ${route.params.id}` })

const { selectedRealFixture, isLoading } = usePopulatedRealFixture(route.params.id as string)

useLoadingWatcher(isLoading, selectedRealFixture, 'Real fixture fully populated')
</script>
