<template>
  <div class="relative flex items-center" :class="[containerClass]">
    <div class="z-1 absolute h-px w-full top-1/2 left-0" :class="lineClass"></div>
    <div class="relative z-10 mx-auto -top-px" :class="contentClass">
      <div class="" :class="[backgroundClass, textClass, paddingClass]">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  color?: string
  backgroundColor?: string
  textColor?: string
  variant?: 'default' | 'subtle' | 'bold'
  alignment?: 'left' | 'center' | 'right'
  padding?: number
}

const props = withDefaults(defineProps<Props>(), {
  color: 'gray-300',
  backgroundColor: 'white',
  textColor: 'gray-700',
  variant: 'default',
  alignment: 'center',
  padding: 2,
})

const lineClass = computed(() => `bg-${props.color} ${props.variant === 'subtle' ? 'opacity-30' : props.variant === 'bold' ? 'opacity-80' : 'opacity-50'}`)
const backgroundClass = computed(() => `bg-${props.backgroundColor}`)
const textClass = computed(() => `text-${props.textColor}`)
const paddingClass = computed(() => `px-${props.padding}`)
const contentClass = computed(() => (props.alignment === 'left' ? 'mr-auto ml-0' : props.alignment === 'right' ? 'ml-auto mr-0' : 'mx-auto'))
const containerClass = computed(() => (props.alignment === 'center' ? 'justify-center' : 'justify-start'))
</script>
