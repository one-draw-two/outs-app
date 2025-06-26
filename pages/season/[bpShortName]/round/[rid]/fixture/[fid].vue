<template>
  <main class="relative">
    <div class="flex justify-between sticky top-0 z-10 bg-gray-200 py-4">
      <div class="flex-2"></div>
      <template v-for="side in ['home', 'away']" :key="side">
        <div class="flex-1">
          {{ rows[side]?._user.name }}
          <FixturePointsDisplay :row="rows[side]" />
        </div>
      </template>
    </div>

    <div v-for="(bas, rfi) in betsAddedSnapshots" :key="bas.$realFixture?.$index" :id="`rfi-${bas.$realFixture?.$index}`" class="flex justify-between items-stretch py-4 hover:bg-gray-100">
      <div class="flex-2 lg:flex">
        <RealFixtureItemLink :rf="bas.$realFixture" />
      </div>

      <template v-for="side in ['home', 'away']" :key="side">
        <div class="flex-1">
          <RealFixtureBetAndPointsDisplay :bet="bas[`$${side}Bet`]" :correct-bet="bas.correctBet" :above-bets-based-on-challenge-type="bas.$realFixture.$aboveBetsBasedOnChallengeType" />
        </div>
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { _P_RealFixture } from '~/types'

definePageMeta({ layout: 'round' })

const fid = useRoute().params.fid
const { processedGroups } = await useGroupsWithUsers({ id: fid }, true)

const thisFixture = computed(() => processedGroups?.value[0])
const rows = computed<any>(() => ({ home: thisFixture?.value?.rows?.[0], away: thisFixture?.value?.rows?.[1] }))

const { round } = inject(roundKey)!

/*
const user = useState<User>('user')
const enhancedFixtures = computed(() => enhanceFixturesWithUserData(processedGroups.value, user.value?.id))
wecl(enhancedFixtures)
*/

// wecl(processedGroups)

// Check if cursor already exists in round data
const existingCursor = computed(() => round.value?.userCursors?.[fid as string])
const cursor = ref<any>(null)

// Only fetch cursor if it doesn't already exist in round data
if (!existingCursor.value) {
  useDynamicPS().updatePowerSyncParams({ selected_fixture: fid })
  const { data: fetchedCursor } = await usePopulatedGroupCursor(fid as string)
  cursor.value = fetchedCursor
} else {
  cursor.value = existingCursor
}

// useDynamicPS().updatePowerSyncParams({ selected_fixture: fid })
// const { data: cursor }: { data: any } = await usePopulatedGroupCursor(fid as string)

const betsAddedSnapshots = computed(() =>
  round.value?.snapshots?.map((s: any) => {
    // Use either the freshly fetched cursor or the one from round data
    const cursorData = cursor.value.value || existingCursor.value
    const cursorSnapshot = cursorData?.betsAddedSnapshots?.find((bas: any) => bas._snapshot === s.id)
    return {
      ...s,
      $homeBet: cursorSnapshot?._bets?.find((b: any) => b._user === rows.value.home?._user.id),
      $awayBet: cursorSnapshot?._bets?.find((b: any) => b._user === rows.value.away?._user.id),
    }
  })
)

wecl(betsAddedSnapshots, 'Bets added snapshots')

const pageTitle = computed(() => `Fixture ${fid}`)
useHead({ title: pageTitle })
</script>
