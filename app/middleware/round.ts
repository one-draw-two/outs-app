import type { User, _P_Season, _P_Round, ParsedBPTournament } from '~/../types'

const ISDEBUG = false

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.params.rid) return
  const rid = to.params.rid as string
  const currentRoundId = useState<string>('currentRoundId', () => '')

  if (currentRoundId.value === rid) {
    ISDEBUG && console.log('Using cached round data for', rid)
    return
  }

  ISDEBUG && console.log('Fetching fresh round data for', rid)

  const user = useState<User>('user')
  const { data: round } = await usePopulatedRound(rid, user.value?.id)
  const { getUserRow } = useUserHelpers()

  const season = useState<_P_Season>('season')
  if (!season.value || season.value.id !== round.value?._season) {
    const seasonId = round.value?._season
    if (typeof seasonId === 'string' && seasonId) {
      const { data: populatedSeason } = await usePopulatedSeason(seasonId)
      season.value = populatedSeason.value
    }
  }

  ISDEBUG && console.log('Fresh round data:', round.value)

  useState<any>('pickerSeasonId').value = round.value?._season
  useState<any>('pickerStageId').value = round.value?._stage
  useDynamicPS().updatepsParams({ selected_round: rid })

  const sKey = 'realFixture'
  const getOrder = (t: ParsedBPTournament, key: string) => t.snapshotConfig?.find((c) => c.name === sKey)?.order || 0
  const roundTournaments = computed(() => (season.value?.tournaments?.filter((t) => t.snapshotConfig?.some((c) => c.name === sKey)) || []).sort((a, b) => getOrder(a, sKey) - getOrder(b, sKey)))

  const headers = computed(() => [
    // { name: 'You' },
    ...roundTournaments.value
      ?.filter((t) => t.name !== 'Curves')
      .map((t) => ({
        id: t.id,
        name: t.name,
        fixture: round.value?.userFixtures?.find((fixture: any) => fixture._tournament === t.id && getUserRow(fixture)),
        standings: round?.value?.userStandings?.find((s: any) => s._tournament === t.id),
      })),
  ])

  // Reactively update the round for consumer pages and components
  watch(round, (r: any) => (useState('round').value = { ...r, $statusColor: getRoundStatusColor(round.value) }), { immediate: true })

  // wecl(round, 'Round')

  useState('tournamentCols').value = headers.value

  currentRoundId.value = rid

  ISDEBUG && console.log('Round data updated in state for', rid, useState('round').value)
})
