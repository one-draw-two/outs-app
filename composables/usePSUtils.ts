import type { UnwrapRef, Ref, ComputedRef } from 'vue'

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

export function usePSWatch<T extends WithPSChange>(
  sql: string,
  parameters: any[] = [],
  options?: {
    detectChanges?: boolean
    abortController?: AbortController
    highlightDuration?: number
    watchSource?: Ref<any> | ComputedRef<any>
  }
) {
  const { $db }: any = useNuxtApp()
  const data = ref<T[]>([])
  const previousData = ref<T[]>([])
  const isLoading = ref(true)
  const error = ref<Error | null>(null)
  const changeInfo = ref<ChangeInfo<T> | null>(null)

  let controller = options?.abortController || new AbortController()
  const detectChanges = options?.detectChanges ?? false
  const highlightDuration = options?.highlightDuration ?? 5000

  let promiseResolve: (() => void) | undefined
  let firstPopulationPromise = new Promise<void>((resolve) => {
    promiseResolve = resolve
  })

  const setChangeAsOld = (item: T) => {
    if (item.$psChange) {
      setTimeout(() => {
        if (item.$psChange) {
          item.$psChange.isOld = true
          // Trigger a reactive update
          data.value = [...data.value]
        }
      }, highlightDuration)
    }
  }

  const detectChangeType = (oldData: T[], newData: T[]): ChangeInfo<T> | null => {
    if (!detectChanges) return null

    const oldMap = new Map(oldData.map((item) => [item.id, item]))
    const newMap = new Map(newData.map((item) => [item.id, item]))

    // Find added item
    for (const item of newData) {
      if (!oldMap.has(item.id)) {
        item.$psChange = { type: 'insert', timestamp: Date.now() }
        setChangeAsOld(item)
        return { type: 'insert', rowId: item.id, currentData: item }
      }
    }

    // Find deleted item
    for (const item of oldData) {
      if (!newMap.has(item.id)) {
        item.$psChange = { type: 'delete', timestamp: Date.now() }
        setChangeAsOld(item)
        return { type: 'delete', rowId: item.id, previousData: item }
      }
    }

    // Find updated item
    for (const item of newData) {
      const oldItem = oldMap.get(item.id)
      if (oldItem && JSON.stringify(oldItem) !== JSON.stringify(item)) {
        const changedFields = Object.keys(item as Record<string, unknown>).filter((key) => JSON.stringify(oldItem[key]) !== JSON.stringify(item[key]))
        item.$psChange = { type: 'update', timestamp: Date.now(), changedFields }
        setChangeAsOld(item)
        return { type: 'update', rowId: item.id, previousData: oldItem, currentData: item, changedFields }
      }
    }

    return null
  }

  // --- Main fetch logic, supports reactivity if watchSource is provided ---
  const fetch = async (params: any[] = parameters) => {
    controller.abort()
    controller = new AbortController()
    isLoading.value = true

    let isFirstUpdate = true

    try {
      for await (const update of $db.watch(sql, params, { signal: controller.signal })) {
        const newData = update.rows?._array || []

        if (detectChanges && !isFirstUpdate) {
          const currentData = data.value as T[]
          changeInfo.value = detectChangeType(currentData, newData)
          previousData.value = [...currentData]
        }

        if (isFirstUpdate) {
          isFirstUpdate = false
          if (promiseResolve) promiseResolve()
        }

        data.value = newData
        isLoading.value = false
      }
    } catch (e) {
      if ((e as any).name !== 'AbortError') {
        error.value = e as Error
      }
      isLoading.value = false
      if (isFirstUpdate && promiseResolve) promiseResolve()
    }
  }

  // Initial fetch
  fetch(parameters)

  // Watch for changes if watchSource is provided
  let stopWatcher: (() => void) | undefined
  if (options?.watchSource) {
    stopWatcher = watch(
      options.watchSource,
      (val) => {
        const params = [...parameters]
        params[0] = val
        fetch(params)
      },
      { immediate: false }
    )
  }

  /*
  onUnmounted(() => {
    controller.abort()
    if (stopWatcher) stopWatcher()
  })
    */

  return {
    data,
    isLoading,
    error,
    changeInfo: detectChanges ? changeInfo : undefined,
    await: () => firstPopulationPromise,
  }
}

export function usePSQueryWatcher<T>(queries: { data: Ref<any>; isLoading?: Ref<boolean> }[], callback: (data: Ref<UnwrapRef<T> | null>) => void) {
  const isLoading = ref(true)
  const data = ref<UnwrapRef<T> | null>(null)

  watchEffect(() => {
    const allQueriesPopulated = queries.every((q) => q.data.value)

    if (allQueriesPopulated) {
      callback(data as Ref<UnwrapRef<T> | null>)
      isLoading.value = false
    } else {
      isLoading.value = true
    }
  })

  return { data, isLoading }
}

/*
export const useLoadingWatcher = <T>(
  data: Ref<T>,
  label?: string,
  options?: {
    changeInfo?: Ref<ChangeInfo<any> | null>
    onChangeCallback?: (info: ChangeInfo<any>) => void
    onDataChange?: (value: T) => void // Add generic data change callback
    skipEmptyArrays?: boolean
  }
) => {
  watchEffect(() => {
    if (label) console.log(label, data.value)
    if (options?.onDataChange && data.value) {
      if (options.skipEmptyArrays && Array.isArray(data.value) && data.value.length === 0) return
      options.onDataChange(data.value)
    }
  })

  if (options?.changeInfo) {
    watch(options.changeInfo, (info) => {
      if (info) {
        console.log(`${label} Change:`, info)
        options.onChangeCallback?.(info)
      }
    })
  }
}
*/
