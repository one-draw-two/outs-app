<template>
  <div class="flag p-[2px] bg-white">
    <img v-if="countryCode" :src="`/flags/${countryCode}.png`" class="flag w-full h-full object-cover" />
    <img v-else-if="challengeCode" :src="challengePath" class="flag w-full h-full object-cover" />
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  countryCode?: string
  challengeCode?: string
  isNoOutline?: boolean
}>()

const challengePath = computed(() => {
  if (props.challengeCode === '1x2') return '/png/1x2.png'
  if (props.challengeCode === 'Goals') return '/png/2x5.png'
  if (props.challengeCode === 'Bonus') return '/png/bonus.png'
  if (props.challengeCode === 'RoundGoalCount') return '/png/goals.png'
})
</script>

<style lang="postcss" scoped>
.flag {
  @apply box-content;
  clip-path: url(#flag);
}
</style>
