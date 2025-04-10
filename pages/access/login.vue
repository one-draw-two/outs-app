<template>
  <main class="space-y-8">
    <h1 class="text-2xl font-bold text-center mb-8">Login</h1>

    <form @submit.prevent="handleLogin" class="max-w-md mx-auto space-y-4" ref="formRef" autocomplete="off">
      <div class="space-y-2">
        <label for="ema" class="block text-sm font-medium">Email</label>
        <input id="ema" name="ema" type="email" autocapitalize="none" required class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div class="space-y-2">
        <label for="pwd" class="block text-sm font-medium">Password</label>
        <input id="pwd" name="pwd" type="pwd" required class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
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

const formRef = ref<HTMLFormElement | null>(null)

const handleLogin = async () => {
  if (!formRef.value) return

  const formData = new FormData(formRef.value as any)
  const email = formData.get('ema') as string
  const password = formData.get('pwd') as string

  const res = await useSecureFetch('login', 'auth', 'post', { email, password })
  if (res.success) useInitUser(res, '/', true)
}
</script>
