<template>
  <AppDynamicLayout color="gray">
    <template #header-left>
      <div class="flex items-center gap-4">
        <h1>{{ pageName }}</h1>
        <NuxtLink :to="useSL(`${linkColl}/${link?._refId}`)">Link</NuxtLink>
      </div>
    </template>
    <template #page>
      <main class="pb-48">
        <StandingsTable :standings="standings" :allowShuffle="true" @shuffle-complete="onShuffleComplete" rowClass="hover:bg-gray-50" />
      </main>
    </template>
  </AppDynamicLayout>
</template>

<script setup lang="ts">
const stanid = useRoute().params.stanid
const { processedGroups } = await useGroupsWithUsers({ id: stanid }, false)

const standings = computed(() => processedGroups?.value?.[0])

const link = computed(() => standings.value?._link)
const linkColl = computed(() => (link.value?._refColl === 'Season' ? 'campaign' : link.value?._refColl?.toLowerCase()))
const pageName = computed(() => `${link.value._refColl} ${standings.value?.name}`)

const onShuffleComplete = (rows: any[]) => console.log('Shuffle completed', rows)

wecl(standings)

const pageTitle = computed(() => `${pageName.value} Standings `) // Should be more descriptive what the standings is about
useHead({ title: pageTitle })
</script>
