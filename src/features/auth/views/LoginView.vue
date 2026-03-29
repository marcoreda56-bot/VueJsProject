<template>
  <AuthLayout>
    <template #form>
      <div class="space-y-2 mb-10">
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome back
        </h1>
        <p class="text-slate-500 dark:text-slate-400 font-medium">
          Please enter your details to sign in
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email -->
        <div class="space-y-2">
          <label class="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
            Email address
          </label>
          <div class="relative group">
            <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <i class="pi pi-envelope"></i>
            </span>
            <input
              v-model="form.email"
              type="email"
              placeholder="name@company.com"
              required
              class="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-600/20 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-700"
            />
          </div>
        </div>

        <!-- Password -->
        <div class="space-y-2">
          <div class="flex justify-between items-center px-1">
            <label class="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Password
            </label>
            <router-link to="/auth/forgot-password" class="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >Forgot password?</router-link
            >
          </div>
          <div class="relative group">
            <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <i class="pi pi-lock"></i>
            </span>
            <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              required
              class="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-600/20 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-700"
            />
          </div>
        </div>

        <!-- Options -->
        <div class="flex items-center gap-2 px-1">
          <input 
            type="checkbox" 
            id="remember" 
            class="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-600/20 transition-all cursor-pointer"
          />
          <label for="remember" class="text-sm font-bold text-slate-500 dark:text-slate-400 cursor-pointer">
            Remember for 30 days
          </label>
        </div>

        <!-- Error message -->
        <div
          v-if="error"
          class="flex items-center gap-3 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-500/10 p-4 rounded-2xl border border-red-100 dark:border-red-500/20 animate-shake"
        >
          <i class="pi pi-exclamation-circle text-lg"></i>
          <span class="font-bold">{{ error }}</span>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 transition-all shadow-xl shadow-indigo-200 dark:shadow-none uppercase tracking-widest text-sm"
        >
          <i v-if="isLoading" class="pi pi-spin pi-spinner text-lg"></i>
          <span>{{ isLoading ? 'Signing in...' : 'Sign In' }}</span>
        </button>
      </form>

      <!-- Divider -->
      <div class="relative my-10">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t border-slate-100 dark:border-slate-800"></span>
        </div>
        <div class="relative flex justify-center text-[10px] text-slate-400 uppercase font-black tracking-widest">
          <span class="bg-white dark:bg-slate-950 px-4">Or continue with</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <button
          class="flex items-center justify-center gap-3 py-3.5 border-2 border-slate-50 dark:border-slate-900 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-bold text-slate-600 dark:text-slate-300"
        >
          <i class="pi pi-google text-red-500"></i>
          Google
        </button>
        <button
          class="flex items-center justify-center gap-3 py-3.5 border-2 border-slate-50 dark:border-slate-900 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-bold text-slate-600 dark:text-slate-300"
        >
          <i class="pi pi-facebook text-blue-600"></i>
          Facebook
        </button>
      </div>

      <!-- Footer -->
      <p class="text-center text-sm text-slate-500 dark:text-slate-400 mt-10 font-medium">
        Don't have an account?
        <router-link to="/auth/register" class="text-indigo-600 font-black hover:underline underline-offset-4 ml-1"
          >Sign up</router-link
        >
      </p>
    </template>

    <template #illustration-icon>
      <div class="relative">
        <div class="absolute -inset-4 bg-indigo-500/20 blur-2xl rounded-full"></div>
        <i class="pi pi-shield text-6xl text-indigo-400 relative z-10"></i>
      </div>
    </template>
    
    <template #illustration-title>Welcome back</template>
    <template #illustration-description>
      Experience the next generation of job searching with our secure and intelligent platform.
    </template>
  </AuthLayout>
</template>

<script setup>
import { reactive } from 'vue'
import AuthLayout from '../components/AuthLayout.vue'
import { useAuth } from '@/features/auth/composables/useAuth'

const { login, isLoading, error } = useAuth()
const form = reactive({ email: '', password: '' })

const handleLogin = async () => {
  if (!form.email || !form.password) return
  await login(form.email, form.password)
}
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>
