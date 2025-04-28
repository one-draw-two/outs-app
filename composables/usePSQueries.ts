import type { _Season, _Stage, _Round, _Table, _Challenge, _Bet, _P_Bet, _P_Stage, _RealFixture, _RealTeam, _P_Challenge, _P_RealFixture, _RealEvent } from '~/types'

export const useSeasonWithStages = async (seasonId: string) => {
  const seasonsQuery = usePSWatch<_Season>('SELECT * FROM "calendar_seasons" WHERE id = ?', [seasonId])

  const stagesQuery = usePSWatch<_Stage>('SELECT * FROM "calendar_stages" WHERE _season = ? ORDER BY sePI ASC', [seasonId])
  const roundsQuery = usePSWatch<_Round>('SELECT * FROM "calendar_rounds" WHERE _season = ? ORDER BY sePI ASC', [seasonId])

  await seasonsQuery.await()

  const blueprintQuery = usePSWatch<_Stage>('SELECT * FROM "blueprint_seasons" WHERE id = ?', [seasonsQuery.data.value[0]._bpSeason])

  return usePSQueryWatcher<_Season>([seasonsQuery, stagesQuery, roundsQuery], (season) => {
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

export const usePopulatedStage = async (stageId: string) => {
  const stageQuery = usePSWatch<_Stage>('SELECT * FROM "calendar_stages" WHERE id = ?', [stageId], { detectChanges: true })
  const roundsQuery = usePSWatch<_Round>('SELECT * FROM "calendar_rounds" WHERE _stage = ? ORDER BY sePI ASC', [stageId], { detectChanges: true })
  const groupsQuery = usePSWatch<_Table>('SELECT * FROM "group_tables" WHERE _link LIKE ?', [`%"_refId":"${stageId}"%`], { detectChanges: true })

  await Promise.all([groupsQuery.await()])

  const userIds = groupsQuery.data.value
    .flatMap((group) => JSON.parse((group.rows as string) || '[]'))
    .map((row) => row._user)
    .filter(Boolean)

  const usersQuery = usePSWatch<any>(`SELECT * FROM "account_users" WHERE id IN (${userIds.map(() => '?').join(',')})`, userIds)

  return usePSQueryWatcher<_P_Stage>([stageQuery, roundsQuery, groupsQuery, usersQuery], (stage) => {
    const userMap = Object.fromEntries(usersQuery.data.value.map((user) => [user.id, user]))

    stage.value = {
      ...stageQuery.data.value[0],
      rounds: roundsQuery.data.value,
      groups: groupsQuery.data.value.map((group) => {
        const parsedRows = JSON.parse((group.rows as string) || '[]')
        return {
          ...group,
          _link: JSON.parse(group._link as string),
          rows: parsedRows.map((row: any) => ({
            ...row,
            _user: userMap[row._user] || row._user,
          })),
        }
      }),
    }
  })
}

export const usePopulatedRound = async (roundId: string) => {
  const roundQuery = usePSWatch<_Round>('SELECT * FROM "calendar_rounds" WHERE id = ?', [roundId], { detectChanges: true })

  const challengesQuery = usePSWatch<_Challenge>('SELECT * FROM "game_challenges" WHERE _round = ? ORDER BY "order" ASC', [roundId])

  await Promise.all([roundQuery.await(), challengesQuery.await()])

  const transformedChallenges = challengesQuery.data.value.map((challenge) => ({ ...challenge, fixtureSlots: JSON.parse((challenge.fixtureSlots as string) ?? '[]') }))

  const realFixtures = transformedChallenges?.flatMap((c: any) => c.fixtureSlots).map((fs: any) => fs._realFixture)

  const realFixturesQuery = usePSWatch<_RealFixture>(`SELECT * FROM "real_fixtures" WHERE id IN (${realFixtures.map(() => '?').join(',')})`, realFixtures, { detectChanges: true })

  await realFixturesQuery.await()

  return usePSQueryWatcher<_Round>([roundQuery, challengesQuery, realFixturesQuery], (round) => {
    round.value = {
      ...roundQuery.data.value[0],
      challenges: transformedChallenges.map((challenge) => ({
        ...challenge,
        fixtureSlots: challenge.fixtureSlots.map((fs: { _realFixture: string; slotIndex: number }) => ({
          ...fs,
          _realFixture: realFixturesQuery.data.value.find((rf) => rf.id === fs._realFixture),
        })),
      })),
    }
  })
}

export const usePopulatedChallenge = async (challengeId: string) => {
  const challengeQuery = usePSWatch<_Challenge>(`SELECT * FROM "game_challenges" WHERE id IN (?)`, [challengeId])

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

export const usePopulatedBet = async (challengeId: string) => {
  console.log('OCOCO')

  const betsQuery = usePSWatch<_Bet>('SELECT * FROM "game_bets" WHERE "_challenge" = ?', [challengeId], { detectChanges: true })

  await betsQuery.await()

  return usePSQueryWatcher<_P_Bet>([betsQuery], (bet) => {
    bet.value = {
      ...betsQuery.data.value[0],
      betFixtureSlots: JSON.parse(betsQuery.data.value[0]?.betFixtureSlots ?? '[]'),
    }
  })
}
