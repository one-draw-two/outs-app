<template>
  <div>
    <h2>Bets</h2>
    <p v-for="bet in bets" :key="bet.id" v-highlight:[options]="bet">{{ bet.name }} // {{ bet.id }}</p>
  </div>
</template>

<script setup lang="ts">
import type { _Bet } from '~/types'
const options = { classes: { insert: 'bg-emerald-300', update: 'bg-sky-300', delete: 'bg-red-300' } }

const sql = 'SELECT * FROM bets ORDER BY CAST(name AS INTEGER), name COLLATE NOCASE ASC'
const { data: bets, isLoading: ilbe, changeInfo } = usePSWatch<_Bet>(sql, [], { detectChanges: true, abortController: new AbortController() })
// if (changeInfo) watch(changeInfo, (info) => console.log(info))
useLoadingWatcher(ilbe, bets, 'Bets', { changeInfo })
</script>
