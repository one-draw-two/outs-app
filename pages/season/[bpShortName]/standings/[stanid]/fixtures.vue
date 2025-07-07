<template>
  <main class="space-y-8">
    <h2>FIXTURES</h2>
    <NuxtLink
      v-for="group of groups"
      :to="useSL(`round/${useRoute().params.rid}/fixture/${group.id}`)"
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

<script setup lang="ts">
definePageMeta({ layout: 'round' })
const { round } = inject(roundKey)!
useHead({ title: `${round.value?.name} | Fixtures | YOBYOB` })

const route = useRoute()

const { processedGroups: groups } = await useGroupsWithUsers({ _parentGroup: route.params.stanid }, true)
// const { processedGroups: groups } = await useGroupsWithUsers({ _refId: useRoute().params.rid }, true)
</script>
