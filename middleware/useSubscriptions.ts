export default defineNuxtRouteMiddleware(async (to) => {
  // Skip for non-authenticated routes if needed
  // if (to.path.startsWith('/access/')) return

  console.log('MAMAMAMA')

  const nuxtApp = useNuxtApp()

  // Get subscription data
  const { data: seasons } = usePSWatch<any>('SELECT * FROM "calendar_seasons" ORDER BY name ASC', [], { abortController: new AbortController() })

  const { data: subscriptions } = usePSWatch<any>('SELECT * FROM "account_subscriptions"', [], { abortController: new AbortController() })

  const activeUserSubscriptionSeasons = computed(() => subscriptions.value.filter((sub: any) => sub.status === 'active').map((sub: any) => sub._season))

  // Store in global state
  const globalSubscriptions = useState('subscriptions', () => ({
    seasons,
    subscriptions,
    activeUserSubscriptionSeasons,
  }))

  // Make available via provide/inject
  nuxtApp.vueApp.provide(subscriptionsKey, globalSubscriptions.value as any)

  // Auto-navigate to most recent active season if at /season route
  if (to.path === '/season' && activeUserSubscriptionSeasons.value.length > 0) {
    const mostRecentSeason = activeUserSubscriptionSeasons.value[0]

    console.log('Most recent active season:', mostRecentSeason)

    return navigateTo(`/season/${mostRecentSeason}`, { replace: true })
  }
})
