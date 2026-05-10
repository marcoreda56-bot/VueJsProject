<script setup>
import { ref } from 'vue'
import { authApi } from '@/api/services/api'

const email = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(false)

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  try {
    await authApi.forgotPassword({ email: email.value })
    success.value = true
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to send reset link'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-slate-950 p-6 font-['Outfit']">
    <div class="w-full max-w-[450px] animate-[fadeIn_0.5s_ease-out]">
      <div class="text-center mb-10">
        <h1 class="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-3">
          Reset <span class="text-indigo-600">Pass.</span>
        </h1>
        <p class="text-slate-400 font-medium">Enter your email to receive a reset link</p>
      </div>

      <div class="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-500/5">
        <div v-if="success" class="text-center py-8">
          <div class="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-check text-emerald-600 text-2xl"></i>
          </div>
          <h3 class="text-lg font-black text-slate-900 dark:text-white mb-2">Check Your Email</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
            If an account exists with this email, you will receive a password reset link shortly.
          </p>
          <router-link
            to="/login"
            class="inline-block px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all"
          >
            Back to Login
          </router-link>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-widest text-center">
            {{ error }}
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Email Address</label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
              placeholder="name@company.com"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <i v-if="loading" class="pi pi-spin pi-spinner"></i>
            <span v-else>Send Reset Link</span>
          </button>

          <div class="text-center">
            <router-link to="/login" class="text-slate-400 text-sm font-medium hover:text-indigo-600 transition-colors">
              Remember your password? Sign in
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
