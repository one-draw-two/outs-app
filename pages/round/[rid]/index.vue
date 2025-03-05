<template>
  <main class="space-y-8">
    <div class="flex gap-8" v-for="rf in realFixtures" :key="rf.id">
      <NuxtLink :to="`/round/${useRoute().params.rid}/match/${rf.id}`" class="flex gap-8">
        <div class="flex gap-8">
          <div class="w-24">{{ rf.status }}</div>
          <div class="w-96">{{ rf.name }}</div>
          <div v-highlight="rf" class="w-12 text-center">{{ rf.result }}</div>
        </div>
      </NuxtLink>
      <div>[ {{ rf.id }} ]</div>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'round' })
const { round, isLoading } = inject(roundKey)!
useHead({ title: `${round.value?.name} | Matches` })

const realFixtures = computed(() => round.value?.challenges?.flatMap((c: any) => c.fixtureSlots).map((fs: any) => fs._realFixture))
</script>
