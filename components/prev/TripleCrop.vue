<template>
  <div :class="isNoFit ? 'w-fit' : ''" :title="title">
    <div class="box-content" :style="clipStyle" :class="isNoOutline ? '' : `${padding} !bg-black`">
      <div class="box-content" :style="clipStyle" :class="isNoOutline ? '' : `${padding} !bg-white`">
        <div class="box-content" :style="clipStyle" :class="isNoOutline ? '' : `${padding} !bg-black`">
          <div class="box-content" v-bind="$attrs" :style="clipStyle">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// Disabling auto inheritence to prevenet top class (gray outline in this case) receiving the class from the parent element.
// use normal <script> to declare options (https://vuejs.org/guide/components/attrs.html#disabling-attribute-inheritance)
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
const props = defineProps<{
  clip: string
  isNoOutline?: boolean
  isLarge?: boolean
  isNoFit?: boolean
  title?: string
}>()

const padding = computed(() => (props.isLarge ? 'p-[3px]' : 'p-[2px]'))

const clipStyle = ref({
  'clip-path': `url(#${props.clip})`,
})
</script>
