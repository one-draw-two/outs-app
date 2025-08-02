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
const ROW_HEIGHT = { mobile: 64, desktop: 64 }

const backgroundGradientStyle = computed(() => {
  const rowHeight = useState('viewport-mobile').value ? ROW_HEIGHT.mobile : ROW_HEIGHT.desktop
  const blockHeight = props.isDetailsOn ? props.headerRepeatInterval * rowHeight + HEADER_HEIGHT : rowHeight + HEADER_HEIGHT

  return {
    backgroundImage: `${
      props.isDetailsOn ? 'repeating-' : ''
    }linear-gradient(to bottom,var(--table-row-header-color) 0,var(--table-row-header-color) ${HEADER_HEIGHT}px,transparent ${HEADER_HEIGHT}px${
      props.isDetailsOn ? `,transparent ${blockHeight}px` : ''
    })`,
    backgroundSize: props.isDetailsOn ? `100% ${blockHeight}px` : '100%',
    backgroundAttachment: 'local',
    backgroundRepeat: props.isDetailsOn ? 'repeat' : 'no-repeat',
  }
})
</script>
