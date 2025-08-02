<template>
  <div class="main-container py-24!">
    <div class="px-4">
      <h1>Clear</h1>
      <p>Cache cleared: {{ msg1 }}</p>
      <p>Service workers unregistered: {{ msg2 }}</p>
      <NuxtLink :to="'/'" class="text-blue-500 font-bold cursor-pointer block">Go to Home</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const msg1 = ref()
const msg2 = ref()

msg1.value = await caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
msg2.value = await navigator.serviceWorker.getRegistrations().then((regs) => Promise.all(regs.map((reg) => reg.unregister())))

useHead({ title: 'Outstanding | Clear' })
</script>
