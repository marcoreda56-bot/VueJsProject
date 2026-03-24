<template>
  <div class="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7 sm:p-8 animate-[fadeIn_0.3s_ease-out]">
    <div class="mb-8">
      <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Sign in</h2>
      <p class="text-sm mt-2 text-slate-500 dark:text-slate-400">Access your account dashboard.</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-5">
      <div class="space-y-2">
        <label for="login-email" class="text-xs font-bold text-slate-600 dark:text-slate-300">Email</label>
        <input
          id="login-email"
          v-model.trim="form.email"
          type="email"
          placeholder="you@example.com"
          required
          :aria-invalid="Boolean(fieldErrors.email)"
          class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-xl outline-none transition-all font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
          :class="
            fieldErrors.email
              ? 'border-red-300 dark:border-red-500/40 focus:ring-4 focus:ring-red-500/10'
              : 'border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-sky-600/20 focus:ring-4 focus:ring-sky-600/5'
          "
        />
        <p v-if="fieldErrors.email" class="text-xs font-semibold text-red-500 px-1">
          {{ fieldErrors.email }}
        </p>
      </div>

      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <label for="login-password" class="text-xs font-bold text-slate-600 dark:text-slate-300">Password</label>
          <router-link
            to="/auth/forgot-password"
            class="text-xs font-semibold text-slate-400 hover:text-sky-600"
          >
            Forgot?
          </router-link>
        </div>
        <div class="relative">
          <input
            id="login-password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            required
            :aria-invalid="Boolean(fieldErrors.password)"
            class="w-full px-4 py-3 pr-20 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-xl outline-none transition-all font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
            :class="
              fieldErrors.password
                ? 'border-red-300 dark:border-red-500/40 focus:ring-4 focus:ring-red-500/10'
                : 'border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-sky-600/20 focus:ring-4 focus:ring-sky-600/5'
            "
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-sky-600 transition-colors"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? 'Hide' : 'Show' }}
          </button>
        </div>
        <p v-if="fieldErrors.password" class="text-xs font-semibold text-red-500 px-1">
          {{ fieldErrors.password }}
        </p>
      </div>

      <div
        v-if="error"
        class="flex items-center gap-2 text-red-600 dark:text-red-300 text-sm bg-red-50 dark:bg-red-500/10 p-3 rounded-xl border border-red-100 dark:border-red-500/20"
      >
        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
        {{ error }}
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full py-3.5 bg-sky-600 text-white rounded-xl font-black text-sm uppercase tracking-[0.16em] hover:bg-sky-700 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
      >
        <i v-if="isLoading" class="pi pi-spin pi-spinner text-lg"></i>
        <span>{{ isLoading ? 'Signing in...' : 'Sign In' }}</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/features/auth/composables/useAuth'

const route = useRoute()
const { login, isLoading, error } = useAuth()
const form = reactive({ email: '', password: '' })
const showPassword = ref(false)
const fieldErrors = reactive({ email: '', password: '' })

const validate = () => {
  fieldErrors.email = ''
  fieldErrors.password = ''

  if (!form.email) fieldErrors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    fieldErrors.email = 'Enter a valid email address'

  if (!form.password) fieldErrors.password = 'Password is required'
  else if (form.password.length < 6) fieldErrors.password = 'Use at least 6 characters'

  return !fieldErrors.email && !fieldErrors.password
}

const handleLogin = async () => {
  if (!validate()) return
  await login(form.email, form.password)
}
</script>

<style></style>
