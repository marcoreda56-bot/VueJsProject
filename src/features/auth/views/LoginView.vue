<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 px-4">
    <div class="w-full max-w-md bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
        <p class="text-sm text-gray-500 mt-2">Enter your credentials to sign in</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            required
            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition"
          />
        </div>

        <!-- Password -->
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <router-link to="/auth/forgot-password" class="text-xs text-gray-500 hover:text-black"
              >Forgot?</router-link
            >
          </div>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition"
          />
        </div>

        <!-- Error message -->
        <div
          v-if="error"
          class="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100"
        >
          <span class="w-2 h-2 bg-red-500 rounded-full"></span>
          {{ error }}
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-900 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-all"
        >
          <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{{ isLoading ? 'Signing in...' : 'Sign In' }}</span>
        </button>
      </form>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t border-gray-200"></span>
        </div>
        <div class="relative flex justify-center text-xs text-gray-400 uppercase font-medium">
          <span class="bg-white px-2">Or continue with</span>
        </div>
      </div>

      <div class="flex gap-3 justify-center">
        <button
          class="flex-1 flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-100 transition"
        >
          <span class="sr-only">Continue with Google</span>
          G
        </button>
        <button
          class="flex-1 flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-100 transition"
        >
          <span class="sr-only">Continue with Facebook</span>
          F
        </button>
      </div>

      <!-- Footer -->
      <p class="text-center text-sm text-gray-500 mt-6">
        Don't have an account?
        <router-link to="/auth/register" class="text-black font-semibold hover:underline"
          >Sign up</router-link
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuth } from '@/features/auth/composables/useAuth'

const { login, isLoading, error } = useAuth()
const form = reactive({ email: '', password: '' })

const handleLogin = async () => {
  if (!form.email || !form.password) return
  await login(form.email, form.password)
}
</script>
