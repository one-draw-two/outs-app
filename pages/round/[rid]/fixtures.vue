<template>
  <main class="space-y-8">
    <h2>FIXTURES</h2>
    <!-- 
    <div class="flex gap-8" v-for="ch in challenges" :key="ch.id">
      <NuxtLink :to="`/round/${useRoute().params.rid}/challenge/${ch.id}`" class="flex gap-8">
        <div class="flex gap-8">
          <div class="w-24">{{ ch.status }}</div>
          <div class="w-48">{{ ch.type }}</div>
          <div class="w-12">{{ ch.name }}</div>
        </div>
      </NuxtLink>
    </div>    
    -->
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'round' })
const { round, isLoading } = inject(roundKey)!
useHead({ title: `${round.value?.name} | Fixtures` })
</script>
