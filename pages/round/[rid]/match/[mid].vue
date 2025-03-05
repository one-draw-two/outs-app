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
definePageMeta({ layout: 'round' })
useHead({ title: `Match ${route.params.mid}` })

const { data: realFixtures, isLoading, error, changeInfo } = usePSWatch<_RealFixture>(`SELECT * FROM "real_fixtures" WHERE id IN (?)`, [route.params.mid as string])
const selectedRealFixture = computed(() => realFixtures.value?.[0])
useLoadingWatcher(isLoading, realFixtures, 'Real fixture fully populated', { changeInfo })

// wecl(realFixtures)
</script>
