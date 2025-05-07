<template>
  <Transition name="fade">
    <div v-if="isUserOverlayOpen" class="fixed inset-0 z-40 bg-black/30 backdrop-blur-xsXXX" @click="isUserOverlayOpen = false"></div>
  </Transition>
  <Transition name="slide-panel">
    <aside v-if="isUserOverlayOpen" class="fixed top-0 right-0 z-50 h-full w-[80vw] lg:max-w-1/2 bg-white" @click.stop>
      <div class="safe-area-padding-top">
        <div class="flex items-center justify-between h-12 bg-gray-400">
          <h1 class="stroke-text">{{ userName }}</h1>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import type { User } from '~/types'

const isUserOverlayOpen = useState<boolean>('isUserOverlayOpen')

const userName = useState<User>('user').value?.name
</script>
