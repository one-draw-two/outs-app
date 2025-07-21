<template>
  <LayoRound>
    <main>
      <div v-for="slot in filteredFixtureSlotsPerChallenge" :key="slot.id">
        <ChallengesUiBase :challenge="snapshotRF!.$challenge" :rfid="slot._realFixture" :fixtureSlot="slot" />
      </div>
    </main>
  </LayoRound>
</template>

<script setup lang="ts">
import type { _P_RealFixture, _P_Round } from '~/../types'

const route = useRoute()
definePageMeta({ middleware: 'round' })
const round = useState<_P_Round>('round')
useHead({ title: `Snapshot ${route.params.snapid}` })

const snapshotRF = computed(() => round.value?.snapshots?.find((snapshot) => snapshot.id === route.params.snapid)?.$realFixture)
const snapshotChallengeFixtureSlots = computed(() => snapshotRF.value?.$challenge?.fixtureSlots)

const filteredFixtureSlotsPerChallenge = computed(() =>
  snapshotRF.value?.$challenge?.type !== 'RoundGoalCount' ? snapshotChallengeFixtureSlots.value?.filter((slot: any) => slot._realFixture === snapshotRF.value?.id) : snapshotChallengeFixtureSlots.value
)

/*
wecl(round)
wecl(snapshotRF)
wecl(snapshotChallengeFixtureSlots)
wecl(filteredFixtureSlotsPerChallenge)
*/
</script>
