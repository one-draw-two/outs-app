<template>
  <div class="bg-blue-200 flex items-stretch gap-4">
    <div v-for="(col, index) in tournamentCols" :key="index" class="flex-1 flex items-center">
      <template v-if="col.name === 'You'">
        <RealFixtureBetAndPointsDisplay
          :bet="getUserBetFromCursor(props.rf.$index)!"
          :correct-bet="props.rf?.$correctBet"
          :above-bets-based-on-challenge-type="props.rf?.$aboveBetsBasedOnChallengeType"
        />
      </template>

      <template v-else-if="col.name === 'Curves'">
        <div class="flex gap-2 flex-wrap">
          <div v-for="stat in curvesStatsContribs.stats" class="flex flex-col items-center gap-2" :key="stat.option">
            <PrevTripleCrop :clip="'octagon'" :is-no-fit="true">
              <div class="size-5 flex-center text-sm font-bold bg-purple-200">{{ stat.option }}</div>
            </PrevTripleCrop>
            <div class="px-2 rounded-md bg-gray-200" :class="[stat.option === props.rf?.$correctBet ? '' : 'line-through']">
              {{ stat.average?.toFixed(2) || '0.00' }}
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="col.fixture">
        <RealFixtureBetAndPointsDisplay
          v-if="getOpponentRow(col.fixture)?._user"
          :bet="getOpponentBetFromCursor(col.fixture, props.rf.$index)!"
          :correct-bet="props.rf?.$correctBet"
          :above-bets-based-on-challenge-type="props.rf?.$aboveBetsBasedOnChallengeType"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _RealFixture, _Bet, EnhancedRound, _P_Group } from '~/types'

const props = defineProps<{
  rf: _RealFixture
}>()

const { round, tournamentCols } = inject(roundKey)! as { round: Ref<EnhancedRound>; tournamentCols: any }
const { getUserRow, getOpponentRow } = useUserHelpers()

const getUserBetFromCursor = (realFixtureIndex: number): _Bet | null => {
  const userFixture = round.value?.userFixtures?.find((fixture) => getUserRow(fixture))
  if (!userFixture) return null
  return getBetFromCursor(userFixture, realFixtureIndex, getUserRow(userFixture)?._user?.id)
}

const getOpponentBetFromCursor = (fixture: _P_Group, realFixtureIndex: number): _Bet | null => {
  const opponentRow = getOpponentRow(fixture)
  if (!opponentRow) return null
  const opponentUserId = typeof opponentRow._user === 'object' ? opponentRow._user.id : opponentRow._user
  return getBetFromCursor(fixture, realFixtureIndex, opponentUserId)
}

const getBetFromCursor = (fixture: _P_Group, realFixtureIndex: number, userId?: string): _Bet | null => {
  if (!userId) return null
  const cursor = round.value?.userCursors?.[fixture.id]
  const snapshot = round.value?.snapshots?.find((s) => s.$realFixture?.$index === realFixtureIndex)
  const cursorSnapshot = cursor?.betsAddedSnapshots?.find((bas) => bas._snapshot === snapshot?.id)
  return cursorSnapshot?._bets?.find((b) => b._user === userId) || null
}

const curvesStatsContribs = computed(() => {
  const curvesStanding = round.value?.userStandings?.find((standing) => standing._tournament === 'BTCURV')
  if (!curvesStanding) return { userContrib: null, stats: [] }

  const cursor = round.value?.userCursors?.[curvesStanding.id]
  const snapshot = round.value?.snapshots?.find((s) => s.$realFixture?.$index === props.rf.$index)
  const cursorSnapshot = cursor?.betsAddedSnapshots?.find((bas) => bas._snapshot === snapshot?.id)

  if (!cursorSnapshot) return { userContrib: null, stats: [] }

  const userRow = getUserRow(curvesStanding)
  const userId = userRow?._user?.id

  // Updated to use cursorBetValue instead of contrib
  const userContrib = cursorSnapshot._bets?.find((b) => b._user === userId)?.cursorBetValue || null
  const stats = cursorSnapshot._bets?.find((b) => b._user === 'stats')?.cursorBetValue || []

  return {
    userContrib: userContrib?.[0], // First contribution entry for the user
    stats,
  }
})
</script>
