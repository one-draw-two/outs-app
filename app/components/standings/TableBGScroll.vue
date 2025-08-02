<template>
  <div class="overflow-x-scroll hide-scroll" :style="backgroundGradientStyle">
    <TransitionGroup tag="div" name="standing-row">
      <slot />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isDetailsOn: boolean
  headerRepeatInterval: number
}>()

const HEADER_HEIGHT = 64
const ROW_HEIGHT = { mobile: 64, desktop: 40 }

const backgroundGradientStyle = computed(() => {
  if (!props.isDetailsOn) return { backgroundImage: 'none' }

  const rowHeight = useState('viewport-mobile').value ? ROW_HEIGHT.mobile : ROW_HEIGHT.desktop
  const blockHeight = props.headerRepeatInterval * rowHeight + HEADER_HEIGHT

  return {
    backgroundImage: `
      repeating-linear-gradient(
        to bottom,
        var(--table-row-header-color) 0,
        var(--table-row-header-color) ${HEADER_HEIGHT}px,
        transparent ${HEADER_HEIGHT}px,
        transparent ${blockHeight}px
      )
    `,
    backgroundSize: `100% ${blockHeight}px`,
    backgroundAttachment: 'local',
    backgroundRepeat: 'repeat',
  }
})
</script>
