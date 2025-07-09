<template>
  <AppDynamicLayout color="gray">
    <template #header-left>
      <div class="flex items-center gap-4">
        <NuxtLink :to="useSL(`${linkColl?.toLowerCase()}/${link?._refId}`)">{{ linkColl }}</NuxtLink>
        <h1>{{ pageName }}</h1>
      </div>
    </template>
    <template #page>
      <main class="pb-48">
        <StandingsTable :standings="standings" :children-standings="childrenStandings" :children-fixtures="childrenFixtures" @shuffle-complete="onShuffleComplete" rowClass="hover:bg-gray-50" />
      </main>
    </template>
  </AppDynamicLayout>
</template>

<script setup lang="ts">
const stanid = useRoute().params.stanid

const { processedGroups } = await useGroupsWithUsers({ id: stanid }, false)
const standings = computed(() => processedGroups?.value?.[0])

const link = computed(() => standings.value?._link)
const linkColl = computed(() => (link.value?._refColl === 'Season' ? 'Campaign' : link.value?._refColl))
const pageName = computed(() => `${standings.value?.name}`)

/*
console.log('Link:', link.value)
if (linkColl.value?._refColl === 'round') {
  console.log('Updating PowerSync params for round:', linkColl.value?._refId)
  useDynamicPS().updatePowerSyncParams({ selected_round: linkColl.value?._refId })
}
*/

const onShuffleComplete = (rows: any[]) => console.log('Shuffle completed', rows)

const { processedGroups: childrenFixtures } = await useGroupsWithUsers({ _parentGroup: stanid }, true)
const { processedGroups: childrenStandings } = await useGroupsWithUsers({ _parentGroup: stanid }, false)

wecl(standings)
wecl(childrenFixtures, 'fixto')
wecl(childrenStandings, 'standings')

const pageTitle = computed(() => `${pageName.value} Standings `) // Should be more descriptive what the standings is about
useHead({ title: pageTitle })
</script>
