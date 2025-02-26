<template>
  <main>
    <h1>Challenge</h1>
    <ChallengesBase />
  </main>
</template>

<script setup lang="ts">
import type { _Challenge } from '~/types'

const route = useRoute()
definePageMeta({ layout: 'round' })
useHead({ title: `Challenge ${route.params.id}` })

const { data: challenge, isLoading } = await usePopulatedChallenge(route.params.id as string)
provide(challengeKey, { challenge, isLoading })
</script>
