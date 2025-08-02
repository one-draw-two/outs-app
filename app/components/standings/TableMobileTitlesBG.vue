<template>
  <div v-if="isDetailsOn" class="lg:hidden main-container vertical-come-in absolute -z-1 pointer-events-none top-0 space-y-8X">
    <div class="h-16 w-full placeholder" />
    <TransitionGroup tag="div" name="standing-row">
      <template v-for="(row, ri) of sortedRows" :key="row._user.id || `row-${ri}`">
        <div v-if="ri > 0 && ri % headerRepeatInterval === 0" class="h-16 w-full placeholder" />
        <div class="w-[var(--container-width)] h-16 lg:h-10 border-b border-gray-100 flex items-start justify-between">
          <StandingsRowTitle
            :row="row"
            :ri="row.isMetaRow ? '—' : ri + 1 - sortedRows.slice(0, ri).filter((r: any) => r.isMetaRow).length"
            :is-truncate="true"
            class="lg:sticky bg-inherit z-[3] left-0 truncate w-48 shrink-0"
            :class="isCurrentUserRow(row) ? 'text-green-700 font-bold' : ''"
          />
          <div>asd</div>
        </div>
      </template>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isDetailsOn: boolean
  headerRepeatInterval: number
  sortedRows: any[]
  isCurrentUserRow: (row: any) => boolean
}>()
</script>
