<template>
  <main>
    <ChallengesBase />
  </main>
</template>

<script setup lang="ts">
import type { _Challenge } from '~/types'

const route = useRoute()
definePageMeta({ layout: 'round' })
useHead({ title: `Challenge ${route.params.cid}` })

const { data: challenge, isLoading } = await usePopulatedChallenge(route.params.cid as string)
provide(challengeKey, { challenge, isLoading })
</script>
