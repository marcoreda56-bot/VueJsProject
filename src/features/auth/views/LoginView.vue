<template>
  <div
    class="w-full max-w-[450px] bg-white p-8 md:p-12 rounded-[2.5rem] shadow-lg border border-gray-100"
  >
    <div class="text-center mb-10">
      <div
        class="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl mb-6 border border-gray-100 shadow-sm font-bold text-2xl"
      >
        👋
      </div>
      <h2 class="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
      <p class="text-gray-400 mt-2 font-medium">Log in to your dashboard</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <!-- Email -->
      <div class="space-y-1.5">
        <label class="text-xs font-black text-gray-900 uppercase tracking-widest ml-1">Email</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="marco@example.com"
          required
          class="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none transition-all font-semibold"
        />
      </div>

      <!-- Password -->
      <div class="space-y-1.5">
        <div class="flex justify-between px-1">
          <label class="text-xs font-black text-gray-900 uppercase tracking-widest">Password</label>
          <router-link
            to="/auth/forgot-password"
            class="text-[10px] font-black text-gray-300 hover:text-black uppercase tracking-wider"
            >Forgot?</router-link
          >
        </div>
        <input
          v-model="form.password"
          type="password"
          placeholder="••••••••"
          required
          class="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none transition-all font-semibold"
        />
      </div>

      <!-- Error -->
      <div
        v-if="error"
        class="text-red-500 text-xs font-bold bg-red-50 p-4 rounded-xl border border-red-100"
      >
        {{ error }}
      </div>

      <!-- Button -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all shadow-xl shadow-black/10 flex justify-center items-center gap-3"
      >
        <span v-if="isLoading" class="animate-spin text-xl">⏳</span>
        {{ isLoading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>

    <p class="text-center text-sm text-gray-400 font-medium mt-10">
      New here?
      <router-link to="/auth/register" class="text-black font-black hover:underline"
        >Create Account</router-link
      >
    </p>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { login, isLoading, error } = useAuth()

const form = reactive({ email: '', password: '' })

const handleLogin = async () => {
  if (!form.email || !form.password) return
  await login(form.email, form.password)
}
</script>
