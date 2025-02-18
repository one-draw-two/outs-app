<template>
  <main class="container mx-auto mt-48">
    <h1>Round {{ selectedRound?.name }}</h1>

    <div class="space-y-8">
      <NuxtLink v-for="rf in roundRealFixtures" :key="rf._realFixture" :to="`/match/${rf._realFixture}`" class="flex gap-8"> {{ rf._realFixture }}</NuxtLink>
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()

// definePageMeta({ layout: 'season' })
useHead({ title: `Round ${route.params.id}` })

const { selectedRound, isLoading } = usePopulatedRound(route.params.id as string)

const roundRealFixtures = computed(() => selectedRound.value?.challenges?.flatMap((c) => c.fixtureSlots))
wecl(roundRealFixtures)

useLoadingWatcher(isLoading, selectedRound, 'Round fully populated')

const { $db }: any = useNuxtApp()

/*
console.log('MORO')
console.log($db)
const results = await $db.getAll('SELECT * FROM rounds')
console.log(results)
*/
/*
const abortController = new AbortController()

const onUpdate = (up: any) => {
  console.log('ON UPDATE')
  console.log(up)
}
const watchLists = async (onUpdate: any) => {
  for await (const update of $db.watch('SELECT * from rounds', [], { signal: abortController.signal })) {
    onUpdate(update)
  }
}

await watchLists(onUpdate)
*/
</script>
