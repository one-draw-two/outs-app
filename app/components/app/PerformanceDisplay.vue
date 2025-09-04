<template>
  <div v-if="PERF_DEBUG" class="perf-debug">
    <div class="perf-debug-header">
      <h3>Performance Metrics</h3>
      <div class="tabs">
        <button @click="activeTab = 'app'" :class="{ active: activeTab === 'app' }">App</button>
        <button @click="activeTab = 'network'" :class="{ active: activeTab === 'network' }">Network</button>
      </div>
      <button @click="clearMetrics" class="clear-btn">Clear</button>
    </div>

    <div v-if="activeTab === 'app'" class="perf-debug-metrics">
      <div v-for="(value, key) in appMetrics" :key="key" class="perf-metric">
        <span class="perf-label">{{ key }}:</span>
        <span class="perf-value">{{ value }}ms</span>
      </div>
      <div v-if="Object.keys(appMetrics).length === 0" class="no-metrics">No app metrics recorded yet</div>
    </div>

    <div v-if="activeTab === 'network'" class="perf-debug-metrics">
      <div v-for="(value, key) in networkMetrics" :key="key" class="perf-metric">
        <span class="perf-label">{{ key }}:</span>
        <span class="perf-value">{{ value }}ms</span>
      </div>
      <div v-if="Object.keys(networkMetrics).length === 0" class="no-metrics">No network metrics recorded yet</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PERF_DEBUG } from '~/composables/usePerformanceDebug'

const perfMetrics = useState<Record<string, number>>('perfMetrics')
const activeTab = ref('app')

// Split metrics into app and network categories
const appMetrics = computed(() => {
  return Object.entries(perfMetrics.value || {})
    .filter(([key]) => !key.includes('fetch-') && !key.startsWith('[SW]'))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
})

const networkMetrics = computed(() => {
  return Object.entries(perfMetrics.value || {})
    .filter(([key]) => key.includes('fetch-') || key.startsWith('[SW]'))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
})

function clearMetrics() {
  perfMetrics.value = {}
}
</script>

<style scoped>
.perf-debug {
  position: fixed;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  color: #00ff00;
  padding: 12px;
  border-top-left-radius: 8px;
  font-family: monospace;
  max-width: 350px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 9999;
}

.perf-debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.perf-debug-header h3 {
  margin: 0;
  font-size: 14px;
}

.tabs {
  display: flex;
  gap: 4px;
}

.tabs button {
  background: #333;
  color: #aaa;
  border: none;
  padding: 2px 6px;
  border-radius: 4px 4px 0 0;
  font-size: 11px;
  cursor: pointer;
}

.tabs button.active {
  background: #444;
  color: white;
}

.clear-btn {
  background: #333;
  color: white;
  border: none;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
}

.perf-metric {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 12px;
}

.perf-label {
  margin-right: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.no-metrics {
  font-style: italic;
  font-size: 12px;
  opacity: 0.7;
}
</style>
