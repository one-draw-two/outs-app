<template>
  <main class="relative">
    <div class="flex justify-between sticky top-0 z-10 bg-green-200 py-4">
      <div class="flex-1">{{ homeRow?._user.name }} {{ homeRow?.points }}</div>
      <div class="flex-2"></div>
      <div class="flex-1 text-end">{{ awayRow?._user.name }} {{ awayRow?.points }}</div>
    </div>

    <div v-for="(bas, rfi) in betsAddedSnapshots" :key="bas._realFixture?.$index" :id="`rfi-${bas._realFixture?.$index}`" class="flex justify-between items-stretch py-4 hover:bg-gray-100">
      <div class="flex-1">
        <div>{{ bas.$homeBet?.bet }}</div>
      </div>

      <div class="flex-2 lg:flex">
        <RealFixtureItemLink :rf="bas._realFixture" />
      </div>
      <div class="flex-1 text-end">
        <div>{{ bas.$awayBet?.bet }}</div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { User, _P_RealFixture } from '~/types'

definePageMeta({ layout: 'round' })

const fid = useRoute().params.fid
const { processedGroups } = await useGroupsWithUsers({ id: fid }, true)
const thisFixture = computed(() => processedGroups?.value[0])

const homeRow = computed(() => thisFixture?.value?.rows?.[0])
const awayRow = computed(() => thisFixture?.value?.rows?.[1])

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
// wecl(cursor, 'cursor')

const betsAddedSnapshots = computed(() =>
  round.value?.snapshots?.map((s: any) => {
    const cursorSnapshot = cursor.value?.betsAddedSnapshots?.find((bas: any) => bas._snapshot === s.id)
    return {
      ...s,
      $homeBet: cursorSnapshot?._bets?.find((b: any) => b._user === homeRow.value._user.id)?.betFixtureSlot,
      $awayBet: cursorSnapshot?._bets?.find((b: any) => b._user === awayRow.value._user.id)?.betFixtureSlot,
    }
  })
)

wecl(betsAddedSnapshots, 'Bets added snapshots')

const pageTitle = computed(() => `Fixture ${fid}`)
useHead({ title: pageTitle })
</script>
