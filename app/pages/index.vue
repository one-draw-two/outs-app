<template></template>

<script setup lang="ts">
definePageMeta({
  middleware: [
    async function (to) {
      const DEBUG = true
      const TIMEOUT = 4000

      if (DEBUG) console.log('Index page: Checking subscriptions...')
      if (DEBUG) console.log(useState<Boolean>('subscriptionsLoaded').value)

      // Added later
      // useDynamicPS().updatePowerSyncParams({})

      if (to.meta.isPublic) return
      if (useState<Boolean>('subscriptionsLoaded').value) return

      if (DEBUG) console.log('Continue with db fetch')
      if (DEBUG) console.log(`DB initialized: ${useState<Boolean>('dbInitialized').value}`)

      const startTime = Date.now()
      while (!useState<Boolean>('dbInitialized').value) {
        if (Date.now() - startTime > TIMEOUT) {
          console.error('Database initialization timed out')
          return navigateTo('/access/login', { replace: true })
        }
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      const { $db }: any = useNuxtApp()

      if (!$db) {
        console.error('Database not initialized')
        return
      }

      if (DEBUG) console.log($db)

      try {
        // First database query with timeout
        const queryPromise = $db.execute('SELECT * FROM "account_subscriptions" ORDER BY "_updatedAt" DESC', [])
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Database query timeout')), TIMEOUT))

        const subscriptionsQuery = await Promise.race([queryPromise, timeoutPromise])
        if (DEBUG) console.log(subscriptionsQuery)

        const mostRecentSubscription = subscriptionsQuery?.rows?._array?.[0]
        if (DEBUG) console.log(mostRecentSubscription)

        if (mostRecentSubscription) {
          useState<Boolean>('subscriptionsLoaded').value = true
          if (DEBUG) console.log('Tomas')

          // Second database query with timeout
          const seasonQueryPromise = $db.execute('SELECT * FROM "calendar_seasons" WHERE id = ?', [mostRecentSubscription._season])
          const seasonTimeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Season query timeout')), TIMEOUT))

          const seasonQuery = await Promise.race([seasonQueryPromise, seasonTimeoutPromise])
          if (DEBUG) console.log(seasonQuery)

          const toBeRoutedSeason = seasonQuery?.rows?._array?.[0]

          const destination = toBeRoutedSeason?._currentRound ? useSL(`round/${toBeRoutedSeason?._currentRound}`) : useSL(`campaign/${mostRecentSubscription?._season}`)
          // const destination = useSL(`campaign/SE2514E0B013`)

          return navigateTo(destination, { replace: true })
        }
      } catch (error) {
        console.error('Database query failed or timed out:', error)

        try {
          await useClearUser().clearPowersyncData()
          if (DEBUG) console.log('PowerSync data cleared successfully')
        } catch (error) {
          console.error('Failed to clear PowerSync data:', error)
          // Handle failure - perhaps show user error message
        }

        await useClearUser().logOutUser()

        // Redirect to fallback route
        // return navigateTo('/access/login', { replace: true })
      }
    },
  ],
})
</script>
