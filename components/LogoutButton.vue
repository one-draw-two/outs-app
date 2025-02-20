<template>
  <button @click="handleLogout" class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">Logout</button>
</template>

<script setup lang="ts">
const handleLogout = async () => {
  const res = await useSecureFetch('logout', 'post', null, null, true)
  console.log(res)
  if (res.success) navigateTo('/access/login')
}
</script>
