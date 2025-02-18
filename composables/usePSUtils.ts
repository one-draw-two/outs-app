export function usePSWatch<T>(sql: string, parameters: any[] = [], abortController?: AbortController) {
  const { $db }: any = useNuxtApp()
  const data = ref<T[]>([])
  const isLoading = ref(true)
  const error = ref<Error | null>(null)

  const controller = abortController || new AbortController()

  const watch = async () => {
    try {
      for await (const update of $db.watch(sql, parameters, {
        signal: controller.signal,
      })) {
        data.value = update.rows?._array || []
        isLoading.value = false
      }
    } catch (e) {
      error.value = e as Error
      isLoading.value = false
    }
  }

  watch()

  onUnmounted(() => {
    controller.abort()
  })

  return {
    data,
    isLoading,
    error,
  }
}

export const useLoadingWatcher = <T>(isLoading: Ref<boolean>, data: Ref<T>, label: string = 'Data') => {
  watch(
    isLoading,
    (loading) => {
      if (!loading) console.log(`${label}:`, data.value)
    },
    { immediate: true }
  )
}
