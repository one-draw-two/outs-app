<template>
  <div
    class="relative flex items-center content-space before:absolute before:h-px before:w-full before:top-1/2 before:left-0"
    :class="[color ? `before:bg-${color}` : 'before:bg-gray-500', isNoPadding ? '' : 'px-2']"
  >
    <div class="relative z-3 left-0 w-full">
      <div class="relative top-px" :class="isNoPadding ? '' : 'px-2'">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  color?: string
  isNoPadding?: boolean
}>()
</script>
