const DEBUG = false

export const PERF_DEBUG = false // Global flag to enable/disable performance debugging

// Create a singleton storage for start times outside the composable
const startTimes = ref<Record<string, number>>({})

export default function usePerformanceDebug() {
  const perfMetrics = useState<Record<string, number>>('perfMetrics', () => ({}))

  const startTimer = (label: string) => {
    if (!PERF_DEBUG) return
    if (DEBUG) console.log(`Starting timer: ${label}`)
    startTimes.value[label] = performance.now()
  }

  const endTimer = (label: string) => {
    if (!PERF_DEBUG) return
    if (DEBUG) console.log(`Ending timer: ${label}`, startTimes.value)

    if (!startTimes.value[label]) {
      console.warn(`No start time found for "${label}"`)
      return
    }

    const duration = performance.now() - startTimes.value[label]
    perfMetrics.value = {
      ...perfMetrics.value,
      [label]: parseFloat(duration.toFixed(2)),
    }

    if (DEBUG) console.log(`🕒 ${label}: ${duration.toFixed(2)}ms`)
    delete startTimes.value[label]
  }

  return {
    perfMetrics,
    startTimer,
    endTimer,
  }
}
