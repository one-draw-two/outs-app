<template>
  <div class="bg-blue-200 flex items-stretch gap-4">
    <div v-for="(col, index) in tournamentCols" :key="index" class="flex-1 flex items-center">
      <template v-if="col.name === 'You'">
        <RealFixtureBetAndPointsDisplay
          :bet="getUserBetFromCursor(props.rf.$index)"
          :correct-bet="props.rf?.$correctBet"
          :above-bets-based-on-challenge-type="props.rf?.$aboveBetsBasedOnChallengeType"
        />
      </template>

      <template v-else-if="col.fixtureDetails">
        <RealFixtureBetAndPointsDisplay
          v-if="col.fixtureDetails.oppoRow?._user"
          :bet="getOppoBetForFixture(col.fixtureDetails, props.rf.$index)"
          :correct-bet="props.rf?.$correctBet"
          :above-bets-based-on-challenge-type="props.rf?.$aboveBetsBasedOnChallengeType"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User, _RealFixture } from '~/types'

const props = defineProps<{
  rf: _RealFixture
}>()

const { round, tournamentCols } = inject(roundKey)!
const user = useState<User>('user')

// Helper function to get user bet from cursor data
function getUserBetFromCursor(realFixtureIndex: number) {
  // Find the user's fixture (where user is a participant)
  const userFixture = round.value?.userFixtures?.find((fixture) => fixture.userRow?._user?.id === user.value?.id)

  if (!userFixture) return null

  // Get cursor for this fixture
  const cursor = round.value?.userCursors?.[userFixture.id]
  if (!cursor) return null

  // Find snapshot for this real fixture
  const snapshot = round.value?.snapshots?.find((s) => s._realFixture?.$index === realFixtureIndex)
  if (!snapshot) return null

  // Find corresponding cursor snapshot
  const cursorSnapshot = cursor.betsAddedSnapshots?.find((bas) => bas._snapshot === snapshot.id)
  if (!cursorSnapshot) return null

  // Find user's bet in this snapshot
  return cursorSnapshot._bets?.find((b) => b._user === user.value?.id)?.betFixtureSlot
}

const getOppoBetForFixture = (fixtureDetails, realFixtureIndex: number) =>
  fixtureDetails.betsAddedSnapshots?.find((s) => s._realFixture?.$index === realFixtureIndex)?.$bets?.find((bet) => bet._user === fixtureDetails.oppoRow?._user?.id)?.betFixtureSlot || null
</script>
