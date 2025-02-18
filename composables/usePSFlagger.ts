interface DataLoaderOptions<T> {
  fetchingStates: Ref<boolean>[]
  dataArrays: Ref<any[]>[]
  transform: (...args: any[]) => T
}

export function usePSFlagger<T>({ fetchingStates, dataArrays, transform }: DataLoaderOptions<T>) {
  const isLoading = ref(true)
  const result = ref<T | null>(null)

  watchEffect(() => {
    const isFetching = fetchingStates.some((state) => state.value)
    const hasData = dataArrays.every((arr) => arr.value?.length >= 0)
    const hasMainData = dataArrays[0].value?.[0] // First array must have at least one item

    if (!isFetching && hasData && hasMainData) {
      result.value = transform(...dataArrays.map((arr) => arr.value))
      isLoading.value = false
    } else {
      isLoading.value = true
    }
  })

  return {
    result,
    isLoading,
  }
}
