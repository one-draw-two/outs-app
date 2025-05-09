<template>
  <main>
    <h1>INDEX</h1>
    <NuxtLink to="/season" class="block">Season</NuxtLink>
    <NuxtLink to="/admin" class="block">Admin</NuxtLink>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: [
    async function (to) {
      const bpShortName = '25' // Hardcoded at the momnet, should come from nuxt.config

      if (to.meta.isPublic) return
      if (useState<Boolean>('subscriptionsLoaded').value) return

      const { $db }: any = useNuxtApp()
      const subscriptions = await $db.execute('SELECT * FROM "account_subscriptions" ORDER BY "_updatedAt" DESC', [])
      const mostRecentSubscription = subscriptions?.rows?._array?.[0]

      if (mostRecentSubscription) {
        useState<Boolean>('subscriptionsLoaded').value = true
        return navigateTo(`/season/${bpShortName}/${mostRecentSubscription?._season}`, { replace: true })
      }
    },
  ],
})
</script>
