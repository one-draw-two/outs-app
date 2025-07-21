<template>
  <LayoSeasonAndStage>
    <div>
      <h1>Tournaments</h1>
      <div v-for="(tournament, tournamentId) in tournamentGroupsMap" :key="tournamentId" class="space-y-4">
        <h2 class="text-xl font-bold">{{ tournament.parsedTournament?.name || tournamentId }}</h2>
        <div class="flex gap-8 flex-wrap">
          <div v-for="group of tournament.groups" class="flex-1 min-w-0 basis-1/4" :class="isUserInGroup(group) ? 'bg-green-100' : 'bg-gray-100'">
            <h3>{{ group.name }}</h3>
            <div v-for="(row, ri) of group.rows" class="flex gap-4" :class="isCurrentUserRow(row) ? 'bg-green-200' : ''">
              <span class="flex-1">{{ ri + 1 }} {{ row._user?.name }}</span>
              <FixturePointsDisplay :row="row" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </LayoSeasonAndStage>
</template>

<script setup lang="ts">
import type { _Stage, _Round, _BPTournamentRecord } from '~/../types'

const stid = useRoute().params.stid
const { data: stages } = usePSWatch<_Stage>('SELECT * FROM "calendar_stages" WHERE id = ?', [stid], { detectChanges: true })
const { data: rounds } = usePSWatch<_Round>('SELECT * FROM "calendar_rounds" WHERE _stage = ? ORDER BY sePI ASC', [stid], { detectChanges: true })
const { processedGroups } = await useGroupsWithUsers({ _refId: stid })
const { isUserInGroup, isCurrentUserRow } = useUserHelpers()

const stage = computed(() => stages.value[0])
const tournamentGroupsMap = ref<Record<string, { groups: any[]; parsedTournament?: any }>>({})

const buildTournamentGroupsMap = async () => {
  const map: Record<string, { groups: any[]; parsedTournament?: any }> = {}

  for (const group of processedGroups.value) {
    const tid = group._tournament
    if (!tid) continue
    if (!map[tid]) map[tid] = { groups: [] }
    map[tid].groups.push(group)
  }

  for (const [tid, data] of Object.entries(map)) {
    const { data: raw } = await usePSWatchSingle<_BPTournamentRecord>('SELECT * FROM "blueprint_tournaments" WHERE id = ?', [tid])
    if (raw.value) data.parsedTournament = parseTournament(raw.value)
  }

  tournamentGroupsMap.value = map
}

watchEffect(() => processedGroups.value.length > 0 && buildTournamentGroupsMap())
useHead({ title: computed(() => stage.value?.name) })
</script>
