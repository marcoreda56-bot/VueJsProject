<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    const user = await authStore.login({
      email: email.value,
      password: password.value,
    })

    if (user) {
      const redirectTo = route.query.redirect

      if (redirectTo) {
        router.push(redirectTo)
      } else {
        if (user.role === 'admin') router.push('/admin/dashboard')
        else if (user.role === 'employer') router.push('/employer/dashboard')
        else router.push('/candidate/dashboard')
      }
    }
  } catch (err) {
    console.error('Login error:', err)
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-slate-950 p-6 font-['Outfit']"
  >
    <div class="w-full max-w-[450px] animate-[fadeIn_0.5s_ease-out]">
      <div class="text-center mb-10">
        <h1 class="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-3">
          Welcome <span class="text-indigo-600">Back.</span>
        </h1>
        <p class="text-slate-400 font-medium">Log in to your HireMasr account</p>
      </div>

      <div
        class="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-500/5"
      >
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Error Message -->
          <div
            v-if="authStore.error"
            class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-widest text-center"
          >
            {{ authStore.error }}
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4"
              >Email Address</label
            >
            <input
              v-model="email"
              type="email"
              required
              class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
              placeholder="name@company.com"
            />
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4"
              >Password</label
            >
            <input
              v-model="password"
              type="password"
              required
              class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <i v-if="authStore.loading" class="pi pi-spin pi-spinner"></i>
            <span v-else>Sign In</span>
          </button>
        </form>

        <div class="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 text-center space-y-3">
          <p class="text-slate-400 text-sm font-medium">
            Don't have an account?
            <router-link to="/register" class="text-indigo-600 font-black hover:underline ml-1"
              >Join Elite</router-link
            >
          </p>
          <router-link to="/auth/forgot-password" class="text-slate-400 text-xs font-medium hover:text-indigo-600 transition-colors">
            Forgot your password?
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
