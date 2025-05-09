<template>
  <main class="main-container space-y-8">
    <h1>{{ stage?.name }}</h1>
    <div>
      <NuxtLink v-for="round in stage?.rounds" :to="useSL(`round/${round.id}`)" class="flex gap-8" :class="round.status === 'current' ? 'bg-green-500' : ''">
        <div class="font-mono">
          {{ round.name }}
        </div>
        <div>
          {{ round.status }}
        </div>
      </NuxtLink>
    </div>
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
import type { _P_Stage } from '~/types'

const stage = useState<_P_Stage>('stage')
const pageTitle = computed(() => stage.value?.name)
useHead({ title: pageTitle })

const { processedGroups } = await useGroupsWithUsers(`%"_refId":"${useRoute().params.stid}"%`, [])
// useState<any>('powerSyncParams').value = { selected_stid: stage.value?.id }
</script>
