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
    class="w-full max-w-[450px] bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 animate-in fade-in zoom-in duration-500"
  >
    <div class="text-center mb-10">
      <div
        class="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl mb-6 border border-gray-100 shadow-sm"
      >
        <span class="text-3xl">✨</span>
      </div>
      <h2 class="text-3xl font-black text-gray-900 tracking-tight">Get Started</h2>
      <p class="text-gray-400 mt-2 font-medium">Create your professional account</p>
    </div>

    <div v-if="step === 0" class="space-y-4">
      <div
        @click="selectedRole = 'candidate'"
        :class="
          selectedRole === 'candidate'
            ? 'border-black bg-gray-50 ring-1 ring-black'
            : 'border-gray-100 bg-white hover:border-gray-300'
        "
        class="flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 group"
      >
        <div
          :class="
            selectedRole === 'candidate'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-400 group-hover:bg-black group-hover:text-white'
          "
          class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors text-xl"
        >
          👤
        </div>
        <div class="ml-4">
          <p class="font-bold text-gray-900 text-lg leading-tight">Candidate</p>
          <p class="text-gray-400 text-sm mt-1">I want to find work</p>
        </div>
      </div>

      <div
        @click="selectedRole = 'employer'"
        :class="
          selectedRole === 'employer'
            ? 'border-black bg-gray-50 ring-1 ring-black'
            : 'border-gray-100 bg-white hover:border-gray-300'
        "
        class="flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 group"
      >
        <div
          :class="
            selectedRole === 'employer'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-400 group-hover:bg-black group-hover:text-white'
          "
          class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors text-xl"
        >
          💼
        </div>
        <div class="ml-4">
          <p class="font-bold text-gray-900 text-lg leading-tight">Employer</p>
          <p class="text-gray-400 text-sm mt-1">I want to hire talent</p>
        </div>
      </div>

      <button
        @click="step = 1"
        class="w-full mt-8 py-4 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-black/10"
      >
        Next Step
      </button>
    </div>

    <form v-else @submit.prevent="handleRegister" class="space-y-5">
      <button
        @click="step = 0"
        type="button"
        class="text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest mb-4 inline-flex items-center gap-2"
      >
        ← Change Role
      </button>

      <div class="space-y-4">
        <div class="space-y-1.5">
          <label class="text-xs font-black text-gray-900 uppercase tracking-widest ml-1"
            >Full Name</label
          >
          <input
            v-model="form.name"
            type="text"
            placeholder="Marco Reda"
            class="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300 font-semibold"
            required
          />
        </div>

        <div v-if="selectedRole === 'employer'" class="space-y-1.5">
          <label class="text-xs font-black text-gray-900 uppercase tracking-widest ml-1"
            >Company Name</label
          >
          <input
            v-model="form.company_name"
            type="text"
            placeholder="Your Agency"
            class="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300 font-semibold"
            required
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-black text-gray-900 uppercase tracking-widest ml-1"
            >Email</label
          >
          <input
            v-model="form.email"
            type="email"
            placeholder="name@email.com"
            class="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300 font-semibold"
            required
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-black text-gray-900 uppercase tracking-widest ml-1"
            >Password</label
          >
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            class="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300 font-semibold"
            required
          />
          <div class="flex gap-1.5 mt-2 px-1">
            <div
              v-for="i in 3"
              :key="i"
              :class="i <= passwordStrength ? 'bg-black' : 'bg-gray-100'"
              class="h-1 flex-1 rounded-full transition-all"
            ></div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 disabled:bg-gray-200 transition-all mt-6 shadow-xl shadow-black/10 flex justify-center items-center gap-3"
      >
        <span v-if="isLoading" class="animate-spin text-xl">⏳</span>
        {{ isLoading ? 'Creating Account...' : 'Create Account' }}
      </button>
    </form>

    <p class="text-center text-sm text-gray-400 font-medium mt-10">
      Already have an account?
      <router-link to="/auth/login" class="text-black font-black hover:underline"
        >Log in</router-link
      >
    </p>
  </div>
</template>
