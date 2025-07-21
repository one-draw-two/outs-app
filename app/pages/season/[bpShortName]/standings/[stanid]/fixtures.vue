<template>
  <AppDynamicLayout color="gray">
    <template #header-left>
      <div class="flex items-center gap-4">
        <NuxtLink :to="useSL(`${linkColl?.toLowerCase()}/${link?._refId}`)">{{ linkColl }}</NuxtLink>
        <h1>{{ pageName }}</h1>
      </div>
    </template>
    <template #page>
      <main class="space-y-8">
        <h2>FIXTURES</h2>
        <NuxtLink
          v-for="group of groups"
          :to="useSL(`round/${standings._link._refId}/fixture/${group.id}`)"
          class="block"
          :class="useUserHelpers().isUserInGroup(group) ? 'bg-green-100' : 'bg-gray-100'"
          :key="group.id"
        >
          {{ group.id }}
          <div class="flex gap-8">
            <div v-for="row of group.rows">
              {{ row._user?.name }}
              <FixturePointsDisplay :row="row" />
            </div>
          </div>
        </NuxtLink>
      </main>
    </template>
  </AppDynamicLayout>
</template>

<script setup lang="ts">
import type { _BPTournamentRecord } from '~/../types'

const stanid = useRoute().params.stanid

useDynamicPS().updatePowerSyncParams({ selected_parent_gid: stanid })

const { processedGroups: standingsQuery } = await useGroupsWithUsers({ id: stanid }, false)
const { processedGroups: groups } = await useGroupsWithUsers({ _parentGroup: stanid }, true)

const standings = computed(() => standingsQuery?.value?.[0])

useState<any>('pickerSeasonId').value = standings.value?._season

const link = computed(() => standings.value?._link)
const linkColl = computed(() => (link.value?._refColl === 'Season' ? 'Campaign' : link.value?._refColl))
const pageName = computed(() => `${standings.value?.name}`)

const pageTitle = computed(() => `${pageName.value} Fixtures `)
useHead({ title: pageTitle })
</script>
