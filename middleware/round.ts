import type { User, _P_Season, ParsedBPTournament } from '~/types'

const ISDEBUG = false

export default defineNuxtRouteMiddleware(async (to) => {
  ISDEBUG && console.log('IM IN MIDDLEWARE ACTUALLY')

  if (!to.params.rid) return
  const rid = to.params.rid as string
  const currentRoundId = useState<string>('currentRoundId', () => '')

  if (currentRoundId.value === rid) {
    ISDEBUG && console.log('Using cached round data for', rid)
    return
  }

  ISDEBUG && console.log('Fetching fresh round data for', rid)

  const user = useState<User>('user')
  const season = useState<_P_Season>('season')
  const { data: round } = await usePopulatedRound(rid, user.value?.id)
  const { getUserRow } = useUserHelpers()

  ISDEBUG && console.log('Fresh round data:', round.value)

  useState<any>('pickerSeasonId').value = round.value?._season
  useState<any>('pickerStageId').value = round.value?._stage
  useDynamicPS().updatePowerSyncParams({ selected_round: rid })

  const sKey = 'realFixture'
  const getOrder = (t: ParsedBPTournament, key: string) => t.snapshotConfig?.find((c) => c.name === sKey)?.order || 0
  const roundTournaments = computed(() => (season.value?.tournaments?.filter((t) => t.snapshotConfig?.some((c) => c.name === sKey)) || []).sort((a, b) => getOrder(a, sKey) - getOrder(b, sKey)))
  const headers = computed(() => [
    { name: 'You' },
    ...roundTournaments.value?.map((t) => ({
      id: t.id,
      name: t.name,
      fixture: round.value?.userFixtures?.find((fixture) => fixture._tournament === t.id && getUserRow(fixture)),
      standings: round?.value?.userStandings?.find((s: any) => s._tournament === t.id),
    })),
  ])

  useState('round').value = round.value
  useState('tournamentCols').value = headers.value
  currentRoundId.value = rid

  ISDEBUG && console.log('Round data updated in state for', rid, useState('round').value)
})
