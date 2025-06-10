<template>
  <div>
    <div class="py-8 bg-repeat-x bg-[length:512px_auto] relative" :style="{ backgroundImage: season?.bgUrl ? `url(${getSanityUrl(season.bgUrl)})` : 'none' }">
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 pointer-events-none"></div>
      <div class="main-container space-y-8 relative z-10 overflow-x-auto hide-scroll w-full whitespace-nowrap" style="scroll-padding-left: 2rem; scroll-padding-right: 2rem">
        <h1 class="sticky left-0 text-5xl stroke-text">Season {{ season?.name }}</h1>
        <SeasonHorizontalCalendar />
      </div>
    </div>
    <main class="main-container py-8">
      <div class="space-y-4">
        <SeasonPointColumns :tournamentCols="headers" />
        <div v-for="(row, ri) of processedSeasonRows" class="flex justify-between">
          <div class="flex-1 space-x-4">
            <span class="tabular-nums">{{ (ri + 1).toString().padStart(2, '0') }}</span>
            {{ row._user.name }}
          </div>
          <SeasonPointRows :tournamentCols="headers" :row="row" class="flex-2" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { _Season, _Stage, _Round } from '~/types'

const sid = useRoute().params.sid as string

const season = useState<any>('season')
watch(toRef(sid), async (to) => !to || season.value?.id === to || (useState<any>('season').value = (await usePopulatedSeason(to)).data.value), { immediate: true })

const { processedGroups } = await useGroupsWithUsers({ _refId: sid })

const mainTournamentGroup = computed(() => processedGroups.value.find((group) => group._tournament === 'BTCAMP'))
const headers = computed(() => [{ name: 'BTCURV' }, { name: 'BTCAMP' }])

const processedSeasonRows = computed(() => {
  return mainTournamentGroup.value?.rows.map((row: any) => ({
    ...row,
    $BTCURV: processedGroups.value.find((group) => group._tournament === 'BTCURV')?.rows.find((r: any) => r._user.id === row._user.id)?.rowMeta,
  }))
})

wecl(processedGroups)
wecl(processedSeasonRows)

const pageTitle = computed(() => `Season ${season.value?.name}`)
useHead({ title: pageTitle })
</script>
