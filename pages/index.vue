<template></template>

<script setup lang="ts">
definePageMeta({
  middleware: [
    async function (to) {
      if (to.meta.isPublic) return
      if (useState<Boolean>('subscriptionsLoaded').value) return

      const { $db }: any = useNuxtApp()
      const subscriptions = await $db.execute('SELECT * FROM "account_subscriptions" ORDER BY "_updatedAt" DESC', [])
      const mostRecentSubscription = subscriptions?.rows?._array?.[0]

      if (mostRecentSubscription) {
        useState<Boolean>('subscriptionsLoaded').value = true
        return navigateTo(`/season/${useRuntimeConfig().public.cBPSsn}/season/${mostRecentSubscription?._season}`, { replace: true })
      }
    },
  ],
})
</script>
