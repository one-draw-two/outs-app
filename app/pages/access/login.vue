<template>
  <main class="space-y-8">
    <div class="max-w-md mx-auto flex-center">
      <NuxtLink to="/" class="block">
        <h1 class="text-2xl font-bold text-center mb-8"><img src="/outstanding.svg" class="h-3" alt="Logo" /></h1>
      </NuxtLink>
    </div>

    <form @submit.prevent="handleLogin" class="max-w-md mx-auto space-y-4" ref="formRef" autocomplete="off">
      <div class="space-y-2">
        <label for="email" class="block text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" autocapitalize="none" required class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div class="space-y-2">
        <label for="password" class="block text-sm font-medium">Password</label>
        <input id="password" name="password" type="password" required class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <button type="submit" class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">Login</button>
    </form>
  </main>
</template>
<script setup lang="ts">
definePageMeta({ isPublic: true })
useHead({ title: 'Login' })

const formRef = ref<HTMLFormElement | null>(null)

const handleLogin = async () => {
  if (!formRef.value) return

  const formData = new FormData(formRef.value as any)
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const res = await useSecureFetch('login', 'auth', 'post', { email, password })
  if (res.success) useInitUser(res, useSL(''), true)
}
</script>
