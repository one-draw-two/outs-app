<template>
  <LayoRound>
    <main class="space-y-8">
      <div class="flex gap-8" v-for="ch in challenges" :key="ch.id">
        <NuxtLink :to="useSL(`round/${useRoute().params.rid}/challenge/${ch.id}`)" class="flex gap-8">
          <div class="flex gap-8">
            <div class="w-24">{{ ch.status }}</div>
            <div class="w-48">{{ ch.type }}</div>
            <div class="w-12">{{ ch.name }}</div>
          </div>
        </NuxtLink>
      </div>
    </main>
  </LayoRound>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'round' })
const round = useState('round')
useHead({ title: `${round.value?.name} | Challenges` })

const challenges = computed(() => round.value?.challenges)
wecl(challenges)
</script>
