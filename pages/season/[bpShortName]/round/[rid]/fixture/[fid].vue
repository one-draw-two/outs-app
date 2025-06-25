<template>
  <main class="relative">
    <div class="flex justify-between sticky top-0 z-10 bg-gray-200 py-4">
      <div class="flex-2"></div>
      <template v-for="side in ['home', 'away']" :key="side">
        <div class="flex-1">{{ rows[side]?._user.name }} {{ rows[side]?.points }}</div>
      </template>
    </div>

    <div v-for="(bas, rfi) in betsAddedSnapshots" :key="bas._realFixture?.$index" :id="`rfi-${bas._realFixture?.$index}`" class="flex justify-between items-stretch py-4 hover:bg-gray-100">
      <div class="flex-2 lg:flex">
        <RealFixtureItemLink :rf="bas._realFixture" />
      </div>

      <template v-for="side in ['home', 'away']" :key="side">
        <div class="flex-1 flex gap-2 items-center">
          <PrevTripleCrop v-if="bas[`$${side}Bet`]?.slotIndex <= bas._realFixture.$aboveBetsBasedOnChallengeType" :clip="'octagon'">
            <div class="size-5 flex-center text-sm font-bold" :class="getSlotIndexColor(bas[`$${side}Bet`]?.slotIndex)">{{ bas[`$${side}Bet`]?.bet }}</div>
          </PrevTripleCrop>
          <div class="px-2 bg-gray-200 rounded-md" :class="bas[`$${side}Bet`]?.bet === bas.correctBet ? '' : 'line-through'">{{ bas[`$${side}Bet`]?.potentialPoints?.join(' / ') }}</div>
        </div>
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { User, _P_RealFixture } from '~/types'

definePageMeta({ layout: 'round' })

const fid = useRoute().params.fid
const { processedGroups } = await useGroupsWithUsers({ id: fid }, true)

const thisFixture = computed(() => processedGroups?.value[0])
const rows = computed<any>(() => ({ home: thisFixture?.value?.rows?.[0], away: thisFixture?.value?.rows?.[1] }))

const { round } = inject(roundKey)!
// const snaphots = computed(() => round.value?.snapshots)
// const realFixtures = computed(() => round.value?.snapshots?.map((s: any) => s._realFixture).filter(Boolean))

/*
const user = useState<User>('user')
const enhancedFixtures = computed(() => enhanceFixturesWithUserData(processedGroups.value, user.value?.id))
wecl(enhancedFixtures)
*/

// wecl(processedGroups)

useDynamicPS().updatePowerSyncParams({ selected_fixture: fid })
const { data: cursor }: { data: any } = await usePopulatedGroupCursor(fid as string)

const betsAddedSnapshots = computed(() =>
  round.value?.snapshots?.map((s: any) => {
    const cursorSnapshot = cursor.value?.betsAddedSnapshots?.find((bas: any) => bas._snapshot === s.id)
    return {
      ...s,
      $homeBet: cursorSnapshot?._bets?.find((b: any) => b._user === rows.value.home?._user.id)?.betFixtureSlot,
      $awayBet: cursorSnapshot?._bets?.find((b: any) => b._user === rows.value.away?._user.id)?.betFixtureSlot,
    }
  })
)

wecl(betsAddedSnapshots, 'Bets added snapshots')

/*
const seasonCountryCode = computed(() => {
  if (props.realFixture?.afSeasonId === '39') return 'ENG'
  if (props.realFixture?.afSeasonId === '61') return 'FRA'
  if (props.realFixture?.afSeasonId === '78') return 'GER'
  if (props.realFixture?.afSeasonId === '135') return 'ITA'
  if (props.realFixture?.afSeasonId === '140') return 'ESP'
  if (props.realFixture?.afSeasonId === '203') return 'TUR'
})
*/

const getSlotIndexColor = (si: number) => {
  if (si === 0) return 'bg-blue-200'
  if (si === 1) return 'bg-green-200'
  if (si === 2) return 'bg-yellow-200'
  if (si === 3) return 'bg-orange-200'
  return 'opacity-50'
}

const pageTitle = computed(() => `Fixture ${fid}`)
useHead({ title: pageTitle })
</script>
