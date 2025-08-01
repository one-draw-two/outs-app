export const useViewportDims = () => {
  const checkMobile = () => (useState('viewport-mobile').value = window.innerWidth < 1024)

  onMounted(() => {
    checkMobile()
    const resizeObserver = new ResizeObserver(() => checkMobile())
    resizeObserver.observe(document.documentElement)

    onUnmounted(() => resizeObserver.disconnect())
  })
}
