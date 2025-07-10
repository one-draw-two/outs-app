<template>
  <LayoRound>
    <main>
      <ChallengesBase />
    </main>
  </LayoRound>
</template>

<script setup lang="ts">
import type { _Challenge } from '~/types'

definePageMeta({ middleware: 'round' })
const route = useRoute()
useHead({ title: `Challenge ${route.params.cid}` })

const { data: challenge, isLoading } = await usePopulatedChallenge(route.params.cid as string)
provide(challengeKey, { challenge, isLoading })
</script>
