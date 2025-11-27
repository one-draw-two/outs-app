import { $day } from '~/composables/useDateHelpers'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.globalProperties.$day = $day
})
