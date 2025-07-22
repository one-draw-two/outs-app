<template>
  <div class="relative">
    <div class="h-12 flex items-center justify-between">
      <div class="flex gap-4">
        <NuxtLink :to="useSL(`standings/${standings?.id}`)" class="block">{{ standingsName }}</NuxtLink>
        <NuxtLink v-if="standings?._parentGroup" :to="useSL(`standings/${standings?._parentGroup}`)" class="block"> Parent </NuxtLink>
        <NuxtLink v-if="childrenFixtures?.length > 0" :to="useSL(`standings/${standings?.id}/fixtures`)" class="block"> Fixtures </NuxtLink>
      </div>

      <div class="flex gap-4 items-center">
        <FormsToggleSwitch @change="toggleGrouping" />
        <button @click="shufflePoints" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">Shuffle Points</button>
      </div>
    </div>

    <StandingsTopHeader :children-standings="childrenStandings" class="bg-white sticky top-0 z-[5] py-4" />

    <div class="overflow-x-scroll hide-scroll">
      <div class="py-8 max-lg:hidden border-y border-gray-100">
        <div class="flex w-full gap-8">
          <div class="bg-white sticky z-[3] left-0 w-48 shrink-0"></div>
          <div class="flex-1">
            <div class="flex min-w-max gap-4">
              <div v-for="group in groupedChildren" :key="group.key">
                <div>
                  <UtilLineBar color="green-500" background-color="white" text-color="gray-700" variant="subtle">
                    <span class="text-xs font-bold">{{ group.label }}</span>
                  </UtilLineBar>
                </div>
                <div class="flex gap-4">
                  <div v-for="cs in group.items" :key="cs.id" class="w-24 truncate">
                    <UtilLineBar color="blue-500" background-color="white" text-color="gray-700" variant="subtle">
                      <NuxtLink :to="useSL(`standings/${cs.id}`)" class="text-xs">
                        <span class="text-xs font-medium truncate">{{ cs.label }}</span>
                      </NuxtLink>
                    </UtilLineBar>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white lg:sticky z-[3] right-0 truncate w-48 shrink-0">
            <UtilLineBar color="green-500" background-color="white" text-color="gray-700" variant="subtle" class="w-full">
              <span class="text-xs font-bold">&nbsp;</span>
            </UtilLineBar>
            <UtilLineBar color="green-500" background-color="white" text-color="gray-700" variant="subtle" class="w-full">
              <span class="text-xs font-bold">Points</span>
            </UtilLineBar>
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
              <div class="tabular-nums w-8 shrink-0">
                {{ row.isCurve ? '—' : ri + 1 - sortedRows.slice(0, ri).filter((r: any) => r.isCurve).length }}
              </div>
              <div class="flex-1 truncate">{{ row._user.name }}</div>
            </div>
            <div class="flex-1 flex gap-4">
              <div v-for="(cs, csi) of childrenStandings" :key="cs.id" class="w-24 z-0 relative shrink-0">
                <UtilLineBar color="blue-500" background-color="white" text-color="gray-700" variant="subtle">
                  {{ (cs.rows as any)?.find((r: any) => r._user?.id === row._user?.id)?.points?.[1] ?? '-' }}
                </UtilLineBar>
              </div>
            </div>

            <div class="lg:sticky bg-white z-[3] right-0 flex gap-2 truncate w-48 shrink-0">
              <div
                v-for="(pointItem, displayIndex) in filteredScopedTournamnetPointsDef"
                :key="pointItem.originalIndex"
                class="tabular-nums text-right w-32 px-2"
                :class="['cursor-pointer', { 'text-gray-500': sortBy?.index === pointItem.originalIndex }]"
              >
                <span>{{ row?.points?.[pointItem.originalIndex] }}</span>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _Season, _Standing, ParsedBPTournament } from '~/../types'

const season = useState<_Season>('season')

interface Props {
  standings: any
  childrenStandings: _Standing[]
  childrenFixtures: any[]
  tournament?: ParsedBPTournament
  rowClass?: string
}

const { isCurrentUserRow } = useUserHelpers()

const props = withDefaults(defineProps<Props>(), { rowClass: '' })

const groupingKey = ref('_tournament')
const toggleGrouping = (val: boolean) => (groupingKey.value = val ? '_link._refId' : '_tournament')

const groupedChildren = computed(() => {
  const key = groupingKey.value
  const tournamentsArr = season.value?.tournaments || []
  const stagesArr = season.value?.stages || []
  const groups: Record<string, { key: string; label: string; items: Array<_Standing & { label: string }> }> = {}

  for (const cs of props.childrenStandings) {
    let groupVal = key === '_link._refId' ? (cs._link as any)?._refId : cs._tournament
    let groupLabel = groupVal
    let childLabel = cs.name

    if (key === '_tournament') groupLabel = tournamentsArr.find((t: any) => t.id === groupVal)?.name || groupVal
    if (key === '_link._refId') groupLabel = stagesArr.find((stage: any) => stage.id === groupVal)?.name || groupVal

    if (key === '_link._refId') childLabel = tournamentsArr.find((t: any) => t.id === cs._tournament)?.name || cs._tournament
    else if (key === '_tournament') childLabel = stagesArr.find((stage: any) => stage.id === (cs._link as any)?._refId)?.name || cs.name

    if (!groups[groupVal]) groups[groupVal] = { key: groupVal, label: groupLabel, items: [] }
    groups[groupVal].items.push({ ...cs, label: childLabel! })
  }
  return Object.values(groups)
})
const scopedTournamnetPointsDef = computed(() => props.tournament?.pointsDef?.[props.standings._link._refColl?.toLowerCase() as keyof ParsedBPTournament['pointsDef']] || [])
const filteredScopedTournamnetPointsDef = computed(() => scopedTournamnetPointsDef.value.map((pointDef, originalIndex) => ({ pointDef, originalIndex })).filter(({ pointDef }) => pointDef.isDisplayed))

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
