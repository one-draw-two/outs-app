<template>
  <main class="container mx-auto mt-48">
    <h1>{{ selectedRealFixture?.matchLabel }}</h1>
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
