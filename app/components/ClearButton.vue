<template>
  <div class="size-10 rounded-full shrink-0 flex items-center justify-center cursor-pointer bg-red-300" @click="disconnectAndClear()" />
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()
const disconnectAndClear = async () => {
  console.log('Disconnect data!')
  const result = await $db.disconnectAndClear()
  console.log(result)
}
</script>
