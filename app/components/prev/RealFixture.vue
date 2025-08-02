<template>
  <div class="w-full py-2 text-white" :class="options?.bg ? `bg-${options.bg}` : ''">
    <UtilLineBar :color="line" text-color="white" alignment="left" variant="subtle" class="h-1 mt-2 mb-1">
      <div v-if="slot" class="absolute text-micro space-x-2 right-0">
        <p>
          <span class="pl-4 font-mono" :class="[bgComputed, `text-${slot.color}`]">{{ slot.name }}</span>
        </p>
      </div>
      <div
        v-if="['live', 'halftime'].includes(realFixture?.resultStatus)"
        class="absolute w-2 h-2 bg-green-500 rounded-full -right-0 top-[0.35rem] ring-2"
        :class="options?.bg ? `ring-${options.bg}` : 'ring-gray-900'"
      />
      <div class="text-micro uppercase top-1.5 flex justify-between space-x-2">
        <p class="space-x-4">
          <span v-if="options?.isDateShown" class="font-mono px-2" :class="bgComputed">{{ $day(realFixture?.startingAt).format('ddd DD/MM') }}</span>
          <span class="font-mono pr-2" :class="[bgComputed, options?.isDateShown ? 'pl-2' : '']">{{ $day(realFixture?.startingAt).format('HH:mm') }}</span>
        </p>
        <p v-if="realFixture?.resultStatus !== 'not-started' && !slot" class="pl-4" :class="[['live', 'halftime'].includes(realFixture?.resultStatus) ? 'text-green-500' : '', bgComputed]">
          {{ hourOrResultStatus }}
        </p>
      </div>
    </UtilLineBar>
    <div class="flex items-center space-x-4 rf-inner flex-wrap" :class="options?.bg ? `bg-${options.bg}` : ''">
      <slot name="left" />
      <div class="flex-1 min-w-[0] flex flex-col mt-4 space-y-2">
        <div class="flex space-x-2">
          <PrevFlag v-if="seasonCountryCode" :country-code="seasonCountryCode!" class="h-4 w-6 shrink-0" />
        </div>
        <div class="h-11 flex flex-col justify-between">
          <div v-for="side of ['home', 'away']" class="text-sm flex items-center space-x-4">
            <p class="truncate flex-1">{{ realFixture?.[`_${side}Team`].name }}</p>
            <p v-if="!options?.isScoreless">{{ realFixture?.result?.split('-')[side === 'home' ? 0 : 1] }}</p>
          </div>
        </div>
      </div>
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _RealFixture } from '~/../types'
const props = defineProps<{
  realFixture?: { [key: string]: any | _RealFixture }
  slot?: any
  line?: string
  options?: {
    isScoreless?: boolean
    isDateShown?: boolean
    isNoTypeFlag?: boolean
    isNoMatchSheet?: boolean
    bg?: string
  }
}>()

const bgComputed = computed(() => (props.options?.bg ? `bg-${props.options.bg}` : 'bg-gray-900'))

const hourOrResultStatus = computed(() => {
  if (props.realFixture?.resultStatus === 'fulltime') return 'FT'
  if (props.realFixture?.resultStatus === 'halftime') return 'HT'
  if (props.realFixture?.resultStatus === 'live') return `${props.realFixture?.liveMinute}'`
  if (props.realFixture?.resultStatus === 'suspended') return `Suspended`
  if (props.realFixture?.resultStatus === 'postponed') return `Postponed`
  if (props.realFixture?.resultStatus === 'cancelled') return 'Cancelled'
  else return ''
})

console.log(props.realFixture?.afFullLocation)

const seasonCountryCode = computed(() => {
  const code = props.realFixture?.afFullLocation?.split('~')[0]?.trim()
  if (code === '39') return 'ENG'
  if (code === '61') return 'FRA'
  if (code === '78') return 'GER'
  if (code === '135') return 'ITA'
  if (code === '140') return 'ESP'
  if (code === '203') return 'TUR'
})
</script>
