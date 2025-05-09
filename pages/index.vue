<template></template>

<script setup lang="ts">
definePageMeta({
  middleware: [
    async function (to) {
      if (to.meta.isPublic) return
      if (useState<Boolean>('subscriptionsLoaded').value) return

      const { $db }: any = useNuxtApp()
      const subscriptionsQuery = await $db.execute('SELECT * FROM "account_subscriptions" ORDER BY "_updatedAt" DESC', [])
      const mostRecentSubscription = subscriptionsQuery?.rows?._array?.[0]

      if (mostRecentSubscription) {
        useState<Boolean>('subscriptionsLoaded').value = true

        const seasonQuery = await $db.execute('SELECT * FROM "calendar_seasons" WHERE id = ?', [mostRecentSubscription._season])
        const toBeRoutedSeason = seasonQuery?.rows?._array?.[0]

        const destination = toBeRoutedSeason?._currentRound ? useSL(`round/${toBeRoutedSeason?._currentRound}`) : useSL(`campaign/${mostRecentSubscription?._season}`)

        return navigateTo(destination, { replace: true })
      }
    },
  ],
})
</script>
