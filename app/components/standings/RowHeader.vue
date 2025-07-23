<template>
  <div class="w-[var(--twContMaxW)] py-8 border-y border-gray-100">
    <div class="flex h-12 w-full justify-between">
      <div ref="observerTarget" class="tobeobserved bg-white sticky z-[3] left-0 w-48 shrink-0">
        <UtilLineBar color="blue-500" background-color="white" text-color="gray-700" variant="subtle">
          <span class="text-xs">{{ groupingKey?.label }}</span>
        </UtilLineBar>
        <UtilLineBar color="blue-500" background-color="white" text-color="gray-700" variant="subtle">
          <span class="text-xs">User</span>
        </UtilLineBar>
      </div>
      <div v-if="isDetailsOn" class="h-full w-8 bg-gradient-to-r from-white max-lg:hidden sticky top-0 left-48 z-3 shrink-0" />
      <div v-if="isDetailsOn" class="flex-1">
        <div class="flex min-w-max gap-4">
          <div class="flex-1" v-for="group in dgContributionsGroupedLabels" :key="group.key">
            <UtilLineBar color="green-500" background-color="white" text-color="gray-700" variant="subtle">
              <span class="text-xs font-bold">{{ group.item?.name }}</span>
            </UtilLineBar>
            <div class="flex">
              <div v-for="cs in group._groupedStandings" :key="cs.id" class="flex-1 min-w-24 truncate px-2X">
                <UtilLineBar color="blue-500" background-color="white" text-color="gray-700" variant="subtle">
                  <NuxtLink :to="useSL(`standings/${cs.id}`)" class="text-xs">
                    <span class="text-xs font-medium truncate">{{ cs.item?.name }}</span>
                  </NuxtLink>
                </UtilLineBar>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isDetailsOn" class="h-full w-8 bg-gradient-to-l from-white max-lg:hidden sticky top-0 right-48 z-3 shrink-0" />
      <div class="bg-white lg:sticky z-[3] right-0 truncate w-48 shrink-0">
        <UtilLineBar color="green-500" background-color="white" text-color="gray-700" variant="subtle" class="w-full">
          <span class="text-xs font-bold">{{ dgGrouping?.columnDisplay?.ungroupedTournamentIds?.label }}</span>
        </UtilLineBar>
        <div class="flex gap-2">
          <UtilLineBar v-for="tDef of dgGroupingColumnsPopulated" color="green-500" background-color="white" text-color="gray-700" variant="subtle" class="w-full">
            <NuxtLink :to="tDef.link ? useSL(`standings/${tDef.standings.id}`) : ''" class="text-xs">
              <span class="text-xs font-bold">{{ tDef.label ?? tDef.t?.name }}</span>
            </NuxtLink>
          </UtilLineBar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  groupingKey: any
  dgContributionsGroupedLabels: any[]
  dgGrouping: any
  dgGroupingColumnsPopulated?: any[]
  isObserved?: boolean
  isDetailsOn?: boolean
}>()

const emit = defineEmits(['update:isRowTitleInvisible'])
const observerTarget = ref<HTMLElement | null>(null)
const observer = ref<IntersectionObserver | null>(null)

onMounted(() => {
  if (!props.isObserved) return

  observer.value = new IntersectionObserver(
    (entries) => {
      const isVisible = entries[0]?.isIntersecting
      emit('update:isRowTitleInvisible', !isVisible)
    },
    {
      threshold: 0,
      rootMargin: '0px',
    }
  )

  if (observerTarget.value) {
    observer.value.observe(observerTarget.value)
  }
})

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>
