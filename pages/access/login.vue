<template>
  <main class="space-y-8">
    <h1 class="text-2xl font-bold text-center mb-8">Login</h1>

    <form @submit.prevent="handleLogin" class="max-w-md mx-auto space-y-4">
      <div class="space-y-2">
        <label for="email" class="block text-sm font-medium">Email</label>
        <input id="email" autocomplete="email" v-model="email" type="text" required class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div class="space-y-2">
        <label for="password" class="block text-sm font-medium">Password</label>
        <input id="password" v-model="password" type="password" required class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <button type="submit" class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">Login</button>
    </form>

    <div class="text-center">
      <NuxtLink to="/season" class="text-blue-500 hover:underline">Season</NuxtLink>
      <span class="mx-2">|</span>
      <NuxtLink to="/admin" class="text-blue-500 hover:underline">Admin</NuxtLink>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'access', isPublic: true })
useHead({ title: 'Login' })

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  const res = await useSecureFetch('login', 'auth', 'post', { email: email.value, password: password.value })
  if (res.success) useInitUser(res, '/', true)
}
</script>
