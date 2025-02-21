<template>
  <main>
    <h1>{{ selectedRealFixture?.name }}</h1>
    <p>
      {{ selectedRealFixture }}
    </p>
  </main>
</template>

<script setup lang="ts">
import type { _RealFixture } from '~/types'

const route = useRoute()

useHead({ title: `Match ${route.params.id}` })

const { data: realFixtures, isLoading, error, changeInfo } = usRFs([route.params.id as string])
const selectedRealFixture = computed(() => realFixtures.value?.[0])
useLoadingWatcher(isLoading, realFixtures, 'Real fixture fully populated', { changeInfo })

// wecl(realFixtures)
</script>
