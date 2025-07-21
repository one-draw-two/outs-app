<template>
  <button class="absolute z-60 right-8 size-12 rounded-full bg-white borderXborder-black/50 flex-center stroke-text cursor-pointer" @click="isUserOverlayOpen = !isUserOverlayOpen">
    <Transition name="flip" mode="out-in">
      <span v-if="!isUserOverlayOpen" key="initials" class="text-lg !not-italic">{{ userInitials }}</span>
      <span v-else key="close" class="text-lg !not-italic">X</span>
    </Transition>
  </button>
</template>

<script setup lang="ts">
import type { User } from '~/../types'

const isUserOverlayOpen = useState<boolean>('isUserOverlayOpen')

const userInitials = computed(
  () =>
    useState<User>('user')
      .value?.name?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase() || ''
)
</script>
