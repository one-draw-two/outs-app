<template>
  <div v-if="PERF_DEBUG" class="perf-debug">
    <div class="perf-debug-header">
      <h3>Performance Metrics</h3>
      <button @click="clearMetrics">Clear</button>
    </div>
    <div class="perf-debug-metrics">
      <div v-for="(value, key) in perfMetrics" :key="key" class="perf-metric">
        <span class="perf-label">{{ key }}:</span>
        <span class="perf-value">{{ value }}ms</span>
      </div>
      <div v-if="Object.keys(perfMetrics).length === 0" class="no-metrics">No metrics recorded yet</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PERF_DEBUG } from '~/composables/usePerformanceDebug'

const perfMetrics = useState<Record<string, number>>('perfMetrics')

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
  max-width: 300px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 9999;
}

.perf-debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.perf-debug-header h3 {
  margin: 0;
  font-size: 14px;
}

.perf-debug-header button {
  background: #333;
  color: white;
  border: none;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
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
}

.no-metrics {
  font-style: italic;
  font-size: 12px;
  opacity: 0.7;
}
</style>
