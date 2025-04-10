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
        <span class="text-xs text-white opacity-70"> PowerSync: {{ connected ? 'Connected' : 'Disconnected' }} </span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { SyncStatus } from '@powersync/web'

const { $db } = useNuxtApp()
const $day = useNuxtApp().vueApp.config.globalProperties.$day

const connected = useState<boolean>('network:powerSyncConnected', () => false)
const isOnline = useState<boolean>('network:networkOnline', () => navigator.onLine)
const lastSyncedTime = useState<string | null>('network:lastSyncedTime', () => null)
const lastSyncedDate = useState<Date | null>('network:lastSyncedDate', () => null)
const isForcedVisible = useState<boolean>('network:networkTrayForced', () => false)
const connectionStatus = useState<string>('network:connectionStatus', () => 'offline') // 'connected', 'online', 'offline'
const connectionColorClass = useState<string>('network:connectionColorClass', () => 'bg-red-500')
const timeSinceLastSync = ref<string | null>(null)

// Watch connection state changes and update both status and color class
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

// Reference for the hide timer - fixed type to number for setTimeout
let hideTimer = ref<number | null>(null)

// Improved toggle visibility function that handles multiple presses
const toggleVisibility = () => {
  // Always clear existing timer first
  if (hideTimer.value !== null) {
    window.clearTimeout(hideTimer.value)
    hideTimer.value = null
  }

  // If we're offline, clicking should only toggle the forced visibility
  // but keep the tray visible due to offline status
  if (!isOnline.value) {
    // If forced is already true, turn it off (timer was already cleared above)
    if (isForcedVisible.value) {
      isForcedVisible.value = false
    } else {
      // Turn on forced and set timer (even though offline will keep it visible)
      isForcedVisible.value = true
      hideTimer.value = window.setTimeout(() => {
        isForcedVisible.value = false
      }, 10000)
    }
    return
  }

  // Normal toggle behavior when online
  isForcedVisible.value = !isForcedVisible.value

  // Only set timer if we're now visible
  if (isForcedVisible.value) {
    hideTimer.value = window.setTimeout(() => {
      isForcedVisible.value = false
    }, 10000) // 10 seconds
  }
}

// Listen for the toggle event
const toggleEvent = useState<number>('network:networkTrayToggleTrigger', () => 0)
watch(
  () => toggleEvent.value,
  () => {
    if (toggleEvent.value > 0) {
      toggleVisibility()
    }
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

// Update timer when either tray is showing (forced or offline)
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

const handleNetworkChange = () => (isOnline.value = navigator.onLine)

onMounted(() => {
  window.addEventListener('online', handleNetworkChange)
  window.addEventListener('offline', handleNetworkChange)
  if (!isOnline.value || isForcedVisible.value) startTimer()
})

onUnmounted(() => {
  window.removeEventListener('online', handleNetworkChange)
  window.removeEventListener('offline', handleNetworkChange)
  unregisterPowerSync()
  stopTimer()

  // Clear any existing timer - fixed to handle null case
  if (hideTimer.value !== null) {
    window.clearTimeout(hideTimer.value)
  }
})
</script>
