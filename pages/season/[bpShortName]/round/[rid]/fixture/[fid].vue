<template>
  <main>
    <h1>Fixture {{ fid }}</h1>
    <div class="flex justify-between">
      <div class="">{{ thisFixture?.rows?.[0]?._user.name }}</div>
      <div class="">{{ thisFixture?.rows?.[1]?._user.name }}</div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { _P_RealFixture } from '~/types'

definePageMeta({ layout: 'round' })

const fid = useRoute().params.fid
const { processedGroups } = await useGroupsWithUsers({ id: fid })
const thisFixture = computed(() => processedGroups?.[0])

wecl(processedGroups)

const { data: userFixtures } = usePSWatch<any>('SELECT * FROM "group_fixtures"', [''])
wecl(userFixtures)

const pageTitle = computed(() => `Fixture ${fid}`)
useHead({ title: pageTitle })
</script>
