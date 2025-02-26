<template>
  <main>
    <h1>Challenge</h1>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
useHead({ title: `Challenge ${route.params.id}` })
</script>
