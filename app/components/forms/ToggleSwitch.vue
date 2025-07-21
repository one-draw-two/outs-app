<template>
  <button
    tabindex="-1"
    type="button"
    class="inline-flex shrink-0 rounded-full cursor-pointer transition-colors ease-in-out duration-200 shadow focus:bg-red-500 ring-white/20 ring-2 h-4 w-8"
    :class="[isOnLocal ? 'bg-blue-500' : 'bg-gray-500']"
    @click="change()"
  >
    <span
      class="pointer-events-none relative inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 h-4 w-4"
      :class="[isOnLocal ? 'translate-x-full' : 'translate-x-0']"
    >
    </span>
    <input class="hidden" type="text" v-model="isOnLocal" />
  </button>
</template>

<script lang="ts" setup>
/*
const props = defineProps<{
  inputDef: INPUTDEF
}>()
*/

const emit = defineEmits(['change'])
const isOnLocal = ref(false)

const change = () => {
  isOnLocal.value = !isOnLocal.value
  emit('change', isOnLocal.value)
}
</script>
