import type { Season, Season_Populated, Stage, Round, Challenge, RealFixture } from '~/types'

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

export const usePopulatedRound = (roundId: string) => {
  const isLoading = ref(true)
  const selectedRound = ref<Round | null>(null)

  // Get round
  const { data: rounds } = usePSWatch<Round>('SELECT * FROM rounds WHERE id = ?', [roundId])

  // Get challenges
  const { data: challenges } = usePSWatch<Challenge>('SELECT * FROM challenges WHERE _round = ? ORDER BY "order" ASC', [roundId])

  watchEffect(() => {
    if (rounds.value?.[0] && challenges.value) {
      const transformedChallenges = challenges.value.map((challenge) => ({
        ...challenge,
        fixtureSlots: JSON.parse(challenge.fixtureSlots as string),
      }))

      selectedRound.value = {
        ...rounds.value[0],
        challenges: transformedChallenges,
      }
      isLoading.value = false
    } else {
      isLoading.value = true
    }
  })

  return {
    selectedRound,
    isLoading,
  }
}

export const usePopulatedRealFixture = (rfId: string) => {
  const isLoading = ref(true)
  const selectedRealFixture = ref<RealFixture | null>(null)

  const { data: realFixtures } = usePSWatch<RealFixture>('SELECT * FROM "real_fixtures" WHERE id = ?', [rfId])

  watchEffect(() => {
    if (realFixtures.value?.[0]) {
      selectedRealFixture.value = realFixtures.value[0]
      isLoading.value = false
    } else {
      isLoading.value = true
    }
  })

  return {
    selectedRealFixture,
    isLoading,
  }
}
