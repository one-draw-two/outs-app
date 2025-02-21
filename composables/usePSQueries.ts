import type { Season, Season_Populated, Stage, Round, _Challenge, RealFixture } from '~/types'

export const useSeasonWithStages = (seasonId: string) => {
  const isLoading = ref(true)
  const selectedSeason = ref<Season_Populated | null>(null)

  // Get season
  const { data: seasons } = usePSWatch<Season>('SELECT * FROM seasons WHERE id = ?', [seasonId])

  // Get stages
  const { data: stages } = usePSWatch<Stage>('SELECT * FROM stages WHERE _season = ? ORDER BY sePI ASC', [seasonId])

  // Get rounds
  const { data: rounds } = usePSWatch<Round>('SELECT * FROM rounds WHERE _season = ? ORDER BY sePI ASC', [seasonId])

  watchEffect(() => {
    if (seasons.value?.[0] && stages.value && rounds.value) {
      const season = seasons.value[0]

      const populatedStages = stages.value.map((stage) => ({
        ...stage,
        rounds: rounds.value?.filter((round) => round._stage === stage.id) || [],
      }))

      selectedSeason.value = { ...season, stages: populatedStages }
      isLoading.value = false
    } else {
      isLoading.value = true
    }
  })

  return {
    selectedSeason,
    isLoading,
  }
}

export const usePopulatedRound = async (roundId: string) => {
  const roundQuery = usePSWatch<Round>('SELECT * FROM rounds WHERE id = ?', [roundId])

  const challengesQuery = usePSWatch<_Challenge>('SELECT * FROM challenges WHERE _round = ? ORDER BY "order" ASC', [roundId])

  await Promise.all([roundQuery.await(), challengesQuery.await()])

  const transformedChallenges = challengesQuery.data.value.map((challenge) => ({ ...challenge, fixtureSlots: JSON.parse(challenge.fixtureSlots as string) }))

  const realFixtures = transformedChallenges?.flatMap((c: any) => c.fixtureSlots).map((fs: any) => fs._realFixture)

  const realFixturesQuery = usePSWatch<RealFixture>(`SELECT * FROM "real_fixtures" WHERE id IN (${realFixtures.map(() => '?').join(',')})`, realFixtures, { detectChanges: true })

  await realFixturesQuery.await()

  return usePSQueryWatcher<Round>([roundQuery, challengesQuery, realFixturesQuery], (round) => {
    round.value = {
      ...roundQuery.data.value[0],
      challenges: transformedChallenges.map((challenge) => ({
        ...challenge,
        fixtureSlots: challenge.fixtureSlots.map((fs: any) => ({
          ...fs,
          _realFixture: realFixturesQuery.data.value.find((rf: RealFixture) => rf.id === fs._realFixture),
        })),
      })),
    }
  })
}

export const usRFs = (rfIds: string[]) => usePSWatch<RealFixture>(`SELECT * FROM "real_fixtures" WHERE id IN (${rfIds.map(() => '?').join(',')})`, rfIds)
