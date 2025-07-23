<template>
  <div class="relative">
    <div class="h-12 flex items-center justify-between">
      <div class="flex gap-4">
        <NuxtLink :to="useSL(`standings/${standings?.id}`)" class="block">{{ standingsName }}</NuxtLink>
        <NuxtLink v-if="standings?._parentGroup" :to="useSL(`standings/${standings?._parentGroup}`)" class="block"> Parent </NuxtLink>
        <NuxtLink v-if="childrenFixtures?.length > 0" :to="useSL(`standings/${standings?.id}/fixtures`)" class="block"> Fixtures </NuxtLink>
      </div>

      <div class="flex gap-4 items-center">
        <FormsToggleSwitch v-if="dgGrouping?.availableKeys?.length! > 1" @change="toggleGrouping" />
        <button @click="shufflePoints" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">Shuffle Points</button>
      </div>
    </div>

    <StandingsTopHeader v-if="false" :children-standings="childrenStandings" class="bg-white sticky top-0 z-[5] py-4" />

    <div class="overflow-x-scroll hide-scroll" @mouseleave="clearHighlight">
      <div class="py-8 max-lg:hidden border-y border-gray-100">
        <div class="flex w-full gap-8">
          <div class="bg-white sticky z-[3] left-0 w-48 shrink-0">
            <UtilLineBar color="blue-500" background-color="white" text-color="gray-700" variant="subtle">
              <span class="text-xs">{{ groupingKey?.label }}</span>
            </UtilLineBar>
            <UtilLineBar color="blue-500" background-color="white" text-color="gray-700" variant="subtle">
              <span class="text-xs">User</span>
            </UtilLineBar>
          </div>
          <div class="flex-1">
            <div class="flex min-w-max gap-4">
              <div class="flex-1" v-for="group in dgContributionsGroupedLabels" :key="group.key">
                <UtilLineBar color="green-500" background-color="white" text-color="gray-700" variant="subtle">
                  <span class="text-xs font-bold">{{ group.item?.name }}</span>
                </UtilLineBar>
                <div class="flex">
                  <div v-for="cs in group._groupedStandings" :key="cs.id" class="flex-1 min-w-24 truncate px-2">
                    <UtilLineBar color="blue-500" background-color="white" text-color="gray-700" variant="subtle">
                      <NuxtLink :to="useSL(`standings/${cs.id}`)" class="text-xs">
                        <span class="text-xs font-medium truncate">{{ cs.item?.name }}</span>
                      </NuxtLink>
                    </UtilLineBar>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white lg:sticky z-[3] right-0 truncate w-48 shrink-0">
            <UtilLineBar color="green-500" background-color="white" text-color="gray-700" variant="subtle" class="w-full">
              <span class="text-xs font-bold">{{ dgGrouping?.columnDisplay?.ungroupedTournamentIds?.label }}</span>
            </UtilLineBar>
            <div class="flex gap-2">
              <UtilLineBar v-for="tDef of dgGroupingColumnsPopulated" color="green-500" background-color="white" text-color="gray-700" variant="subtle" class="w-full">
                <NuxtLink :to="tDef.link ? useSL(`standings/${tDef.standings.id}`) : ''" class="text-xs">
                  <span class="text-xs font-bold">{{ tDef.label ?? tDef.t?.name }}</span>
                </NuxtLink>
              </UtilLineBar>
            </div>
          </div>
        </div>
      </div>

      <TransitionGroup tag="div" name="standing-row">
        <div
          v-for="(row, ri) of sortedRows"
          :key="row._user.id || ri"
          class="h-10 border-b border-gray-100 hover:bg-blue-50"
          :class="[row.isMetaRow ? 'bg-yellow-50 text-yellow-800 font-medium' : isCurrentUserRow(row) ? 'bg-green-50 text-green-900 font-medium' : 'bg-white', rowClass]"
        >
          <div class="flex bg-inherit size-full items-stretch relative gap-8">
            <div class="sticky bg-inherit z-[3] left-0 flex gap-2 truncate w-48 shrink-0 items-center">
              <div class="tabular-nums w-8 shrink-0">{{ row.isMetaRow ? '—' : ri + 1 - sortedRows.slice(0, ri).filter((r: any) => r.isMetaRow).length }}</div>
              <div class="flex-1 truncate">{{ row._user.name }}</div>
            </div>
            <div class="flex-1 flex">
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
            <div class="lg:sticky bg-inherit z-[3] right-0 flex gap-2 truncate w-48 shrink-0 items-center">
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

defineExpose({
  sortedRows,
  localRows,
})
</script>
