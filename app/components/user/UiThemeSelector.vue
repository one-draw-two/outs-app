<template>
  <div class="flex w-32 my-8 rounded-full p-2 border border-gray-200 dark:border-gray-700">
    <button
      v-for="theme in themes"
      @click="setTheme(theme)"
      :class="['flex-1 font-mono uppercase text-xs', currentTheme === theme ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400']"
    >
      {{ theme.slice(0, 2) }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/../types'

type Theme = 'system' | 'light' | 'dark'

const themes: Theme[] = ['system', 'light', 'dark']
const user = useState<User>('user')
const currentTheme = computed(() => user.value?.settings?.ui?.theme || 'system')

const setTheme = async (theme: Theme) => {
  // Update UI immediately
  useUiTheme().setTheme(theme)

  // Update local state
  if (user.value && user.value.settings) user.value = { ...user.value, settings: { ...user.value.settings, ui: { ...user.value.settings.ui, theme } } }

  // Update local user state and stored auth in one go
  useAuthStorage().updateStoredAuth((stored) => stored.user?.settings && (stored.user.settings.ui = { ...stored.user.settings.ui, theme }))

  // Send to server
  await useSecureFetch('submit-settings', 'settings', 'post', { ui: { theme } })
}
</script>
