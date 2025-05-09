import type { _Season, _Stage, _P_Round, _Round, _Table, _Challenge, _Bet, _P_Bet, _P_Stage, _RealFixture, _RealTeam, _P_Challenge, _P_RealFixture, _RealEvent } from '~/types'

export const useSeasonWithStages = async (seasonId: Ref<string> | string) => {
  const isReactiveId = isRef(seasonId)
  const seasonIdRef = isReactiveId ? seasonId : computed(() => seasonId)

  const seasonsQuery = usePSWatch<_Season>('SELECT * FROM "calendar_seasons" WHERE id = ?', [seasonIdRef.value], { watchSource: seasonIdRef })
  const stagesQuery = usePSWatch<_Stage>('SELECT * FROM "calendar_stages" WHERE _season = ? ORDER BY sePI ASC', [seasonIdRef.value], { watchSource: seasonIdRef })
  const roundsQuery = usePSWatch<_Round>('SELECT * FROM "calendar_rounds" WHERE _season = ? ORDER BY sePI ASC', [seasonIdRef.value], { watchSource: seasonIdRef })

  const blueprintId = computed(() => seasonsQuery.data.value[0]?._bpSeason)
  const blueprintQuery = usePSWatch<_Stage>('SELECT * FROM "blueprint_seasons" WHERE id = ?', [blueprintId.value], { watchSource: blueprintId })

  return usePSQueryWatcher<_Season>([seasonsQuery, stagesQuery, roundsQuery, blueprintQuery], (season) => {
    season.value = {
      ...seasonsQuery.data.value[0],
      stages: stagesQuery.data.value.map((stage) => ({
        ...stage,
        rounds: roundsQuery.data.value?.filter((round) => round._stage === stage.id) || [],
      })),
      blueprint: blueprintQuery.data.value[0],
    }
  })
}

export const usePopulatedStage = async (stageId: Ref<string> | string) => {
  const isReactiveId = isRef(stageId)
  const stageIdRef = isReactiveId ? stageId : computed(() => stageId)

  const stageQuery = usePSWatch<_Stage>('SELECT * FROM "calendar_stages" WHERE id = ?', [stageIdRef.value], { detectChanges: true, watchSource: stageIdRef })
  const roundsQuery = usePSWatch<_Round>('SELECT * FROM "calendar_rounds" WHERE _stage = ? ORDER BY sePI ASC', [stageIdRef.value], { detectChanges: true, watchSource: stageIdRef })

  // const { processedGroups } = await useGroupsWithUsers(`%"_refId":"${stageIdRef.value}"%`, [], { watchSource: stageIdRef })

  return usePSQueryWatcher<_P_Stage>([stageQuery, roundsQuery], (stage) => {
    stage.value = {
      ...stageQuery.data.value[0],
      rounds: roundsQuery.data.value,
      groups: [], // processedGroups,
      // groups: processedGroups,
    }
  })
}

export const usePopulatedRound = async (roundId: string) => {
  const roundQuery = usePSWatch<_Round>('SELECT * FROM "calendar_rounds" WHERE id = ?', [roundId], { detectChanges: true })

  const challengesQuery = usePSWatch<_Challenge>('SELECT * FROM "entry_challenges" WHERE _round = ? ORDER BY "order" ASC', [roundId])

  await Promise.all([roundQuery.await(), challengesQuery.await()])

  const transformedChallenges = challengesQuery.data.value.map((challenge) => ({ ...challenge, fixtureSlots: JSON.parse((challenge.fixtureSlots as string) ?? '[]') }))

  const realFixtures = transformedChallenges?.flatMap((c: any) => c.fixtureSlots).map((fs: any) => fs._realFixture)

  const realFixturesQuery = usePSWatch<_RealFixture>(`SELECT * FROM "real_fixtures" WHERE id IN (${realFixtures.map(() => '?').join(',')})`, realFixtures, { detectChanges: true })

  const snapshotsQuery = usePSWatch<_Table>('SELECT * FROM "group_snapshots" WHERE "_round" = ?', [roundId], { detectChanges: true })

  const stageQuery = usePSWatch<_Stage>('SELECT * FROM "calendar_stages" WHERE id = ?', [roundQuery.data.value[0]._stage], { detectChanges: true })

  const { processedGroups } = await useGroupsWithUsers(`%"_refId":"${roundId}"%`, [])

  return usePSQueryWatcher<_P_Round>([roundQuery, challengesQuery, realFixturesQuery, stageQuery], (round) => {
    round.value = {
      ...roundQuery.data.value[0],
      challenges: transformedChallenges,
      _stage: stageQuery.data.value[0],
      snapshots: snapshotsQuery.data.value.map((snapshot) => ({
        ...snapshot,
        _realFixture: realFixturesQuery.data.value.find((rf) => rf.id === snapshot._realFixture),
      })),
      groups: processedGroups,
    }
  })
}

export const usePopulatedChallenge = async (challengeId: string) => {
  const challengeQuery = usePSWatch<_Challenge>(`SELECT * FROM "entry_challenges" WHERE id IN (?)`, [challengeId])

  await challengeQuery.await()

  const transformedChallenge = { ...challengeQuery.data.value[0], fixtureSlots: JSON.parse((challengeQuery.data.value[0].fixtureSlots as string) ?? '[]') }

  const realFixtures = transformedChallenge?.fixtureSlots.map((fs: any) => fs._realFixture)

  const realFixturesQuery = usePSWatch<_RealFixture>(`SELECT * FROM "real_fixtures" WHERE id IN (${realFixtures.map(() => '?').join(',')})`, realFixtures, { detectChanges: true })

  await realFixturesQuery.await()

  const realTeams = realFixturesQuery.data.value.flatMap((rf: _RealFixture) => [rf._homeTeam, rf._awayTeam])

  const realTeamsQuery = usePSWatch<_RealTeam>(`SELECT * FROM "real_teams" WHERE id IN (${realTeams.map(() => '?').join(',')})`, realTeams, { detectChanges: true })

  await realTeamsQuery.await()

  return usePSQueryWatcher<_P_Challenge>([challengeQuery, realFixturesQuery, realTeamsQuery], (challenge) => {
    challenge.value = {
      ...transformedChallenge,
      fixtureSlots: transformedChallenge.fixtureSlots.map((fs: any) => ({
        ...fs,
        _realFixture: {
          ...realFixturesQuery.data.value.find((rf: _RealFixture) => rf.id === fs._realFixture),
          _homeTeam: realTeamsQuery.data.value.find((rt: _RealTeam) => rt.id === realFixturesQuery.data.value.find((rf: _RealFixture) => rf.id === fs._realFixture)?._homeTeam),
          _awayTeam: realTeamsQuery.data.value.find((rt: _RealTeam) => rt.id === realFixturesQuery.data.value.find((rf: _RealFixture) => rf.id === fs._realFixture)?._awayTeam),
        },
      })),
    }
  })
}

export const usePopulatedRealFixture = async (rfId: string) => {
  const realFixtureQuery = usePSWatch<_RealFixture>(`SELECT * FROM "real_fixtures" WHERE id IN (?)`, [rfId])

  await realFixtureQuery.await()

  const transformedRF = realFixtureQuery.data.value[0]

  const realTeamsQuery = usePSWatch<_RealTeam>(`SELECT * FROM "real_teams" WHERE id IN (?,?)`, [transformedRF._homeTeam, transformedRF._awayTeam], { detectChanges: true })

  await realTeamsQuery.await()

  const realEventsQuery = usePSWatch<_RealEvent>(`SELECT * FROM "real_events" WHERE "_realFixture" IN (?)`, [rfId], { detectChanges: true })

  await realEventsQuery.await()

  /*
  const realFixtures = transformedChallenge?.fixtureSlots.map((fs: any) => fs._realFixture)

  const realFixturesQuery = usePSWatch<_RealFixture>(`SELECT * FROM "real_fixtures" WHERE id IN (${realFixtures.map(() => '?').join(',')})`, realFixtures, { detectChanges: true })

  await realFixturesQuery.await()

  const realTeams = realFixturesQuery.data.value.flatMap((rf: _RealFixture) => [rf._homeTeam, rf._awayTeam])

  const realTeamsQuery = usePSWatch<_RealTeam>(`SELECT * FROM "real_teams" WHERE id IN (${realTeams.map(() => '?').join(',')})`, realTeams, { detectChanges: true })

  await realTeamsQuery.await()
  */

  return usePSQueryWatcher<_P_RealFixture>([realFixtureQuery, realTeamsQuery, realEventsQuery], (realFixture) => {
    realFixture.value = {
      ...transformedRF,
      _homeTeam: realTeamsQuery.data.value.find((rt: _RealTeam) => rt.id === transformedRF._homeTeam),
      _awayTeam: realTeamsQuery.data.value.find((rt: _RealTeam) => rt.id === transformedRF._awayTeam),
      _events: realEventsQuery.data.value,
      /*
      fixtureSlots: transformedChallenge.fixtureSlots.map((fs: any) => ({
        ...fs,
        _realFixture: {
          ...realFixturesQuery.data.value.find((rf: _RealFixture) => rf.id === fs._realFixture),
          _homeTeam: realTeamsQuery.data.value.find((rt: _RealTeam) => rt.id === realFixturesQuery.data.value.find((rf: _RealFixture) => rf.id === fs._realFixture)?._homeTeam),
          _awayTeam: realTeamsQuery.data.value.find((rt: _RealTeam) => rt.id === realFixturesQuery.data.value.find((rf: _RealFixture) => rf.id === fs._realFixture)?._awayTeam),
        },
      })),
      */
    }
  })
}

export const usePopulatedBet = async (options: { challengeId?: string; roundId?: string }) => {
  const { challengeId, roundId } = options

  const betsQuery = challengeId
    ? usePSWatch<_Bet>('SELECT * FROM "entry_bets" WHERE "_challenge" = ?', [challengeId], { detectChanges: true })
    : usePSWatch<_Bet>('SELECT * FROM "entry_bets" WHERE "_round" = ?', [roundId!], { detectChanges: true })

  await betsQuery.await()

  return usePSQueryWatcher<typeof challengeId extends string ? _P_Bet : _P_Bet[]>([betsQuery], (bet) => {
    const bets = betsQuery.data.value || []
    const allBets = bets.map((betRow) => ({ ...betRow, betFixtureSlots: JSON.parse(betRow?.betFixtureSlots ?? '[]') }))

    bet.value = challengeId
      ? (allBets[0] as any) // Single bet when querying by challengeId
      : (allBets as any) // Array of bets when querying by roundId
  })
}

export const useGroupsWithUsers = async (filter: string, filterParams: any[], options?: { watchSource?: Ref<any> | ComputedRef<any> }) => {
  console.log('useGroupsWithUsers', filter)

  const groupsQuery = usePSWatch<_Table>('SELECT * FROM "group_tables" WHERE _link LIKE ?', [filter], {
    detectChanges: true,
    watchSource: options?.watchSource,
  })
  await groupsQuery.await()

  const userIds = groupsQuery.data.value
    .flatMap((group) => JSON.parse((group.rows as string) || '[]'))
    .map((row) => row._user)
    .filter(Boolean)

  const usersQuery =
    userIds.length > 0
      ? usePSWatch<any>(`SELECT * FROM "account_users" WHERE id IN (${userIds.map(() => '?').join(',')})`, userIds, {
          watchSource: options?.watchSource,
        })
      : { data: { value: [] }, await: async () => {} }

  await usersQuery.await()
  const userMap = Object.fromEntries(usersQuery.data.value.map((user) => [user.id, user]))

  const processedGroups = groupsQuery.data.value.map((group) => {
    const parsedRows = JSON.parse((group.rows as string) || '[]')
    return {
      ...group,
      _link: JSON.parse(group._link as string),
      meta: JSON.parse(group.meta as string),
      rows: parsedRows.map((row: any) => ({
        ...row,
        _user: userMap[row._user] || row._user,
      })),
    }
  })

  return {
    processedGroups,
  }
}
