<template>
  <div class="bg-inherit relative flex items-center" :class="[containerClass]">
    <div class="absolute h-px w-full top-1/2 left-0" :class="lineClass"></div>
    <div class="bg-inherit z-1" :class="[contentClass, offsetClass]">
      <div :class="[paddingClass, textClass]" class="bg-inherit">
        <div class="relative -top-px">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  color?: string
  textColor?: string
  variant?: 'default' | 'subtle' | 'bold'
  alignment?: 'left' | 'center' | 'right'
  padding?: number
  offset?: number
}

const props = withDefaults(defineProps<Props>(), {
  color: 'gray-300',
  textColor: 'gray-700',
  variant: 'default',
  alignment: 'center',
  padding: 2,
  offset: 0,
})

const lineClass = computed(() => `bg-${props.color} ${props.variant === 'subtle' ? 'opacity-30' : props.variant === 'bold' ? 'opacity-80' : 'opacity-50'}`)
const textClass = computed(() => `text-${props.textColor}`)
const paddingClass = computed(() => `px-${props.padding}`)
const contentClass = computed(() => (props.alignment === 'left' ? 'mr-auto' : props.alignment === 'right' ? 'ml-auto' : 'mx-auto'))
const containerClass = computed(() => (props.alignment === 'center' ? 'justify-center' : 'justify-start'))
const offsetClass = computed(() => (!props.offset || props.alignment === 'center' ? '' : `${props.alignment === 'left' ? 'ml' : 'mr'}-${props.offset}`))
</script>
