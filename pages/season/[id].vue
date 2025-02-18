<template>
  <main>
    <h1>Season {{ selectedSeason?.name }}</h1>
    <div
      class="size-48 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: selectedSeason?.bgUrl ? `url(${getSanityUrl(selectedSeason.bgUrl)})` : 'none' }"
    ></div>

    <div class="space-y-8">
      <details v-for="stage in selectedSeason?.stages" :key="stage.id" open>
        <summary>{{ stage.name }}</summary>

        <NuxtLink
          v-for="round in stage.rounds"
          :key="round.id"
          :to="`/round/${round.id}`"
          class="flex gap-8"
          :class="round.status === 'current' ? 'bg-green-500' : ''"
        >
          <div class="w-32">
            {{ round.name }}
          </div>
          <div>
            {{ round.status }}
          </div>
        </NuxtLink>
      </details>
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()

definePageMeta({ layout: 'season' })
useHead({ title: `Season ${route.params.id}` })

const { selectedSeason, isLoading } = useSeasonWithStages(route.params.id as string)

useLoadingWatcher(isLoading, selectedSeason, 'Season fully populated')

// wecl(selectedSeason)
</script>
