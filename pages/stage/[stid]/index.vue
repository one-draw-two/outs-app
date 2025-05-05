<template>
  <main>
    <h1>{{ stage?.name }}</h1>
    <div class="flex gap-8">
      <div v-for="group of stage?.groups" class="flex-1">
        <h2>{{ group.name }}</h2>
        <div v-for="row of group.rows" class="flex-1">
          <p>{{ row._user.name }}</p>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
definePageMeta({ layout: 'stage' })
const { stage, isLoading } = inject(stageKey)!
const pageTitle = computed(() => stage.value?.name)
useHead({ title: pageTitle })

useState<any>('powerSyncParams').value = { selected_stid: stage.value?.id }
</script>
