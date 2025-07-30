<template>
  <LayoGroupAndFixture color="gray">
    <template #header-left>
      <div class="flex items-center gap-4">
        <StandingsBreadcrumbs :breadCrumbChain="breadcrumbChain" />
      </div>
    </template>
    <template #page>
      <main class="space-y-8">
        <h2>FIXTURES</h2>
        <NuxtLink
          v-for="group of fixtures"
          :to="useSL(`round/${standings?._link._refId}/fixture/${group.id}`)"
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
  </LayoGroupAndFixture>
</template>

<script setup lang="ts">
import type { _BPTournamentRecord } from '~/../types'

const stanid = useRoute().params.stanid

useDynamicPS().updatePowerSyncParams({ selected_parent_gid: stanid })

const { processedGroups: standingsQuery, parentChain } = await useGroupsWithUsers({ id: stanid }, false, undefined, true)

const standings = computed(() => standingsQuery?.value?.[0])
const breadcrumbChain = computed(() => [...[...parentChain.value].reverse(), standings.value!])

const { processedGroups: fixtures } = await useGroupsWithUsers({ _parentGroup: stanid }, true)

useState<any>('pickerSeasonId').value = standings.value?._season

const pageName = computed(() => `${standings.value?.name}`)

const pageTitle = computed(() => `${pageName.value} Fixtures `)
useHead({ title: pageTitle })
</script>
