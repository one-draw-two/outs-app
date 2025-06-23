<template>
  <main>
    <h1>Fixture {{ fid }}</h1>
    <div class="flex justify-between">
      <div class="flex-1">{{ homeRow?._user.name }} {{ homeRow?.points }}</div>
      <div class="bg-gray-50">
        <div v-for="(rf, rfi) in realFixtures" :key="rf.$index" :id="`rfi-${rf.$index}`" class="flex-1 lg:flex items-stretch py-4 hover:bg-gray-100">
          <RealFixtureItemLink :rf="rf" />
        </div>
      </div>
      <div class="flex-1">{{ awayRow?._user.name }} {{ awayRow?.points }}</div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { User, _P_RealFixture } from '~/types'

definePageMeta({ layout: 'round' })

const fid = useRoute().params.fid
const { processedGroups } = await useGroupsWithUsers({ id: fid }, true)
const thisFixture = computed(() => processedGroups?.value[0])

const homeRow = computed(() => thisFixture?.value?.rows?.[0])
const awayRow = computed(() => thisFixture?.value?.rows?.[1])

const { round } = inject(roundKey)!
const realFixtures = computed(() => round.value?.snapshots?.map((s: any) => s._realFixture).filter(Boolean))

/*
const user = useState<User>('user')
const enhancedFixtures = computed(() => enhanceFixturesWithUserData(processedGroups.value, user.value?.id))
wecl(enhancedFixtures)
*/

// wecl(processedGroups)

useDynamicPS().updatePowerSyncParams({ selected_fixture: fid })
const { data: cursor } = await usePopulatedGroupCursor(fid as string)
wecl(cursor, 'cursor')

const pageTitle = computed(() => `Fixture ${fid}`)
useHead({ title: pageTitle })
</script>
