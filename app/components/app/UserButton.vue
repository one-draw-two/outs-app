<template>
  <button
    class="absolute z-60 right-[var(--twContPadding)] size-8 rounded-full borderXborder-black/50 flex-center font-black font-posterama cursor-pointer"
    :class="connectionColorClass"
    @click="isUserOverlayOpen = !isUserOverlayOpen"
  >
    <Transition name="flip" mode="out-in">
      <Hi v-if="!isUserOverlayOpen" :icon="User03Icon" :size="16" color="#000000" />
      <span v-else key="close" class="text-lg !not-italic">X</span>
    </Transition>
  </button>
</template>

<script setup lang="ts">
//       <span v-if="!isUserOverlayOpen" key="initials" class="text-lg !not-italic">{{ userInitials }}</span>

import { User03Icon } from '@hugeicons/core-free-icons'

import type { User } from '~/../types'

const isUserOverlayOpen = useState<boolean>('isUserOverlayOpen')
const connectionColorClass = useState<string>('network:connectionColorClass')

const userInitials = computed(
  () =>
    useState<User>('user')
      .value?.name?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase() || ''
)
</script>
