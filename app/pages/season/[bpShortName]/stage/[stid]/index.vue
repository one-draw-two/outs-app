<template>
  <LayoSeasonAndStage>
    <div>
      <div class="h-12 flex items-center gap-8 border-b border-gray-200 mb-8">
        <button
          v-for="(tournament, tournamentId) in tournamentGroupsMap"
          :key="tournamentId"
          class="block pb-2 hover:border-b-2 hover:border-gray-400"
          :class="{ 'border-b-2 border-blue-500': selectedTournamentType === tournamentId }"
          @click="selectedTournamentType = tournamentId"
        >
          {{ tournament.parsedTournament?.name || tournamentId }}
        </button>
      </div>
      <component :is="getTournamentComponent(selectedTournament?.parsedTournament?.id)" v-if="selectedTournament" :tournament="selectedTournament" :stage-id="stid" />
    </div>
  </LayoSeasonAndStage>
</template>

<script setup lang="ts">
import type { _Stage, _Round, _BPTournamentRecord } from '~/../types'

const stid = useRoute().params.stid as string
const { data: stages } = usePSWatch<_Stage>('SELECT * FROM "calendar_stages" WHERE id = ?', [stid], { detectChanges: true })
const { data: rounds } = usePSWatch<_Round>('SELECT * FROM "calendar_rounds" WHERE _stage = ? ORDER BY sePI ASC', [stid], { detectChanges: true })
const { processedGroups } = await useGroupsWithUsers({ _refId: stid })

const stage = computed(() => stages.value[0])
const tournamentGroupsMap = ref<Record<string, { groups: any[]; parsedTournament?: any }>>({})

const buildTournamentGroupsMap = async () => {
  const map: Record<string, { groups: any[]; parsedTournament?: any }> = {}
  const tournamentIds = [...new Set(processedGroups.value.map((group) => group._tournament).filter((tid): tid is string => !!tid))]
  const { data: tournaments, await: waitForData } = usePSWatch<_BPTournamentRecord>('SELECT * FROM "blueprint_tournaments" WHERE id IN (' + tournamentIds.map(() => '?').join(',') + ')', tournamentIds)

  await waitForData()

  processedGroups.value.forEach((group) => {
    const tid = group._tournament
    if (!tid) return
    map[tid] ??= { groups: [], parsedTournament: parseTournament(tournaments.value.find((t) => t.id === tid)!) }
    map[tid].groups.push(group)
  })

  tournamentGroupsMap.value = map
}

wecl(tournamentGroupsMap)

const route = useRoute()

const selectedTournamentType = ref<string | null>(null)

const selectedTournament = computed(() => (selectedTournamentType.value ? tournamentGroupsMap.value[selectedTournamentType.value] : null))
watchEffect(() => {
  if (tournamentGroupsMap.value && !selectedTournamentType.value) selectedTournamentType.value = Object.keys(tournamentGroupsMap.value)[0]!
})

const Tournament_Type_League = markRaw(defineAsyncComponent(() => import('~/components/tournaments/StageLeague.vue')))
const Tournament_Type_Brackets = markRaw(defineAsyncComponent(() => import('~/components/tournaments/StageBrackets.vue')))

const getTournamentComponent = (tournamentId?: string) => {
  switch (tournamentId) {
    case 'BTLEAG':
      return Tournament_Type_League
    case 'BTBRAC':
      return Tournament_Type_Brackets
    default:
      return Tournament_Type_League
  }
}

watchEffect(() => processedGroups.value.length > 0 && buildTournamentGroupsMap())
useHead({ title: computed(() => stage.value?.name) })
</script>
