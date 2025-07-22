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

    <div class="overflow-x-scroll hide-scroll">
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
              <div v-for="group in dgContributionsGroupedLabels" :key="group.key">
                <div>
                  <UtilLineBar color="green-500" background-color="white" text-color="gray-700" variant="subtle">
                    <span class="text-xs font-bold">{{ group.item?.name }}</span>
                  </UtilLineBar>
                </div>
                <div class="flex gap-4">
                  <div v-for="cs in group._groupedStandings" :key="cs.id" class="w-24 truncate">
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
          class="py-2 border-b border-gray-100"
          :class="[row.isCurve ? 'bg-yellow-50 text-yellow-800 font-medium' : isCurrentUserRow(row) ? 'bg-green-50 text-green-900 font-medium' : 'bg-white', rowClass]"
        >
          <div class="flex relative w-full gap-8">
            <div class="sticky bg-white z-[3] left-0 flex gap-2 truncate w-48 shrink-0">
              <div class="tabular-nums w-8 shrink-0">{{ row.isCurve ? '—' : ri + 1 - sortedRows.slice(0, ri).filter((r: any) => r.isCurve).length }}</div>
              <div class="flex-1 truncate">{{ row._user.name }}</div>
            </div>
            <div class="flex-1 flex gap-4">
              <div v-for="group in dgContributionsGroupedLabels" :key="group.key" class="flex gap-4">
                <div v-for="cs in group._groupedStandings" :key="cs.id" class="w-24 truncate">
                  <UtilLineBar color="blue-500" background-color="white" text-color="gray-700" variant="subtle">
                    <span class="text-xs font-medium truncate">{{ cs?.rows?.find((sr: any) => sr._user?.id === row._user?.id)?.points?.[1] ?? 0 }}</span>
                  </UtilLineBar>
                </div>
              </div>
            </div>

            <div class="lg:sticky bg-white z-[3] right-0 flex gap-2 truncate w-48 shrink-0">
              <UtilLineBar v-for="tDef of dgGroupingColumnsPopulated" color="green-500" background-color="white" text-color="gray-700" variant="subtle" class="w-full">
                <span class="text-xs font-bold">{{ tDef.standings?.rows?.find((sr: any) => sr._user?.id === row._user?.id)?.points?.[tDef.pInd ?? 1] }}</span>
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

console.log(season.value)
console.log(props.standings)
console.log(props.tournament)
console.log(props.childrenStandings)

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
const sortBy = ref({ index: 0 })

/*
wecl(season)
wecl(props.childrenStandings)
wecl(groupedChildren)
*/

watchEffect(() => (localRows.value = props.standings?.rows ? JSON.parse(JSON.stringify(props.standings.rows)) : []))

// Function to sort by specific point index
const sortByPointIndex = (index: number) => {
  sortBy.value.index = index
}

// Sort rows by points descending
const sortedRows = computed<any>(() => {
  if (!localRows.value?.length) return []

  // Define a type that matches your row structure
  type StandingRow = {
    _user: { id: string; name: string }
    points: number[]
    isCurve?: boolean
  }

  // Create pseudo rows for curves
  const curveRows: StandingRow[] = []
  const curves = props.standings?.stats_numbers?.curves

  if (curves?.length >= 3) {
    curveRows.push(
      { _user: { id: 'hi-curve', name: 'HI' }, points: [curves[0]], isCurve: true },
      { _user: { id: 'mi-curve', name: 'MI' }, points: [curves[1]], isCurve: true },
      { _user: { id: 'lo-curve', name: 'LO' }, points: [curves[2]], isCurve: true }
    )
  }

  const combined: StandingRow[] = [...localRows.value, ...curveRows]

  return combined.sort((a: StandingRow, b: StandingRow) => {
    const pointsA = Array.isArray(a.points) ? a.points[sortBy.value.index] ?? 0 : sortBy.value.index === 0 ? a.points : 0
    const pointsB = Array.isArray(b.points) ? b.points[sortBy.value.index] ?? 0 : sortBy.value.index === 0 ? b.points : 0

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

defineExpose({
  sortedRows,
  localRows,
})
</script>
