import type { RouterConfig } from '@nuxt/schema'

export default {
  scrollBehavior(to, from, savedPosition) {
    // console.log('scrollBehavior', { to, from, savedPosition })

    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 30,
      }
    }

    return savedPosition || { top: 0 }
  },
} satisfies RouterConfig
