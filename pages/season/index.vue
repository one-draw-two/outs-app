<template>
  <h1>Seasons</h1>
  <NuxtLink to="/">Back to home</NuxtLink>
  <button @click="startLiveActivity">Start Live Activity</button>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'season',
})

useHead({
  title: 'Outstanding',
})

const { $capacitor } = useNuxtApp()
const startLiveActivity = async () => {
  console.log('Starting live activity...')
  console.log($capacitor.$liveActivity.startLiveActivity)
  const yobo = await $capacitor.$liveActivity.startLiveActivity()
  console.log('TOYBO')
  console.log(yobo)
}
</script>
