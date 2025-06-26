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
</script>
