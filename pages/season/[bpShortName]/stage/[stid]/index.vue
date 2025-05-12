<template>
  <main class="main-container space-y-8">
    <h1>Rounds</h1>
    <div>
      <NuxtLink v-for="round in rounds" :to="useSL(`round/${round.id}`)" class="flex gap-8" :class="round.status === 'current' ? 'bg-green-500' : ''">
        <div class="font-mono">
          {{ round.name }}
        </div>
        <div>
          {{ round.status }}
        </div>
      </NuxtLink>
    </div>
    <h1>Groups</h1>
    <div class="flex gap-8">
      <div v-for="group of processedGroups" class="flex-1">
        <h2>{{ group.name }}</h2>
        <div v-for="row of group.rows" class="flex-1">
          <p>{{ row._user.name }}</p>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import type { _Stage, _Round } from '~/types'

const stid = useRoute().params.stid
const { data: stages } = usePSWatch<_Stage>('SELECT * FROM "calendar_stages" WHERE id = ?', [stid], { detectChanges: true })
const { data: rounds } = usePSWatch<_Round>('SELECT * FROM "calendar_rounds" WHERE _stage = ? ORDER BY sePI ASC', [stid], { detectChanges: true })

const stage = computed(() => stages.value[0])

const { processedGroups } = await useGroupsWithUsers({ _refId: useRoute().params.stid })

const pageTitle = computed(() => stage.value?.name)
useHead({ title: pageTitle })

// useState<any>('powerSyncParams').value = { selected_stid: stage.value?.id }
</script>
