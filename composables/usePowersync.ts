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
  const seasonQuery = ref('SELECT * FROM seasons WHERE _id = ?')
  const { data: seasons } = useQuery<Season>(seasonQuery, [seasonId])

  // Get stages
  const stagesQuery = ref('SELECT * FROM stages WHERE _season = ?')
  const { data: stages } = useQuery<Stage>(stagesQuery, [seasonId])

  // Get rounds
  const roundsQuery = ref('SELECT * FROM rounds WHERE _season = ?')
  const { data: rounds } = useQuery<Round>(roundsQuery, [seasonId])

  watchEffect(() => {
    // Check if all data is available
    if (seasons.value?.[0] && stages.value && rounds.value) {
      const season = seasons.value[0]

      const populatedStages = stages.value.map((stage) => ({
        ...stage,
        rounds: rounds.value?.filter((round) => round._stage === stage._id) || [],
      }))

      selectedSeason.value = { ...season, stages: populatedStages }
      isLoading.value = false
    }
  })

  return {
    selectedSeason,
    isLoading,
  }
}
