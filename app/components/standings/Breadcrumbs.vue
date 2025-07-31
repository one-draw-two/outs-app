<template>
  <div class="flex items-center gap-1">
    <div v-for="(item, index) in breadcrumbsWithLinks" :key="item.id" class="flex-1 flex items-center gap-1">
      <NuxtLink :to="item.$urlLink" class="block hover:text-primary truncate">
        {{ item.$label }}
      </NuxtLink>
      <span v-if="index < breadcrumbsWithLinks.length - 1" class="text-gray-400">/</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _P_Season, _P_Group } from '~/../types'

const props = defineProps<{
  breadCrumbChain?: _P_Group[]
}>()
const season = useState<_P_Season>('season')

const breadcrumbsWithLinks = computed(() =>
  props.breadCrumbChain!.map((item) => {
    if (!item.meta?.isContributionGroup)
      return Object.assign({}, item, {
        $label: item.name,
        $urlLink: useSL(`standings/${item.id}`),
      })

    const link = item._link
    const linkColl = link?._refColl === 'Season' ? 'campaign' : link?._refColl?.toLowerCase()

    let label = item.name

    // If the link is to a Stage, try to get the stage name from the season data
    if (link?._refColl === 'Stage' && season.value?.stages) {
      const stageFromSeason = season.value.stages.find((s) => s.id === link._refId)
      if (stageFromSeason) label = stageFromSeason.name
    }

    return Object.assign({}, item, {
      $label: label,
      $urlLink: useSL(`${linkColl}/${link._refId}`),
    })
  })
)
</script>
