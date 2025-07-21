<template>
  <div class="">
    {{ challenge.type }}
    {{ rf.name }}
  </div>
</template>

<script setup lang="ts">
import type { _P_Challenge, _P_RealFixture, _P_Bet } from '~/../types'

const props = defineProps<{
  challenge: _P_Challenge
  rf: _P_RealFixture
}>()
</script>
