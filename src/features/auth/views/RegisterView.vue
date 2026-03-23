<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { register, isLoading, error } = useAuth()

const step = ref(0)
const selectedRole = ref('candidate')
const form = reactive({ name: '', email: '', password: '', company_name: '' })

const handleRegister = async () => {
  const success = await register(form, selectedRole.value)
  if (success) router.push({ name: `${selectedRole.value}.dashboard` })
}

const passwordStrength = computed(() => {
  if (!form.password) return 0
  if (form.password.length < 6) return 1
  if (form.password.length < 10) return 2
  return 3
})
</script>

<template>
  <div
    class="w-full max-w-[460px] bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 animate-[fadeIn_0.5s_ease-out]"
  >
    <div class="text-center mb-10">
      <div
        class="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl mb-6 border border-indigo-100 dark:border-indigo-500/20 shadow-inner"
      >
        <span class="text-2xl animate-pulse">✨</span>
      </div>
      <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
        Get Started
      </h2>
      <p class="text-slate-400 dark:text-slate-500 mt-3 font-semibold text-sm">
        Create your professional account
      </p>
    </div>

    <div v-if="step === 0" class="space-y-4 animate-[slideIn_0.4s_ease-out]">
      <div
        v-for="role in [
          { id: 'candidate', title: 'Candidate', desc: 'I want to find work', icon: '👤' },
          { id: 'employer', title: 'Employer', desc: 'I want to hire talent', icon: '💼' },
        ]"
        :key="role.id"
        @click="selectedRole = role.id"
        :class="
          selectedRole === role.id
            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/5 ring-1 ring-indigo-600 shadow-lg shadow-indigo-600/5'
            : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-200'
        "
        class="flex items-center p-5 border-2 rounded-[2rem] cursor-pointer transition-all duration-300 group"
      >
        <div
          :class="
            selectedRole === role.id
              ? 'bg-indigo-600 text-white scale-110'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
          "
          class="w-14 h-14 rounded-2xl flex items-center justify-center transition-all text-2xl shadow-sm"
        >
          {{ role.icon }}
        </div>
        <div class="ml-5">
          <p class="font-black text-slate-900 dark:text-white text-lg tracking-tight">
            {{ role.title }}
          </p>
          <p
            class="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mt-0.5"
          >
            {{ role.desc }}
          </p>
        </div>
      </div>

      <button
        @click="step = 1"
        class="w-full mt-8 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-black dark:hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-200 dark:shadow-none"
      >
        Continue
      </button>
    </div>

    <form v-else @submit.prevent="handleRegister" class="space-y-6 animate-[slideIn_0.4s_ease-out]">
      <button
        @click="step = 0"
        type="button"
        class="group text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-2 transition-colors"
      >
        <i class="pi pi-arrow-left group-hover:-translate-x-1 transition-transform"></i>
        Change Role
      </button>

      <div class="space-y-5">
        <div
          v-for="field in selectedRole === 'employer'
            ? ['name', 'company_name', 'email', 'password']
            : ['name', 'email', 'password']"
          :key="field"
          class="space-y-2"
        >
          <label
            class="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2"
          >
            {{ field.replace('_', ' ') }}
          </label>
          <input
            v-model="form[field]"
            :type="field === 'password' ? 'password' : 'text'"
            :placeholder="
              field === 'password' ? '••••••••' : 'Enter your ' + field.replace('_', ' ')
            "
            class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-600/20 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-300"
            required
          />
          <div v-if="field === 'password'" class="flex gap-1.5 mt-3 px-1">
            <div
              v-for="i in 3"
              :key="i"
              :class="[
                i <= passwordStrength
                  ? passwordStrength === 1
                    ? 'bg-red-400'
                    : passwordStrength === 2
                      ? 'bg-amber-400'
                      : 'bg-green-500'
                  : 'bg-slate-100 dark:bg-slate-800',
              ]"
              class="h-1.5 flex-1 rounded-full transition-all duration-500"
            ></div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-indigo-700 disabled:opacity-50 transition-all mt-4 shadow-xl shadow-indigo-200 dark:shadow-none flex justify-center items-center gap-3"
      >
        <i v-if="isLoading" class="pi pi-spin pi-spinner text-lg"></i>
        {{ isLoading ? 'Processing...' : 'Create Account' }}
      </button>
    </form>

    <p class="text-center text-xs text-slate-400 font-black uppercase tracking-widest mt-10">
      Joined before?
      <router-link to="/auth/login" class="text-indigo-600 hover:underline underline-offset-4 ml-1"
        >Log in</router-link
      >
    </p>
  </div>
</template>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
