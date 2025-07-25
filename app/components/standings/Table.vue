<template>
  <div class="relative">
    <div v-if="true" class="h-12 flex items-center justify-between">
      <div class="flex gap-4">
        <NuxtLink :to="useSL(`standings/${standings?.id}`)" class="block">{{ standingsName }}</NuxtLink>
        <NuxtLink v-if="standings?._parentGroup" :to="useSL(`standings/${standings?._parentGroup}`)" class="block"> Parent </NuxtLink>
        <NuxtLink v-if="childrenFixtures?.length > 0" :to="useSL(`standings/${standings?.id}/fixtures`)" class="block"> Fixtures </NuxtLink>
      </div>

      <div class="flex gap-4 items-center">
        <FormsToggleSwitch @change="isDetailsOn = !isDetailsOn" />
        <FormsToggleSwitch v-if="dgGrouping?.availableKeys?.length! > 1" @change="toggleGrouping" />
      </div>
    </div>

    <StandingsTopHeader v-if="false" :children-standings="childrenStandings" class="bg-white sticky top-0 z-[5] py-4" />

    <div class="overflow-x-scroll hide-scroll" @mouseleave="clearHighlight">
      <StandingsRowHeader
        :grouping-key="groupingKey"
        :dg-contributions-grouped-labels="dgContributionsGroupedLabels"
        :dg-grouping="dgGrouping"
        :dg-grouping-columns-populated="dgGroupingColumnsPopulated"
        :is-observed="true"
        :is-details-on="isDetailsOn"
        @update:isRowTitleInvisible="(value) => (isRowTitleInvisible = value)"
        @shuffle="shufflePoints"
      />

      <TransitionGroup tag="div" name="standing-row">
        <div
          v-for="(row, ri) of sortedRows"
          :key="row._user.id || ri"
          class="w-[var(--container-width)] h-16 lg:h-10 border-b border-gray-100 hover:bg-blue-50 bg-green-200"
          :class="[row.isMetaRow ? 'bg-yellow-50 text-yellow-800 font-medium' : isCurrentUserRow(row) ? 'bg-green-50 text-green-900 font-medium' : 'bg-white', rowClass]"
        >
          <div class="flex bg-inherit w-full max-lg:w-maxXX h-full items-stretch relative">
            <div class="absolute top-0 left-0 z-[10] lg:hidden w-12 overflow-visible bg-green-200">
              <Transition name="appear-from-left">
                <StandingsRowTitle
                  v-if="isRowTitleInvisible"
                  :row="row"
                  :ri="row.isMetaRow ? '—' : ri + 1 - sortedRows.slice(0, ri).filter((r: any) => r.isMetaRow).length"
                  class="text-xs italic text-gray-700 w-[var(--container-width)] shrink-0"
                />
              </Transition>
            </div>

            <div class="max-lg:-ml-12X flex bg-inherit w-full max-lg:w-maxXX h-full items-stretch gap-8X justify-between">
              <StandingsRowTitle
                :row="row"
                :ri="row.isMetaRow ? '—' : ri + 1 - sortedRows.slice(0, ri).filter((r: any) => r.isMetaRow).length"
                :is-truncate="true"
                class="lg:sticky bg-inherit z-[3] left-0 truncate w-48 shrink-0"
              />

              <div v-if="isDetailsOn" class="h-full w-8 bg-gradient-to-r from-white max-lg:hidden sticky top-0 left-48 z-3" />
              <div v-if="isDetailsOn" class="flex-1 flex">
                <div v-for="group in dgContributionsGroupedLabels" :key="group.key" class="flex flex-1">
                  <div
                    v-for="cs in group._groupedStandings"
                    :key="cs.id"
                    class="flex-1 min-w-24 truncate px-2"
                    @mouseenter="setHighlight(ri, cs.id)"
                    :class="{ 'bg-blue-50': highlightedStandingId === cs.id || highlightedRow === ri }"
                  >
                    <UtilLineBar
                      class="h-full"
                      color="blue-500"
                      :background-color="highlightedStandingId === cs.id || highlightedRow === ri ? 'blue-50' : 'white'"
                      text-color="gray-700"
                      variant="subtle"
                    >
                      <span class="text-xs font-medium truncate">{{ cs?.rows?.find((sr: any) => sr._user?.id === row._user?.id)?.points?.[1] ?? 0 }}</span>
                    </UtilLineBar>
                  </div>
                </div>
              </div>
              <div v-if="isDetailsOn" class="h-full w-8 bg-gradient-to-l from-white max-lg:hidden sticky top-0 right-48 z-3" />

              <div class="lg:sticky bg-inherit z-[3] right-0 flex gap-2 truncate shrink-0 items-center w-48">
                <template v-if="!row.isMetaRow">
                  <div
                    v-for="tDef of dgGroupingColumnsPopulated"
                    :key="tDef.standings?.id"
                    @mouseenter="setHighlight(ri, tDef.standings?.id)"
                    :class="{ 'bg-blue-50': highlightedStandingId === tDef.standings?.id || highlightedRow === ri }"
                    class="size-full flex-center"
                  >
                    <UtilLineBar color="green-500" background-color="white" text-color="gray-700" variant="subtle" class="w-full">
                      <span class="text-xs font-bold">{{ tDef.standings?.rows?.find((sr: any) => sr._user?.id === row._user?.id)?.points?.[tDef.pInd ?? 1] }}</span>
                    </UtilLineBar>
                  </div>
                </template>
                <UtilLineBar v-else color="yellow-500" background-color="white" text-color="gray-700" variant="subtle" class="w-full">
                  <span class="text-xs font-bold">{{ row.points[0] }}</span>
                </UtilLineBar>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _Season, _P_Group, ParsedBPTournament } from '~/../types'

const season = useState<_Season>('season')

interface Props {
  standings: _P_Group
  childrenStandings: _P_Group[]
  childrenFixtures: _P_Group[]
  tournament?: ParsedBPTournament
  rowClass?: string
}

const { isCurrentUserRow } = useUserHelpers()

const props = withDefaults(defineProps<Props>(), { rowClass: '' })

/*
console.log(season.value)
console.log(props.standings)
console.log(props.tournament)
console.log(props.childrenStandings)
*/

const dgGrouping = computed(() => props.tournament?.displayConfig?.grouping?.[props.standings?._link?._refColl?.toLowerCase()])

const dgGroupingColumnsPopulated = computed(() =>
  dgGrouping.value?.columnDisplay?.ungroupedTournamentIds?.columns.map((tDef: any) => ({
    ...tDef,
    t: season.value?.tournaments?.find((t: any) => t.id === tDef.tid),
    standings: (tDef.source === 'children' ? props.childrenStandings : [props.standings]).find((cs) => cs._tournament === tDef.tid),
  }))
)

const childrenStandingsThatAreUngrouped = computed(() =>
  props.childrenStandings.filter((cs) =>
    dgGrouping.value?.columnDisplay?.tournamentIdGroups
      ?.filter((tGroup) => tGroup.source === 'children')
      ?.map((tGroup) => tGroup.tid)
      ?.includes(cs._tournament!)
  )
)

const isDetailsOn = ref(false)

const groupIndex = ref(0)
const groupingKey = computed(() => dgGrouping.value?.availableKeys?.[groupIndex.value])
const toggleGrouping = (val: boolean) => (groupIndex.value = val ? 1 : 0)

const getterFn = (cs: any) => {
  if (groupingKey.value?.key === '_link._refId') return cs._link?._refId
  else if (groupingKey.value?.key === '_tournament') return cs?._tournament
  else return null
}

const groupItemFn = (key: string) => {
  if (groupingKey.value?.key === '_link._refId') {
    const firstItem = childrenStandingsThatAreUngrouped.value?.[0]
    const refColl = firstItem?._link?._refColl?.toLowerCase()
    if (refColl === 'stage') {
      return season.value?.stages?.find((s: any) => s.id === key)
    } else if (refColl === 'round') {
      return season.value?.rounds?.find((r: any) => r.id === key)
    } else if (refColl === 'season') {
      return season.value // If it's season, just return the season
    }
  } else if (groupingKey.value?.key === '_tournament') {
    return season.value?.tournaments?.find((t: any) => t.id === key)
  }

  return null
}

const dgContributionsGroupedLabels = computed(() => {
  if (!childrenStandingsThatAreUngrouped.value?.length) return []
  const groupedByRefId: Record<string, any[]> = {}

  const currentGroupingKeyStr = groupingKey.value?.key || '_tournament'
  const oppositeGroupingKeyStr = currentGroupingKeyStr === '_link._refId' ? '_tournament' : '_link._refId'

  const getOppositeItem = (cs: any) =>
    oppositeGroupingKeyStr === '_link._refId' ? season.value?.stages?.find((s: any) => s.id === cs._link?._refId) : season.value?.tournaments?.find((t: any) => t.id === cs._tournament)

  childrenStandingsThatAreUngrouped.value.forEach((cs) => {
    const groupKey = getterFn(cs)
    if (!groupedByRefId[groupKey]) groupedByRefId[groupKey] = []
    groupedByRefId[groupKey].push(cs)
  })

  return Object.entries(groupedByRefId).map(([refId, standings]) => ({
    key: refId,
    item: groupItemFn(getterFn(standings[0])),
    _groupedStandings: standings.map((s) => ({
      ...s,
      item: getOppositeItem(s),
    })),
  }))
})

wecl(dgContributionsGroupedLabels, 'dgContributionsGroupedLabels')

const standingsName = computed(() => props.standings?.name || 'Standings')
const localRows = ref<any>([])
const sortIndex = ref(0)

/*
wecl(season)
wecl(props.childrenStandings)
wecl(groupedChildren)
*/

watchEffect(() => (localRows.value = props.standings?.rows ? JSON.parse(JSON.stringify(props.standings.rows)) : []))

// Function to sort by specific point index
const sortByPointIndex = (index: number) => (sortIndex.value = index)

const sortedRows = computed<any>(() => {
  if (!localRows.value?.length) return []

  const metaRows = []
  const metaRowsConfig = dgGrouping.value?.metaRows

  if (metaRowsConfig?.enabled) {
    const metaValues = getNestedValue(props.standings, metaRowsConfig.source)
    if (metaValues?.length >= metaRowsConfig.rows.length)
      metaRows.push(...metaRowsConfig.rows.map((row, index) => ({ _user: { id: row.id, name: row.name }, points: [metaValues[index]], isMetaRow: true })))
  }

  return [...localRows.value, ...metaRows].sort((a, b) => {
    const pointsA = Array.isArray(a.points) ? a.points[sortIndex.value] ?? 0 : sortIndex.value === 0 ? a.points : 0
    const pointsB = Array.isArray(b.points) ? b.points[sortIndex.value] ?? 0 : sortIndex.value === 0 ? b.points : 0
    return pointsB - pointsA // Always descending
  })
})

const shufflePoints = () => {
  if (!localRows.value?.length) return
  localRows.value = localRows.value.map((row: any) => {
    const randomPoints = Math.floor(Math.random() * 100) + 50
    if (Array.isArray(row.points)) return { ...row, points: [randomPoints, ...row.points.slice(1)] }
    return { ...row, points: randomPoints }
  })
}

const highlightedRow = ref<number | null>(null)
const highlightedStandingId = ref<string | null>(null)

const setHighlight = (rowIndex: number, standingId: string) => {
  highlightedRow.value = rowIndex
  highlightedStandingId.value = standingId
}

const clearHighlight = () => {
  highlightedRow.value = null
  highlightedStandingId.value = null
}

const isRowTitleInvisible = ref(false)

defineExpose({
  sortedRows,
  localRows,
})
</script>
