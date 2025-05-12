<template>
  <main class="space-y-8">
    <h2>FIXTURES</h2>
    <div v-for="group of groups">
      {{ group.id }}
      <div class="flex gap-8">
        <div v-for="row of group.rows">
          {{ row._user?.name }}
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { _Table } from '~/types'

definePageMeta({ layout: 'round' })
const { round } = inject(roundKey)!
useHead({ title: `${round.value?.name} | Fixtures` })

const { processedGroups: groups } = await useGroupsWithUsers({ _refId: useRoute().params.rid, _tournament: 'BTLEAG', 'meta.isFixture': true })
</script>
