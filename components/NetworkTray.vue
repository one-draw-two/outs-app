<template>
  <Transition name="slide-up">
    <div
      v-if="!isOnline || isForcedVisible"
      class="fixed bottom-0 left-0 right-0 py-3 px-4 flex items-center justify-between z-50 cursor-pointer"
      :class="connectionColorClass"
      @click="toggleVisibility()"
    >
      <span class="font-medium text-sm text-white">
        {{ !isOnline ? 'You are offline' : 'Connection Status' }}
      </span>
      <div class="flex flex-col items-end">
        <span class="text-xs text-white opacity-70">
          {{ lastSyncedTime ? `Last synced: ${lastSyncedTime}` : 'Never synced' }}
        </span>
        <span v-if="timeSinceLastSync" class="text-xs text-white opacity-70"> ({{ timeSinceLastSync }} ago) </span>
        <span class="text-xs text-white opacity-70">
          PowerSync: {{ connected ? 'Connected' : 'Disconnected' }}
          <span v-if="isOnline && connectionType !== 'none'">({{ connectionType }})</span>
        </span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { SyncStatus } from '@powersync/web'

const { $db, $capacitor, vueApp } = useNuxtApp()
const $network = $capacitor.$network
const $day = vueApp.config.globalProperties.$day

const connected = useState<boolean>('network:powerSyncConnected', () => false)
const isOnline = useState<boolean>('network:networkOnline', () => true) // Default to true until checked
const connectionType = useState<string>('network:connectionType', () => 'unknown')
const lastSyncedTime = useState<string | null>('network:lastSyncedTime', () => null)
const lastSyncedDate = useState<Date | null>('network:lastSyncedDate', () => null)
const isForcedVisible = useState<boolean>('network:networkTrayForced', () => false)
const connectionStatus = useState<string>('network:connectionStatus', () => 'offline')
const connectionColorClass = useState<string>('network:connectionColorClass', () => 'bg-red-500')
const timeSinceLastSync = ref<string | null>(null)
const networkListener = ref<any>(null)

const initNetwork = async () => {
  try {
    const status = await $network.getStatus()
    isOnline.value = status.connected
    connectionType.value = status.connectionType

    networkListener.value = await $network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed:', status)
      isOnline.value = status.connected
      connectionType.value = status.connectionType
    })
  } catch (error) {
    console.warn('Capacitor Network API not available, using browser fallback:', error)
    isOnline.value = navigator.onLine

    window.addEventListener('online', handleBrowserNetworkChange)
    window.addEventListener('offline', handleBrowserNetworkChange)
  }
}

const handleBrowserNetworkChange = () => {
  isOnline.value = navigator.onLine
  connectionType.value = navigator.onLine ? 'unknown' : 'none'
}

watch(
  [isOnline, connected],
  ([newIsOnline, newConnected]) => {
    if (!newIsOnline) {
      connectionStatus.value = 'offline'
      connectionColorClass.value = 'bg-red-500'
    } else if (newConnected) {
      connectionStatus.value = 'connected'
      connectionColorClass.value = 'bg-green-500'
    } else {
      connectionStatus.value = 'online'
      connectionColorClass.value = 'bg-yellow-400'
    }
  },
  { immediate: true }
)

let hideTimer = ref<number | null>(null)

const toggleVisibility = () => {
  if (hideTimer.value !== null) {
    window.clearTimeout(hideTimer.value)
    hideTimer.value = null
  }

  if (!isOnline.value) {
    isForcedVisible.value = !isForcedVisible.value
    if (isForcedVisible.value) hideTimer.value = window.setTimeout(() => (isForcedVisible.value = false), 10000)
    return
  }

  isForcedVisible.value = !isForcedVisible.value
  if (isForcedVisible.value) hideTimer.value = window.setTimeout(() => (isForcedVisible.value = false), 10000)
}

const toggleEvent = useState<number>('network:networkTrayToggleTrigger', () => 0)
watch(
  () => toggleEvent.value,
  () => {
    if (toggleEvent.value > 0) toggleVisibility()
  }
)

const updateTimeSinceLastSync = () => {
  if (!lastSyncedDate.value) return
  timeSinceLastSync.value = $day(lastSyncedDate.value).fromNow(true)
}

let timerRef: ReturnType<typeof setInterval> | null = null

const startTimer = () => {
  updateTimeSinceLastSync()
  timerRef = setInterval(() => updateTimeSinceLastSync(), 60000)
}

const stopTimer = () => {
  if (timerRef !== null) {
    clearInterval(timerRef)
    timerRef = null
  }
}

watch(
  () => !isOnline.value || isForcedVisible.value,
  (isVisible) => {
    if (isVisible) startTimer()
    else stopTimer()
  }
)

const unregisterPowerSync = $db.registerListener({
  statusChanged: (status: SyncStatus) => {
    connected.value = status.connected
    if (status.lastSyncedAt) {
      lastSyncedDate.value = new Date(status.lastSyncedAt)
      lastSyncedTime.value = lastSyncedDate.value.toLocaleString()
      if (!isOnline.value || isForcedVisible.value) updateTimeSinceLastSync()
    }
  },
})

onMounted(async () => {
  await initNetwork()
  if (!isOnline.value || isForcedVisible.value) startTimer()
})

onUnmounted(async () => {
  if (networkListener.value) {
    try {
      await $network.removeAllListeners()
    } catch (error) {
      console.warn('Error removing network listeners:', error)
    }
  } else {
    window.removeEventListener('online', handleBrowserNetworkChange)
    window.removeEventListener('offline', handleBrowserNetworkChange)
  }

  unregisterPowerSync()
  stopTimer()

  if (hideTimer.value !== null) window.clearTimeout(hideTimer.value)
})
</script>
