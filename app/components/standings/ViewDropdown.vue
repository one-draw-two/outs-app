<template>
  <el-dropdown>
    <button type="button" class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
      Summary
      <svg class="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <el-menu anchor="bottom-end" popover class="min-w-[200px] rounded-md bg-white shadow ring-1 ring-black ring-opacity-5 focus:outline-none">
      <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100" type="button">
        <div class="flex justify-between">
          <div>asd</div>
          <FormsToggleSwitch @click.prevent :model-value="isDetailsOn" @change="emit('update:isDetailsOn', !isDetailsOn)" />
        </div>
      </button>
      <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100" type="button">Duplicate</button>
      <hr class="my-1" role="none" />
      <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100" type="button">Archive</button>
      <button class="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 focus:bg-red-50" type="button">Delete</button>
    </el-menu>
  </el-dropdown>
</template>

<script setup lang="ts">
const props = defineProps<{ isDetailsOn: boolean }>()
const emit = defineEmits<{ 'update:isDetailsOn': [value: boolean] }>()
</script>
