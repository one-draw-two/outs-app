import { useQuery } from '@powersync/vue'
import type { Season, Season_Populated, Stage, Round } from '~/types'

export const useSeasons = () => {
  const query = ref('SELECT * FROM seasons')
  const { data: seasons, isLoading, isFetching, error } = useQuery<Season>(query, [], {})

  return {
    seasons,
    isLoading,
    isFetching,
    error,
  }
}

export const useSeasonWithStages = (seasonId: string) => {
  const isLoading = ref(true)
  const selectedSeason = ref<Season_Populated | null>(null)

  // Get season
  const seasonQuery = ref('SELECT * FROM seasons WHERE id = ?')
  const { data: seasons, isFetching: seasonFetching } = useQuery<Season>(seasonQuery, [seasonId])

  // Get stages
  const stagesQuery = ref('SELECT * FROM stages WHERE _season = ? ORDER BY sePI ASC')
  const { data: stages, isFetching: stagesFetching } = useQuery<Stage>(stagesQuery, [seasonId])

  // Get rounds
  const roundsQuery = ref('SELECT * FROM rounds WHERE _season = ? ORDER BY sePI ASC')
  const { data: rounds, isFetching: roundsFetching } = useQuery<Round>(roundsQuery, [seasonId])

  watchEffect(() => {
    // Check if all data is available AND not fetching
    if (
      !seasonFetching.value &&
      !stagesFetching.value &&
      !roundsFetching.value &&
      seasons.value?.[0] &&
      stages.value?.length >= 0 &&
      rounds.value?.length >= 0
    ) {
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

  const roundQuery = ref('SELECT * FROM rounds WHERE id = ?')
  const { data: rounds, isFetching: roundsFetching } = useQuery<Round>(roundQuery, [roundId])

  watchEffect(() => {
    // Check if all data is available AND not fetching
    if (!roundsFetching.value && rounds.value?.length >= 0) {
      const round = rounds.value[0]

      selectedRound.value = { ...round }
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
