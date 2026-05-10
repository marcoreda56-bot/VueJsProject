<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { authApi } from '@/api/services/api'

const route = useRoute()

const token = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(false)

onMounted(() => {
  token.value = route.query.token || ''
  email.value = route.query.email || ''
})

const handleSubmit = async () => {
  if (password.value !== passwordConfirmation.value) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true
  error.value = null
  try {
    await authApi.resetPassword({
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })
    success.value = true
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to reset password'
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
          New <span class="text-indigo-600">Pass.</span>
        </h1>
        <p class="text-slate-400 font-medium">Set your new password</p>
      </div>

      <div class="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-500/5">
        <div v-if="success" class="text-center py-8">
          <div class="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-check text-emerald-600 text-2xl"></i>
          </div>
          <h3 class="text-lg font-black text-slate-900 dark:text-white mb-2">Password Reset</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Your password has been updated successfully.
          </p>
          <router-link
            to="/login"
            class="inline-block px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all"
          >
            Sign In
          </router-link>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-widest text-center">
            {{ error }}
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Email</label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">New Password</label>
              <input
                v-model="password"
                type="password"
                required
                minlength="8"
                class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
                placeholder="••••••••"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Confirm</label>
              <input
                v-model="passwordConfirmation"
                type="password"
                required
                class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading || !token"
            class="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <i v-if="loading" class="pi pi-spin pi-spinner"></i>
            <span v-else>Reset Password</span>
          </button>
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
