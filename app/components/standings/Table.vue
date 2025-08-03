<template>
  <div class="relative">
    <StandingsTableHeader
      :standings="standings"
      :children-fixtures="childrenFixtures"
      :tournament="tournament"
      :is-details-on="isDetailsOn"
      :breadcrumb-chain="breadcrumbs"
      @update:is-details-on="isDetailsOn = $event"
      @shuffle="shufflePoints"
      @toggle-grouping="toggleGrouping"
    />

    <StandingsTopHeader v-if="false" :children-standings="childrenStandings" class="bg-white sticky top-0 z-[5] py-4" />

    <div class="relative">
      <TableMobileTitlesBG
        :is-details-on="isDetailsOn"
        :header-repeat-interval="HEADER_REPEAT_INTERVAL"
        :sorted-rows="sortedRows"
        :is-current-user-row="isCurrentUserRow"
        :is-first-after-header="isFirstAfterHeader"
      />

      <TableBGScroll :is-details-on="isDetailsOn" :header-repeat-interval="HEADER_REPEAT_INTERVAL">
        <template v-for="(row, ri) of sortedRows" :key="row._user.id || `row-${ri}`">
          <div v-if="ri === 0 || (isDetailsOn && ri % HEADER_REPEAT_INTERVAL === 0)" :key="`header-${ri}`" class="z-2">
            <StandingsRowHeader
              :grouping-key="groupingKey"
              :dg-contributions-grouped-labels="dgContributionsGroupedLabels"
              :dg-grouping="dgGrouping"
              :dg-grouping-columns-populated="dgGroupingColumnsPopulated"
              :is-details-on="isDetailsOn"
            />
          </div>
          <div
            class="px-[var(--twContPadding)] lg:w-full h-16"
            :class="[
              row.isMetaRow ? 'bg-yellow-50 text-yellow-800 font-medium' : isCurrentUserRow(row) ? 'text-green-900 font-medium' : 'lg:bg-white',
              isFirstAfterHeader(ri) ? 'border-y border-gray-200' : 'border-b border-gray-200',
            ]"
          >
            <div class="flex bg-inherit w-full h-full justify-between" :class="isDetailsOn ? 'max-lg:items-end max-lg:pb-1' : 'items-stretch'">
              <StandingsRowTitle
                :row="row"
                :ri="row.isMetaRow ? '—' : ri + 1 - sortedRows.slice(0, ri).filter((r: any) => r.isMetaRow).length"
                :is-truncate="true"
                class="lg:sticky bg-inherit z-[3] left-[var(--twContPadding)] truncate w-48 lg:shrink-0 bg-inherit"
                :class="isDetailsOn ? 'max-lg:hidden' : ''"
              />

              <div v-if="isDetailsOn" class="h-full taksi w-8 bg-gradient-to-r from-inherit to-transparent max-lg:hidden sticky top-0 left-[var(--table-shade-left)] z-3 shrink-0" />
              <div v-if="isDetailsOn" class="bg-inherit flex-1 flex gap-4">
                <div v-for="group in dgContributionsGroupedLabels" :key="group.key" class="bg-inherit flex flex-1">
                  <div v-for="cs in group._groupedStandings" :key="cs.id" class="bg-inherit flex-1 min-w-24 flex items-center truncate" @mouseenter="setHighlight(ri, cs.id)">
                    <UtilLineBar class="flex-1 max-lg:bg-white" :color="`${group.item?.color ?? 'gray'}-500`" text-color="gray-700" variant="subtle">
                      <span class="text-xs font-medium truncate">{{ cs?.rows?.find((sr: any) => sr._user?.id === row._user?.id)?.points?.[1] ?? 0 }}</span>
                    </UtilLineBar>
                  </div>
                </div>
              </div>
              <div v-if="isDetailsOn" class="h-full w-8 bg-gradient-to-l from-inherit to-transparent max-lg:hidden sticky top-0 right-48 z-3 shrink-0" />

              <div class="lg:sticky bg-inherit z-[3] right-0 flex gap-2 truncate shrink-0 items-center w-48 bg-inherit max-lg:bg-white">
                <template v-if="!row.isMetaRow">
                  <div
                    v-for="tDef of dgGroupingColumnsPopulated"
                    :key="tDef.standings?.id"
                    @mouseenter="setHighlight(ri, tDef.standings?.id)"
                    :class="{ 'bg-blue-50X': highlightedStandingId === tDef.standings?.id || highlightedRow === ri }"
                    class="bg-inherit size-full flex-center"
                  >
                    <UtilLineBar color="green-500" text-color="gray-700" variant="subtle" class="w-full" alignment="right" :offset="6">
                      <span class="text-xs font-bold">{{ tDef.standings?.rows?.find((sr: any) => sr._user?.id === row._user?.id)?.points?.[tDef.pInd ?? 1] ?? 0 }}</span>
                    </UtilLineBar>
                  </div>
                </template>
                <UtilLineBar v-else color="yellow-500" text-color="gray-700" variant="subtle" class="w-full">
                  <span class="text-xs font-bold">{{ row.points[0] }}</span>
                </UtilLineBar>
              </div>
            </div>
          </div>
        </template>
      </TableBGScroll>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _Season, _P_Group, ParsedBPTournament } from '~/../types'
import TableBGScroll from './TableBGScroll.vue'
import TableMobileTitlesBG from './TableMobileTitlesBG.vue'

const props = defineProps<{
  standings: _P_Group
  childrenStandings: _P_Group[]
  childrenFixtures: _P_Group[]
  tournament?: ParsedBPTournament
  breadcrumbs?: any[]
}>()

const HEADER_REPEAT_INTERVAL = 8

const season = useState<_Season>('season')

const { isCurrentUserRow } = useUserHelpers()

const isDetailsOn = ref(false)

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

const localRows = ref<any>([])
const sortIndex = ref(1)

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
  console.log('Shuffling points...')

  sortIndex.value = 0 // Reset sort index to first column

  localRows.value = localRows.value.map((row: any) => {
    const randomPoints = Math.floor(Math.random() * 100) + 50
    if (Array.isArray(row.points)) return { ...row, points: [randomPoints, ...row.points.slice(1)] }
    return { ...row, points: randomPoints }
  })
}

const highlightedRow = ref<number | null>(null)
const highlightedStandingId = ref<string | null>(null)

const setHighlight = (rowIndex: number, standingId: string) => {
  // highlightedRow.value = rowIndex
  // highlightedStandingId.value = standingId
}

const clearHighlight = () => {
  highlightedRow.value = null
  highlightedStandingId.value = null
}

const isFirstAfterHeader = (ri: number) => ri === 0 || (isDetailsOn.value && ri % HEADER_REPEAT_INTERVAL === 0)

defineExpose({
  sortedRows,
  localRows,
  shufflePoints,
  toggleGrouping,
})
</script>
