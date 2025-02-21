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
  }
) {
  const { $db }: any = useNuxtApp()
  const data = ref<T[]>([])
  const previousData = ref<T[]>([])
  const isLoading = ref(true)
  const error = ref<Error | null>(null)
  const changeInfo = ref<ChangeInfo<T> | null>(null)

  let isFirstUpdate = true // Add this flag
  const highlightDuration = options?.highlightDuration ?? 5000 // Default 5 seconds

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

  const controller = options?.abortController || new AbortController()
  const detectChanges = options?.detectChanges ?? false

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

  const watch = async () => {
    try {
      for await (const update of $db.watch(sql, parameters, { signal: controller.signal })) {
        const newData = update.rows?._array || []

        if (detectChanges && !isFirstUpdate) {
          const currentData = data.value as T[]
          changeInfo.value = detectChangeType(currentData, newData)
          previousData.value = [...currentData]
        }

        isFirstUpdate = false // Reset flag after first update
        data.value = newData
        isLoading.value = false
      }
    } catch (e) {
      error.value = e as Error
      isLoading.value = false
    }
  }

  watch()

  onUnmounted(() => controller.abort())

  return { data, isLoading, error, changeInfo: detectChanges ? changeInfo : undefined }
}

export const useLoadingWatcher = <T>(
  isLoading: Ref<boolean>,
  data: Ref<T>,
  label: string = 'Data',
  options?: {
    changeInfo?: Ref<ChangeInfo<any> | null>
    onChangeCallback?: (info: ChangeInfo<any>) => void
  }
) => {
  watchEffect(() => console.log(label, data.value))

  if (options?.changeInfo) {
    watch(options.changeInfo, (info) => {
      if (info) {
        console.log(`${label} Change:`, info)
        options.onChangeCallback?.(info)
      }
    })
  }
}
