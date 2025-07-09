<template>
  <div>
    <div class="py-8 bg-repeat-x bg-[length:512px_auto] relative" :style="{ backgroundImage: season?.bgUrl ? `url(${getSanityUrl(season.bgUrl)})` : 'none' }">
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 pointer-events-none"></div>
      <div class="main-container space-y-8 relative z-10 overflow-x-auto hide-scroll w-full whitespace-nowrap" style="scroll-padding-left: 2rem; scroll-padding-right: 2rem">
        <h1 class="sticky left-0 text-5xl stroke-text">Season {{ season?.name }}</h1>
        <SeasonHorizontalCalendar />
      </div>
    </div>
    <main class="main-container py-8">
      <StandingsTable :standings="mainTournamentGroup" :children-standings="childrenStandings" :children-fixtures="[]" :tournament="tournament" rowClass="hover:bg-gray-50" />
    </main>
  </div>
</template>

<script setup lang="ts">
import type { _Season, _Stage, _Round, _BPTournamentRecord } from '~/types'

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

wecl(mainTournamentGroup)
wecl(tournament)
wecl(childrenStandings)

const pageTitle = computed(() => `Season ${season.value?.name}`)
useHead({ title: pageTitle })
</script>
