<template>
  <LayoGroupAndFixture color="gray">
    <template #header-left>
      <div class="flex items-center gap-4">
        <StandingsBreadcrumbs :breadCrumbChain="breadcrumbChain" />
      </div>
    </template>
    <template #page>
      <main>
        <StandingsTableHeader
          :standings="standings"
          :children-fixtures="childrenFixtures"
          :tournament="tournament!"
          :is-details-on="isDetailsOn"
          @update:is-details-on="isDetailsOn = $event"
          @shuffle="tableRefShufflePoints"
          @toggle-grouping="tableRefToggleGrouping"
        />

        <StandingsTable :standings="standings" :children-standings="childrenStandings" :children-fixtures="childrenFixtures" :tournament="tournament!" :is-details-on="isDetailsOn" />
      </main>
    </template>
  </LayoGroupAndFixture>
</template>

<script setup lang="ts">
import type { _BPTournamentRecord, _P_Group } from '~/../types'

const stanid = useRoute().params.stanid

useDynamicPS().updatePowerSyncParams({ selected_parent_gid: stanid })

const { processedGroups, parentChain } = await useGroupsWithUsers({ id: stanid }, false, undefined, true)
const standings: any = computed(() => processedGroups?.value?.[0])
const breadcrumbChain = computed(() => [...parentChain.value].reverse())
wecl(breadcrumbChain, 'breadcrumbChain')

useState<any>('pickerSeasonId').value = standings.value?._season

const { data: rawTournament } = await usePSWatchSingle<_BPTournamentRecord>('SELECT * FROM "blueprint_tournaments" WHERE id = ?', [standings.value?._tournament])
const tournament = computed(() => parseTournament(rawTournament.value!))

const link = computed(() => standings.value?._link)
const linkColl = computed(() => (link.value?._refColl === 'Season' ? 'Campaign' : link.value?._refColl))
const pageName = computed(() => `${standings.value?.name}`)

const { processedGroups: childrenFixtures } = await useGroupsWithUsers({ _parentGroup: stanid }, true)
const { processedGroups: childrenStandings } = await useGroupsWithUsers({ _parentGroup: stanid }, false)

wecl(standings)
// wecl(childrenFixtures, 'fixto')
// wecl(childrenStandings, 'standings')

const table = ref()
const isDetailsOn = ref(false)
const tableRefShufflePoints = () => table.value?.shufflePoints()
const tableRefToggleGrouping = () => table.value?.toggleGrouping()

const pageTitle = computed(() => `${pageName.value} Standings `) // Should be more descriptive what the standings is about
useHead({ title: pageTitle })
</script>
