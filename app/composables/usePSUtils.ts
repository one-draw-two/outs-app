interface ChangeInfo<T> {
  type: 'insert' | 'update' | 'delete'
  rowId: string | number
  previousData?: T
  currentData?: T
  changedFields?: string[]
}

export interface WithPSChange extends Record<string, any> {
  $psChange?: {
    type: 'insert' | 'update' | 'delete'
    timestamp: number
    changedFields?: string[]
    isOld?: boolean
  }
}

export interface PSWatchOptions {
  detectChanges?: boolean
  highlightDuration?: number
  watchSource?: Ref<any> | ComputedRef<any>
}

export function usePSWatch<T extends WithPSChange>(sql: string, parameters: any[] = [], options?: PSWatchOptions) {
  if (sql.includes(' IN (') && parameters.length === 0) {
    console.warn('Avoiding SQL error: IN clause with empty parameters array detected')
    return {
      data: ref<T[]>([]),
      isLoading: ref(false),
      error: ref(null),
      changeInfo: ref(null),
      await: async () => {},
    }
  }

  const { $db }: any = useNuxtApp()
  const data = ref<T[]>([])
  const isLoading = ref(true)
  const error = ref<Error | null>(null)
  const changeInfo = ref<ChangeInfo<T> | null>(null)
  const detectChanges = options?.detectChanges ?? false
  const highlightDuration = options?.highlightDuration ?? 1000

  let promiseResolve: (() => void) | undefined
  const firstPopulationPromise = new Promise<void>((resolve) => (promiseResolve = resolve))

  // Helper function to resolve promise and update loading state
  const resolvePromise = () => {
    if (promiseResolve) {
      isLoading.value = false
      promiseResolve()
      promiseResolve = undefined
    }
  }

  // Simple change highlighting
  const setChangeAsOld = (item: T) => item.$psChange && setTimeout(() => (item.$psChange!.isOld = true), highlightDuration)

  // Create watched query
  const watchedQuery = $db.query({ sql, parameters }).differentialWatch({
    rowComparator: { keyBy: (item: any) => item.id, compareBy: (item: any) => JSON.stringify(item) },
  })

  // Register listener
  const dispose = watchedQuery.registerListener({
    onData: (newData: T[]) => {
      data.value = newData
      resolvePromise()
    },
    onError: (err: Error) => {
      error.value = err
      resolvePromise()
    },
    // This handler ensures we resolve even with empty results
    onStateChange: (state: any) => {
      if (!state.isLoading && promiseResolve) {
        // PowerSync might not call onData with an empty array, so we set it here
        if (state.data && state.data.length === 0) data.value = []
        resolvePromise()
      }
    },
    onDiff: detectChanges
      ? (diff: any) => {
          // Handle added items
          if (diff.added?.length) {
            const item = diff.added[0]
            item.$psChange = { type: 'insert', timestamp: Date.now() }
            setChangeAsOld(item)
            changeInfo.value = { type: 'insert', rowId: item.id, currentData: item }
          }
          // Handle removed items
          else if (diff.removed?.length) {
            const item = diff.removed[0]
            changeInfo.value = { type: 'delete', rowId: item.id, previousData: item }
          }
          // Handle updated items
          else if (diff.updated?.length) {
            const { current, previous } = diff.updated[0]
            const changedFields = Object.keys(current).filter((key) => JSON.stringify(current[key]) !== JSON.stringify(previous[key]))
            current.$psChange = { type: 'update', timestamp: Date.now(), changedFields }
            setChangeAsOld(current)
            changeInfo.value = {
              type: 'update',
              rowId: current.id,
              previousData: previous,
              currentData: current,
              changedFields,
            }
          }
        }
      : undefined,
  })

  // Handle reactive parameter updates
  let stopWatcher: (() => void) | undefined
  if (options?.watchSource) stopWatcher = watch(options.watchSource, (val) => watchedQuery.updateSettings({ query: { sql, parameters: [val, ...parameters.slice(1)] } }), { immediate: false })

  // Simple cleanup
  getCurrentInstance() &&
    onUnmounted(() => {
      dispose()
      stopWatcher?.()
    })

  return {
    data,
    isLoading,
    error,
    changeInfo: detectChanges ? changeInfo : undefined,
    await: () => firstPopulationPromise,
  }
}

export function usePSWatchSingle<T extends WithPSChange>(sql: string, parameters: any[] = [], options?: PSWatchOptions) {
  const arrayResult = usePSWatch<T>(sql, parameters, options)
  return {
    data: computed(() => arrayResult.data.value?.[0] || null),
    isLoading: arrayResult.isLoading,
    error: arrayResult.error,
    changeInfo: arrayResult.changeInfo,
    await: arrayResult.await,
  }
}

export function usePSQueryWatcher<T>(queries: { data: Ref<any>; isLoading?: Ref<boolean> }[], callback: (data: Ref<T | null>) => void) {
  const isLoading = ref(true)
  const data = ref<T | null>(null)

  watchEffect(() => {
    const allQueriesPopulated = queries.every((q) => q.data.value)
    if (allQueriesPopulated) {
      callback(data as Ref<T | null>)
      isLoading.value = false
    } else {
      isLoading.value = true
    }
  })

  return { data, isLoading }
}
