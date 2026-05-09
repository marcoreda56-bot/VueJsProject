<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'candidate',
})

const handleRegister = async () => {
  try {
    await authStore.register(form.value)

    if (!authStore.error) {
      if (form.value.role === 'employer') {
        router.push('/employer/dashboard')
      } else {
        router.push('/candidate/dashboard')
      }
    }
  } catch (err) {
    console.error('Registration process failed:', err)
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-slate-950 p-6 font-['Outfit']"
  >
    <div class="w-full max-w-[550px] animate-[fadeIn_0.5s_ease-out]">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-3">
          Join <span class="text-indigo-600">Elite.</span>
        </h1>
        <p class="text-slate-400 font-medium">Create your HireMasr professional account</p>
      </div>

      <div
        class="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-500/5"
      >
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Error Alert -->
          <div
            v-if="authStore.error"
            class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest text-center"
          >
            {{ authStore.error }}
          </div>

          <!-- Role Selection -->
          <div class="grid grid-cols-2 gap-4">
            <button
              type="button"
              @click="form.role = 'candidate'"
              :class="
                form.role === 'candidate'
                  ? 'bg-indigo-600 text-white shadow-indigo-600/20'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
              "
              class="py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg"
            >
              Candidate
            </button>
            <button
              type="button"
              @click="form.role = 'employer'"
              :class="
                form.role === 'employer'
                  ? 'bg-indigo-600 text-white shadow-indigo-600/20'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
              "
              class="py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg"
            >
              Employer
            </button>
          </div>

          <!-- Name Fields (The Fix) -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4"
                >First Name</label
              >
              <input
                v-model="form.first_name"
                type="text"
                required
                class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
                placeholder="Marco"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4"
                >Last Name</label
              >
              <input
                v-model="form.last_name"
                type="text"
                required
                class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
                placeholder="Reda"
              />
            </div>
          </div>

          <!-- Email -->
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4"
              >Email Address</label
            >
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
              placeholder="name@domain.com"
            />
          </div>

          <!-- Password Fields -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4"
                >Password</label
              >
              <input
                v-model="form.password"
                type="password"
                required
                class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
                placeholder="••••••••"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4"
                >Confirm</label
              >
              <input
                v-model="form.password_confirmation"
                type="password"
                required
                class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <i v-if="authStore.loading" class="pi pi-spin pi-spinner"></i>
            <span v-else>Create Account</span>
          </button>
        </form>

        <!-- Footer Link -->
        <div class="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 text-center">
          <p class="text-slate-400 text-sm font-medium">
            Already have an account?
            <router-link to="/login" class="text-indigo-600 font-black hover:underline ml-1"
              >Sign In</router-link
            >
          </p>
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
