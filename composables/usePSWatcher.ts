export const useLoadingWatcher = <T>(isLoading: Ref<boolean>, data: Ref<T>, label: string = 'Data') => {
  watch(
    isLoading,
    (loading) => {
      if (!loading) console.log(`${label}:`, data.value)
    },
    { immediate: true }
  )
}
