import { HugeiconsIcon } from '@hugeicons/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Hi', HugeiconsIcon)
})
