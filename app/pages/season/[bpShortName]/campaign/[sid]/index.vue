<template>
  <LayoSeasonCalendar>
    <StandingsTable :standings="mainTournamentGroup" :children-standings="childrenStandings" :children-fixtures="[]" :tournament="tournament!" rowClass="hover:bg-gray-50" />
  </LayoSeasonCalendar>
</template>

<script setup lang="ts">
import type { _Season, _Stage, _Round, _BPTournamentRecord } from '~/../types'

const sid = useRoute().params.sid as string

const season = useState<any>('season')
watch(toRef(sid), async (to) => !to || season.value?.id === to || (useState<any>('season').value = (await usePopulatedSeason(to)).data.value), { immediate: true })

const { processedGroups } = await useGroupsWithUsers({ _refId: sid }, false)

const mainTournamentGroup = computed(() => processedGroups.value.find((group) => group._tournament === 'BTCAMP'))

const { data: rawTournament } = await usePSWatchSingle<_BPTournamentRecord>('SELECT * FROM "blueprint_tournaments" WHERE id = ?', [mainTournamentGroup.value?._tournament])
const tournament = computed(() => (rawTournament.value ? parseTournament(rawTournament.value) : null))

const link = computed(() => mainTournamentGroup.value?._link)
const linkColl = computed(() => (link.value?._refColl === 'Season' ? 'Campaign' : link.value?._refColl))
const pageName = computed(() => `${mainTournamentGroup.value?.name}`)

const { processedGroups: childrenStandings } = await useGroupsWithUsers({ _parentGroup: mainTournamentGroup.value?.id }, false)

/*
wecl(mainTournamentGroup, 'main gorup')
wecl(tournament, 'ta')
wecl(childrenStandings)
*/

const pageTitle = computed(() => `Season ${season.value?.name}`)
useHead({ title: pageTitle })
</script>
