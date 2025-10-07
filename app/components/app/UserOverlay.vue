<template>
  <Transition name="fade">
    <div v-if="isUserOverlayOpen" class="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs" @click="isUserOverlayOpen = false"></div>
  </Transition>
  <Transition name="slide-panel">
    <aside v-if="isUserOverlayOpen" class="fixed top-0 right-0 z-50 h-full w-[80vw] lg:max-w-1/2 bg-white" @click.stop>
      <div class="safe-area-padding-top">
        <div class="flex items-center justify-between h-24 bg-gray-400 px-8">
          <h1>{{ userName }}</h1>
        </div>
        <div class="px-8">
          <NetworkButton />
          <ClearButton />
          <UserUiThemeSelector />
          <LogoutButton @clear-user="clearUser" />
          <div class="mt-4 text-xs text-gray-500">App version: {{ appVersion }} (stored: {{ storedVersion }}) {{ updateAvailable }}</div>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import type { User } from '~/../types'

const { appVersion, storedVersion, updateAvailable } = useAppVersion()

const isUserOverlayOpen = useState<boolean>('isUserOverlayOpen')
const userName = useState<User>('user').value?.name

const clearUser = async () => await useClearUser().logOutUser()
</script>
