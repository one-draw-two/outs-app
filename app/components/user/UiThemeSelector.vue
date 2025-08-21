<template>
  <div class="flex w-32 my-8 rounded-full p-2 border border-gray-200">
    <button v-for="theme in themes" @click="setTheme(theme)" class="flex-1 font-mono uppercase text-xs">{{ theme.slice(0, 2) }}</button>
  </div>
</template>

<script setup lang="ts">
const themes = ['system', 'light', 'dark']
const setTheme = async (theme: string) => {
  console.log('THEME:', theme)

  const res = await useSecureFetch('submit-settings', 'settings', 'post', { ui: { theme } })
  console.log(res)
}
</script>
