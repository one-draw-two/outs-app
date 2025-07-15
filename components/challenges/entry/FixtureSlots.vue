<template>
  <div class="relative pb-[--safe-padded-bottom-16]">
    <!-- Choosing for slot X bubble -->
    <div v-if="isGamesVisible" class="md:hidden sticky top-0 pt-16 pb-8 z-1">
      <div class="vertical-come-in bg-gray-900 rounded-3xl px-8 py-4 border-2 border-gray-700 flex items-center justify-between -mx-8" @click="isGamesVisible = false">
        <p class="text-xs">
          Choosing a game for <span :class="`text-${slots[slotIndexToBeChosen]?.color}`">{{ slots[slotIndexToBeChosen]?.name }}</span> slot
        </p>
        <div class="h-5 w-5 bg-black flex-center rounded-full ring-2 ring-white">
          <img :src="`/icons/cross.svg`" class="w-2" />
        </div>
      </div>
    </div>
    <!-- Bets & Matches & Footer -->
    <div class="flex max-md:flex-col gap-8 -mx-8 flex-wrap">
      <div :class="isGamesVisible ? 'max-md:hidden' : ''" class="flex-1 shrink-0 truncate">
        <h2 class="px-8 pb-8">Bets</h2>
        <div class="vertical-come-in bg-gray-900 rounded-border-section relative">
          <div v-for="(_, rfi) of calendar" @click="clickOnFSB(rfi)" :class="[rfi >= calendar.length / 2 ? 'italic' : '']" class="cursor-pointer clear-highlight px-8">
            <div v-if="!slots[rfi]?.rf" class="w-full py-2 rounded-md" @click.stop="clickOnEmptySlot(rfi)">
              <UtilLineBar color="white" background-color="transparent" text-color="white" alignment="left" variant="subtle" class="h-1 mb-1 mt-2">
                <div class="text-micro top-1.5 flex justify-between space-x-2">
                  <p class="bg-gray-900 px-1 font-mono" :class="`text-${slots[rfi]?.color}`">{{ slots[rfi]?.name }}</p>
                </div>
              </UtilLineBar>
              <div class="flex items-center space-x-4 rf-inner flex-wrap min-h-[5.5rem]" :class="slotIndexToBeChosen === rfi ? 'bg-yellow-200/20' : ''">
                <p class="text-xs cursor pointer h-full flex items-center w-full truncate">
                  {{ slotIndexToBeChosen === rfi ? 'Now choose a game from the match list' : movingSlot ? `Click in order to move game here` : `Click to select a game` }}
                </p>
              </div>
            </div>

            <PrevRealFixture :key="slots[rfi].rf!.id" v-else :comp-name="'OldStyle'" :real-fixture="slots[rfi].rf!" :options="rfOptions">
              <template #right>
                <div class="h-6 flex item-center space-x-6 shrink-0 min-w-0">
                  <div
                    v-for="option of options"
                    @click.stop="selectOption($event, slots[rfi].rf!.id as string, option)"
                    class="w-6 h-6 rounded-full flex-center ring-2 text-xs font-bold italic text-black relative cursor-pointer clear-highlight"
                    :class="slots[rfi]?.bet === option ? `bg-${slots[rfi].color} ring-white` : 'bg-white/50 ring-white'"
                  >
                    {{ option }}
                  </div>
                </div>
              </template>
            </PrevRealFixture>
            <div v-if="rfi === calendar.length / 2 - 1" class="h-4 bg-gray-500/25">
              <UtilLineBar color="white" background-color="transparent" text-color="white" alignment="center" variant="subtle" class="h-4" />
            </div>
          </div>

          <div class="absolute w-full h-full vertical-split-background opacity-10 top-0 left-0 rounded-3xl -z-1 flex-center"></div>
        </div>
      </div>
      <div
        class="flex-1 shrink-0 flex flex-col"
        :class="[isGamesVisible ? 'mobile-vertical-come-in' : '', calendar.filter((rf) => slots.map((s) => s.rf?.id).findIndex((rfid) => rf.id === rfid) < 0).length <= 0 ? 'max-md:hidden' : '']"
      >
        <h2 class="px-8 pb-8">Matches</h2>
        <div class="rounded-border-section bg-green-500">
          <div
            v-for="(rf, rfi) of calendar.filter((rf) => slots.map((s) => s.rf?.id).findIndex((rfid) => rf.id === rfid) < 0)"
            :key="rf.id"
            @click="clickOnRF(calendar.find((c) => c.id === rf.id)!)"
            class="cursor-pointer clear-highlight px-8"
          >
            <PrevRealFixture :key="calendar.find((c) => c.id === rf.id)!.id" :comp-name="'OldStyle'" :real-fixture="calendar.find((c) => c.id === rf.id)!" :options="rfOptions" />
          </div>
          <div class="max-md:hidden h-4 bg-gray-500/25">
            <UtilLineBar color="white" background-color="transparent" text-color="white" alignment="center" variant="subtle" class="h-4" />
          </div>
          <div v-for="(rf, rfi) of calendar.filter((rf) => slots.map((s) => s.rf?.id).findIndex((rfid) => rf.id === rfid) >= 0)" :key="rf.id" class="max-md:hidden opacity-10 px-8">
            <PrevRealFixture :key="calendar.find((c) => c.id === rf.id)!.id" :comp-name="'OldStyle'" :real-fixture="calendar.find((c) => c.id === rf.id)!" :options="rfOptions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _P_Challenge, _P_RealFixture, _P_Bet } from '~/types'

const props = defineProps<{
  challenge: _P_Challenge
  bet?: _P_Bet | null
  isSubmitable: boolean
}>()
const emit = defineEmits(['submit'])

const bottomlinks = ref(['Lock', 'Help', 'Clear'])

const slots: Ref<
  {
    rf: null | _P_RealFixture
    bet: string
    name: string
    color: string
    coef: number
  }[]
> = ref(
  props.challenge.type === '1x2'
    ? [
        { rf: null, bet: '', name: 'x4 Pts.', color: 'blue-400', coef: 4 },
        { rf: null, bet: '', name: 'x3 Pts.', color: 'amber-400', coef: 3 },
        { rf: null, bet: '', name: 'x2 Pts.', color: 'teal-400', coef: 2 },
        { rf: null, bet: '', name: 'x1 Pts.', color: 'orange-400', coef: 1 },
        { rf: null, bet: '', name: 'Subs. 1', color: 'gray-100', coef: -1 },
        { rf: null, bet: '', name: 'Subs. 2', color: 'gray-100', coef: -2 },
        { rf: null, bet: '', name: 'Subs. 3', color: 'gray-100', coef: -3 },
        { rf: null, bet: '', name: 'Subs. 4', color: 'gray-100', coef: -4 },
      ]
    : props.challenge.type === 'Goals'
    ? [
        { rf: null, bet: '', name: 'x3 Pts.', color: 'amber-400', coef: 3 },
        { rf: null, bet: '', name: 'x2 Pts.', color: 'teal-400', coef: 2 },
        { rf: null, bet: '', name: 'Subs. 1', color: 'gray-100', coef: -1 },
        { rf: null, bet: '', name: 'Subs. 2', color: 'gray-100', coef: -2 },
      ]
    : [
        { rf: null, bet: '', name: 'x2.5 Pts.', color: 'orange-400', coef: 1 },
        { rf: null, bet: '', name: 'Subs. 1', color: 'gray-100', coef: -1 },
      ]
)

const calendar = computed(() => props.challenge.fixtureSlots.map((fs) => fs._realFixture))

onBeforeMount(() => {
  props.bet?.betFixtureSlots?.map((bfs) => {
    slots.value[bfs.slotIndex].rf = calendar.value.find((rf) => rf.id === bfs._realFixture)!
    slots.value[bfs.slotIndex].bet = bfs.bet!
  })
})

const selectedRF = ref()
const movingSlot = ref()

const isGamesVisible = ref(false)
const slotIndexToBeChosen = ref(-1)

const rfOptions = ref({ isDateShown: true, isScoreless: true })

const options = ref(props.challenge.type === '1x2' || props.challenge.type === 'Bonus' ? ['1', 'X', '2'] : ['+', '-'])

const clickOnEmptySlot = (slotIndex: number) => {
  if (props.isSubmitable) {
    if (!movingSlot.value) {
      isGamesVisible.value = !isGamesVisible.value
      slotIndexToBeChosen.value = slotIndex
    } else {
      clickOnFSB(slotIndex)
    }
  }
}

const clickOnRF = (rObj: _P_RealFixture) => {
  if (props.isSubmitable) {
    if (slotIndexToBeChosen.value >= 0) {
      slots.value[slotIndexToBeChosen.value].rf = rObj
      slotIndexToBeChosen.value = -1
      isGamesVisible.value = false
      submitToServer()
    }
  }
}

const clickOnFSB = (slotIndex: number) => {
  if (props.isSubmitable) {
    if (!selectedRF.value) {
      if (movingSlot.value) {
        if (movingSlot.value.rf?.id === slots.value[slotIndex].rf?.id) {
          movingSlot.value = null
        } else {
          const movingSlotSlotIndex = slots.value.findIndex((s) => s.rf?.id === movingSlot.value.rf?.id)
          const tempSlotHolder = Object.assign({}, slots.value[slotIndex])

          slots.value[slotIndex].rf = movingSlot.value.rf
          slots.value[slotIndex].bet = movingSlot.value.bet
          slots.value[movingSlotSlotIndex].rf = tempSlotHolder.rf
          slots.value[movingSlotSlotIndex].bet = tempSlotHolder.bet

          movingSlot.value = null

          submitToServer()
        }
      } else {
        if (slots.value[slotIndex]) {
          movingSlot.value = slots.value[slotIndex]
        }
      }
    }
  }
}

const selectOption = async (e: MouseEvent, rfId: string, option: string) => {
  e.preventDefault()
  if (props.isSubmitable) {
    slots.value.find((s) => s.rf?.id === rfId)!.bet = option
    submitToServer()
  }
}

const clearSlots = () => {
  if (props.isSubmitable) {
    slots.value.map((s) => {
      s.rf = null
      s.bet = ''
    })
    submitToServer()
  }
}

const submitToServer = () => {
  emit('submit', {
    cid: props.challenge.id,
    rid: props.challenge._round,
    betFixtureSlots: slots.value.map((slot: any, si) => {
      return {
        rfId: slot.rf?.id ?? '',
        option: slot.bet ?? '',
        slotIndex: si,
      }
    }),
  })
}

/*
console.log('Hello from FixtureSlots')
console.log(props.challenge)
console.log(props.bet)
console.log(slots.value)
*/

defineExpose({
  clearSlots,
  isGamesVisible,
})
</script>
