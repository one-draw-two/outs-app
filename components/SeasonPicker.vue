<template>
  <div class="bg-gray-200/50 w-48 h-12 rounded-md flex-center">
    <select v-model="selectedSeason" @change="change">
      <option value="">Select a season</option>
      <option v-for="season of seasons" :value="season.id" :disabled="false && !activeUserSubscriptionSeasons?.includes(season.id)">{{ season.name }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: seasons, isLoading: ilse } = usePSWatch<any>('SELECT * FROM "calendar_seasons" ORDER BY name ASC', [], { abortController: new AbortController() })
const { data: subscriptions, isLoading: ilsb } = usePSWatch<any>('SELECT * FROM "account_subscriptions"', [], { abortController: new AbortController() })

// Initialize selected season from route params
// const selectedSeason = ref((route.params.sid as string) || '')
const selectedSeason = useState<any>('pickerSeason')

/*
watch(
  () => useState<any>('pickerSeason').value,
  (newSid) => {
    console.log('newSid', newSid)
    if (newSid )selectedSeason.value = newSid as string
  },
  { immediate: true }
)
  */

const change = (event: any) => navigateTo(event.target.value ? `/season/${event.target.value}` : '/season')

const activeUserSubscriptionSeasons = computed(() => subscriptions.value.filter((sb: any) => sb.status === 'active').map((sb) => sb._season))
</script>
