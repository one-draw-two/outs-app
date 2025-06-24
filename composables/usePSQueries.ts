import type {
  _Season,
  _Stage,
  _P_Round,
  _Round,
  _Standing,
  _Challenge,
  _Bet,
  _P_Bet,
  _P_Stage,
  _RealFixture,
  _RealTeam,
  _P_Challenge,
  _P_RealFixture,
  _RealEvent,
  FixtureSlot,
  BetFixtureSlot,
  _Snapshot,
} from '~/types'

export const usePopulatedSeason = async (seasonId: string) => {
  const seasonQuery = usePSWatch<_Season>('SELECT * FROM "calendar_seasons" WHERE id = ?', [seasonId])
  const stagesQuery = usePSWatch<_Stage>('SELECT * FROM "calendar_stages" WHERE _season = ? ORDER BY sePI ASC', [seasonId])
  const roundsQuery = usePSWatch<_Round>('SELECT * FROM "calendar_rounds" WHERE _season = ? ORDER BY sePI ASC', [seasonId])

  await Promise.all([seasonQuery.await(), stagesQuery.await(), roundsQuery.await()])

  const season = seasonQuery.data.value[0]
  const domainQuery = usePSWatch<any>('SELECT * FROM "blueprint_domains" WHERE id = ?', [season?._bpDomain])
  await domainQuery.await()

  const domain = domainQuery.data.value[0] || {}
  const tournamentIds = JSON.parse(domain?.tournaments ?? '[]')

  const tournamentsQuery = usePSWatch<any>(`SELECT * FROM "blueprint_tournaments" WHERE id IN (${tournamentIds.map(() => '?').join(',')})`, tournamentIds)
  await tournamentsQuery.await()

  const transformedTournaments = tournamentsQuery.data.value.map((tournament) => ({
    ...tournament,
    scopeConfig: JSON.parse(tournament.scopeConfig || '[]'),
    snapshotConfig: JSON.parse(tournament.snapshotConfig || '[]'),
  }))

  const queries = [seasonQuery, stagesQuery, roundsQuery, domainQuery, tournamentsQuery]

  return usePSQueryWatcher<any>(queries, (populatedSeason) => {
    populatedSeason.value = {
      ...season,
      _domain: domain,
      stages: stagesQuery.data.value.map((stage) => ({ ...stage, rounds: roundsQuery.data.value.filter((round) => round._stage === stage.id) })),
      rounds: roundsQuery.data.value, // All rounds flat
      tournaments: transformedTournaments,
    }
  })
}

export const usePopulatedRound = async (roundId: string, userId?: string) => {
  const roundQuery = usePSWatch<_Round>('SELECT * FROM "calendar_rounds" WHERE id = ?', [roundId], { detectChanges: true })
  const challengesQuery = usePSWatch<_Challenge>('SELECT * FROM "entry_challenges" WHERE _round = ? ORDER BY "order" ASC', [roundId])
  const betsQuery = usePSWatch<_Bet>('SELECT * FROM "entry_bets" WHERE "_round" = ?', [roundId], { detectChanges: true })

  await Promise.all([roundQuery.await(), challengesQuery.await(), betsQuery.await()])

  const transformedChallenges = challengesQuery.data.value.map((challenge) => ({ ...challenge, fixtureSlots: JSON.parse(challenge.fixtureSlots ?? '[]') }))
  const transformedBets = betsQuery.data.value.map((bet) => ({ ...bet, betFixtureSlots: JSON.parse(bet?.betFixtureSlots ?? '[]') }))

  const realFixtures = transformedChallenges?.flatMap((c: any) => c.fixtureSlots).map((fs: any) => fs._realFixture)
  const realFixturesQuery = usePSWatch<_RealFixture>(`SELECT * FROM "real_fixtures" WHERE id IN (${realFixtures.map(() => '?').join(',')})`, realFixtures, { detectChanges: true })

  const snapshotsQuery = usePSWatch<_Snapshot>('SELECT * FROM "timeline_snapshots" WHERE "_round" = ? ORDER BY "order" ASC', [roundId], { detectChanges: true })

  // const stageQuery = usePSWatch<_Stage>('SELECT * FROM "calendar_stages" WHERE id = ?', [roundQuery.data.value[0]?._stage], { detectChanges: true })
  // const { processedGroups } = await useGroupsWithUsers({ _refId: roundId })

  const { processedGroups } = await useGroupsWithUsers({ _refId: roundId }, true, userId)
  // const enhancedFixtures = enhanceFixturesWithUserData(processedGroups, userId)
  const enhancedFixtures = computed(() => enhanceFixturesWithUserData(processedGroups.value, userId))

  return usePSQueryWatcher<_P_Round>([roundQuery, challengesQuery, realFixturesQuery, betsQuery], (round) => {
    const processedSnapshots = snapshotsQuery.data.value
      .map((snapshot) => ({
        ...snapshot,
        _challenge: snapshot._challenge || undefined,
        _realFixture: realFixturesQuery.data.value.find((rf) => rf.id === snapshot._realFixture),
      }))
      // .sort((a, b) => new Date(a._realFixture?.startingAt || 0).getTime() - new Date(b._realFixture?.startingAt || 0).getTime())
      .map((snapshot, index) => {
        const fixtureId = snapshot._realFixture?.id

        // console.log('snapshot', snapshot)

        const challenge = transformedChallenges.find((c) => c.id === snapshot._challenge)

        const fixtureWithChallenges = {
          ...snapshot,
          _realFixture: {
            ...snapshot._realFixture,
            $index: index,
            /*
            $challenges: transformedChallenges
              .filter((challenge) => challenge.fixtureSlots?.some((slot: FixtureSlot) => slot._realFixture === fixtureId))
              .map((challenge) => ({
                ...challenge,
                $userBet: transformedBets.find((bet) => bet._challenge === challenge.id)?.betFixtureSlots?.find((slot: BetFixtureSlot) => slot._realFixture === fixtureId),
              })),
            */
            $challenge: challenge && {
              ...challenge,
              $userBet: transformedBets.find((bet) => bet._challenge === challenge.id)?.betFixtureSlots?.find((slot: BetFixtureSlot) => slot._realFixture === fixtureId),
            },
          },
        }

        return fixtureWithChallenges
      })

    round.value = {
      ...roundQuery.data.value[0],
      challenges: transformedChallenges,
      snapshots: processedSnapshots,
      userBets: transformedBets,
      userFixtures: enhancedFixtures,
      // _stage: stageQuery.data.value[0],
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

export const usePopulatedGroupCursor = async (fid: string) => {
  const cursorQuery = usePSWatch(`SELECT *, "_group" FROM "group_cursors" WHERE "_group" IN (?)`, [fid])

  await cursorQuery.await()

  return usePSQueryWatcher([cursorQuery], (cursor) => {
    const rawCursor = cursorQuery.data.value[0]

    if (rawCursor) {
      cursor.value = {
        ...rawCursor,
        _link: JSON.parse(rawCursor._link || '{}'),
        betsAddedSnapshots: JSON.parse(rawCursor.betsAddedSnapshots || '[]'),
      }
    } else {
      cursor.value = null
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

/*
export const useGroupsWithUsers = async (filters: Record<string, any> = {}, isFixture = false, userInPsKeys?: string) => {
  const tableName = isFixture ? 'group_fixtures' : 'group_standings'

  let query = `SELECT * FROM "${tableName}" WHERE 1=1`
  const params: any[] = []

  Object.entries(filters).forEach(([k, v]) =>
    k === '_refId'
      ? ((query += ` AND _link LIKE ?`), params.push(`%"_refId":"${v}"%`))
      : k.includes('.')
      ? ((query += ` AND json_extract(${k.split('.')[0]}, '$.${k.split('.')[1]}') = ?`), params.push(v))
      : ((query += ` AND ${k} = ?`), params.push(v))
  )

  if (isFixture && userInPsKeys) {
    query += ` AND (psKeys LIKE ? OR psKeys IS NULL)`
    params.push(`%${userInPsKeys}%`)
  }

  const groupsQuery = usePSWatch<_Standing>(query, params, { detectChanges: true })
  await groupsQuery.await()

  const userIds = groupsQuery.data.value
    .flatMap((group) => JSON.parse((group.rows as string) || '[]'))
    .map((row) => row._user)
    .filter(Boolean)

  let userMap: Record<string, any> = {}
  if (userIds.length > 0) {
    const usersQuery = usePSWatch<any>(`SELECT * FROM "account_users" WHERE id IN (${userIds.map(() => '?').join(',')})`, userIds)
    await usersQuery.await()
    userMap = Object.fromEntries(usersQuery.data.value.map((user) => [user.id, user]))
  }

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
*/

export const useGroupsWithUsers = async (filters: Record<string, any> = {}, isFixture = false, userInPsKeys?: string) => {
  const tableName = isFixture ? 'group_fixtures' : 'group_standings'

  let query = `SELECT * FROM "${tableName}" WHERE 1=1`
  const params: any[] = []

  Object.entries(filters).forEach(([k, v]) =>
    k === '_refId'
      ? ((query += ` AND _link LIKE ?`), params.push(`%"_refId":"${v}"%`))
      : k.includes('.')
      ? ((query += ` AND json_extract(${k.split('.')[0]}, '$.${k.split('.')[1]}') = ?`), params.push(v))
      : ((query += ` AND ${k} = ?`), params.push(v))
  )

  if (isFixture && userInPsKeys) {
    query += ` AND (psKeys LIKE ? OR psKeys IS NULL)`
    params.push(`%${userInPsKeys}%`)
  }

  // Use detectChanges: true to make the query reactive
  const groupsQuery = usePSWatch<_Standing>(query, params, { detectChanges: true })
  await groupsQuery.await()

  // Create a reactive reference for the user map
  const userMap = ref<Record<string, any>>({})

  // Function to update user map when group data changes
  const updateUserMap = async () => {
    const userIds = groupsQuery.data.value
      .flatMap((group) => JSON.parse((group.rows as string) || '[]'))
      .map((row) => row._user)
      .filter(Boolean)

    if (userIds.length > 0) {
      const usersQuery = usePSWatch<any>(`SELECT * FROM "account_users" WHERE id IN (${userIds.map(() => '?').join(',')})`, userIds)
      await usersQuery.await()
      userMap.value = Object.fromEntries(usersQuery.data.value.map((user) => [user.id, user]))
    } else {
      userMap.value = {}
    }
  }

  // Initial user map update
  await updateUserMap()

  // Watch for changes in groups and update user map
  watch(groupsQuery.data, updateUserMap, { deep: true })

  // Create a computed property that updates when groups or user map changes
  const processedGroups = computed(() =>
    groupsQuery.data.value.map((group) => {
      const parsedRows = JSON.parse((group.rows as string) || '[]')
      return {
        ...group,
        _link: JSON.parse(group._link as string),
        meta: JSON.parse(group.meta as string),
        rows: parsedRows.map((row: any) => ({
          ...row,
          _user: userMap.value[row._user] || row._user,
        })),
      }
    })
  )

  // Return the same format but with reactive data
  return {
    processedGroups,
  }
}
