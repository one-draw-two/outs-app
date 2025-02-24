import type { _Season, _Stage, _Round, _Challenge, _RealFixture } from '~/types'

export const useSeasonWithStages = (seasonId: string) => {
  const seasonsQuery = usePSWatch<_Season>('SELECT * FROM seasons WHERE id = ?', [seasonId])
  const stagesQuery = usePSWatch<_Stage>('SELECT * FROM stages WHERE _season = ? ORDER BY sePI ASC', [seasonId])
  const roundsQuery = usePSWatch<_Round>('SELECT * FROM rounds WHERE _season = ? ORDER BY sePI ASC', [seasonId])

  return usePSQueryWatcher<_Season>([seasonsQuery, stagesQuery, roundsQuery], (season) => {
    season.value = {
      ...seasonsQuery.data.value[0],
      stages: stagesQuery.data.value.map((stage) => ({
        ...stage,
        rounds: roundsQuery.data.value?.filter((round) => round._stage === stage.id) || [],
      })),
    }
  })
}

export const usePopulatedRound = async (roundId: string) => {
  const roundQuery = usePSWatch<_Round>('SELECT * FROM rounds WHERE id = ?', [roundId])

  const challengesQuery = usePSWatch<_Challenge>('SELECT * FROM challenges WHERE _round = ? ORDER BY "order" ASC', [roundId])

  await Promise.all([roundQuery.await(), challengesQuery.await()])

  const transformedChallenges = challengesQuery.data.value.map((challenge) => ({ ...challenge, fixtureSlots: JSON.parse(challenge.fixtureSlots as string) }))

  const realFixtures = transformedChallenges?.flatMap((c: any) => c.fixtureSlots).map((fs: any) => fs._realFixture)

  const realFixturesQuery = usePSWatch<_RealFixture>(`SELECT * FROM "real_fixtures" WHERE id IN (${realFixtures.map(() => '?').join(',')})`, realFixtures, { detectChanges: true })

  await realFixturesQuery.await()

  return usePSQueryWatcher<_Round>([roundQuery, challengesQuery, realFixturesQuery], (round) => {
    round.value = {
      ...roundQuery.data.value[0],
      challenges: transformedChallenges.map((challenge) => ({
        ...challenge,
        fixtureSlots: challenge.fixtureSlots.map((fs: any) => ({
          ...fs,
          _realFixture: realFixturesQuery.data.value.find((rf: _RealFixture) => rf.id === fs._realFixture),
        })),
      })),
    }
  })
}
