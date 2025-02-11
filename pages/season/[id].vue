<template>
  <h1>Season {{ selectedSeason?.name }}</h1>
  <div class="size-128 bg-cover bg-center bg-no-repeat" :style="{ backgroundImage: selectedSeason?.bgUrl ? `url(${selectedSeason.bgUrl})` : 'none' }"></div>
</template>

<script setup lang="ts">
import { useQuery } from '@powersync/vue'
import type { Season, Stage, Round } from '~/types'

definePageMeta({
  layout: 'season',
})

const route = useRoute()
useHead({
  title: `Season ${route.params.id}`,
})

export interface Stage_Populated extends Stage {
  rounds: Round[]
}

export interface Season_Populated extends Omit<Season, 'stages'> {
  stages: Stage_Populated[]
}

const query = ref(`
  SELECT 
      seasons.id,
      seasons._id,
      seasons.name,
      seasons.bgUrl,
      seasons._currentRound,
      json_group_array(
          json_object(
              'id', stages._id,
              '_id', stages._id,
              'name', stages.name,
              '_season', stages._season,
              'rounds', (
                  SELECT json_group_array(
                      json_object(
                          'id', rounds._id,
                          '_id', rounds._id,
                          'name', rounds.name,
                          '_stage', rounds._stage,
                          '_season', rounds._season
                      )
                  )
                  FROM rounds
                  WHERE rounds._stage = stages._id
              )
          )
      ) AS stages
  FROM seasons
  LEFT JOIN stages ON seasons._id = stages._season
  WHERE seasons._id = ?
  GROUP BY seasons.id, seasons._id, seasons.name, seasons.bgUrl
`)
const { data: seasons, isLoading, isFetching, error } = useQuery<Season>(query, [route.params.id], {})
const selectedSeason = computed(() => {
  const season = seasons.value?.[0]
  if (!season || !season.stages) return null

  try {
    return {
      ...season,
      stages: JSON.parse(season.stages),
    }
  } catch (error) {
    console.error('Failed to parse stages JSON:', error)
    return {
      ...season,
      stages: [],
    }
  }
})

watch(
  selectedSeason,
  (to) => {
    console.log('Selected season')
    console.log(to)
  },
  { immediate: false }
)
</script>
