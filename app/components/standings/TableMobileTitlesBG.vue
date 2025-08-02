<template>
  <div v-if="isDetailsOn" class="lg:hidden vertical-come-in absolute -z-1 pointer-events-none top-0">
    <div class="h-16 w-full placeholder" />
    <TransitionGroup tag="div" name="standing-row">
      <template v-for="(row, ri) of sortedRows" :key="row._user.id || `row-${ri}`">
        <div v-if="ri > 0 && ri % headerRepeatInterval === 0" class="h-16 w-full placeholder" />
        <div class="w-screen px-[var(--container-gap)] h-16 flex items-start justify-between pt-2" :class="[isFirstAfterHeader(ri) ? 'border-y border-gray-200' : 'border-b border-gray-200']">
          <StandingsRowTitle
            :row="row"
            :ri="row.isMetaRow ? '—' : ri + 1 - sortedRows.slice(0, ri).filter((r: any) => r.isMetaRow).length"
            :is-truncate="true"
            class="bg-inherit z-[3] left-0 truncate w-48 shrink-0"
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
  isFirstAfterHeader: (ri: number) => boolean
}>()
</script>
