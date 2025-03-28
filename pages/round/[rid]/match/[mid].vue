<template>
  <main>
    <h1>{{ realFixture?.name }}</h1>

    <h2>Events</h2>
    <div v-for="(re, i) of timeSortedEvents" class="flex gap-6 tabular-nums">
      <p class="w-12 font-mono">{{ i }}</p>
      <p v-highlight="re" class="font-mono">{{ re?.id }}</p>
      <p>{{ re?.time }}</p>
      <p>{{ re?.type }}</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { _P_RealFixture } from '~/types'

const route = useRoute()
definePageMeta({ layout: 'round' })
useHead({ title: `Match ${route.params.mid}` })
useDynamicPS({ selected_rf: route.params.mid })

const { data: realFixture } = await usePopulatedRealFixture(route.params.mid as string)

const timeSortedEvents = computed(() => realFixture.value?._events?.sort((a: any, b: any) => a.time - b.time))

wecl(realFixture)
</script>
