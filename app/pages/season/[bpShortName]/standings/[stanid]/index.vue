<template>
  <LayoGroupAndFixture color="gray">
    <template #header-left>
      <div class="flex items-center gap-4">
        <NuxtLink :to="useSL(`${linkColl?.toLowerCase()}/${link?._refId}`)">{{ linkColl }}</NuxtLink>
        <h1>{{ pageName }}</h1>
      </div>
    </template>
    <template #page>
      <main class="pb-48">
        <StandingsTable :standings="standings" :children-standings="childrenStandings" :children-fixtures="childrenFixtures" :tournament="tournament!" />
      </main>
    </template>
  </LayoGroupAndFixture>
</template>

<script setup lang="ts">
import type { _BPTournamentRecord } from '~/../types'

const stanid = useRoute().params.stanid

useDynamicPS().updatePowerSyncParams({ selected_parent_gid: stanid })

const { processedGroups } = await useGroupsWithUsers({ id: stanid }, false)
const standings: any = computed(() => processedGroups?.value?.[0])

useState<any>('pickerSeasonId').value = standings.value?._season

const { data: rawTournament } = await usePSWatchSingle<_BPTournamentRecord>('SELECT * FROM "blueprint_tournaments" WHERE id = ?', [standings.value?._tournament])
const tournament = computed(() => parseTournament(rawTournament.value!))

const link = computed(() => standings.value?._link)
const linkColl = computed(() => (link.value?._refColl === 'Season' ? 'Campaign' : link.value?._refColl))
const pageName = computed(() => `${standings.value?.name}`)

const { processedGroups: childrenFixtures } = await useGroupsWithUsers({ _parentGroup: stanid }, true)
const { processedGroups: childrenStandings } = await useGroupsWithUsers({ _parentGroup: stanid }, false)

wecl(standings)
wecl(childrenFixtures, 'fixto')
wecl(childrenStandings, 'standings')

const pageTitle = computed(() => `${pageName.value} Standings `) // Should be more descriptive what the standings is about
useHead({ title: pageTitle })
</script>
