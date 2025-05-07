export function useKeyboard() {
  const isKeyboardListenerActive = ref(false)
  onMounted(() => {
    if (!import.meta.env.SSR && !isKeyboardListenerActive.value) {
      document?.addEventListener('keyup', keyboardFunc, false)
      isKeyboardListenerActive.value = true
    }
  })

  onBeforeUnmount(() => {
    if (!import.meta.env.SSR && isKeyboardListenerActive.value) {
      document?.removeEventListener('keyup', keyboardFunc, false)
      isKeyboardListenerActive.value = false
    }
  })

  const keyboardFunc = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      useState<boolean>('isUserOverlayOpen').value = false
    }
  }
}
