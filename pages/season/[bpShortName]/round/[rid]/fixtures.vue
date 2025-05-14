<template>
  <main class="space-y-8">
    <h2>FIXTURES</h2>
    <div v-for="group of groups" :class="isUserInGroup(group) ? 'bg-green-100' : 'bg-gray-100'" :key="group.id">
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
import type { User, _Table } from '~/types'

definePageMeta({ layout: 'round' })
const { round } = inject(roundKey)!
useHead({ title: `${round.value?.name} | Fixtures` })

const { processedGroups: groups } = await useGroupsWithUsers({ _refId: useRoute().params.rid, _tournament: 'BTLEAG', 'meta.isFixture': true })

const user = useState<User>('user')
const isCurrentUserRow = (row: any): boolean => user.value?.id === row._user?.id
const isUserInGroup = (group: any): boolean => group.rows.some((row: any) => isCurrentUserRow(row))
</script>
