<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { register, isLoading, error } = useAuth()

const selectedRole = ref(route.query.role === 'employer' ? 'employer' : 'candidate')
const form = reactive({ name: '', email: '', password: '', company_name: '' })
const showPassword = ref(false)
const fieldErrors = reactive({ name: '', email: '', password: '', company_name: '' })

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

const isFormValid = computed(() => {
  const hasBasics = form.name.trim() && form.email.trim() && form.password
  const hasCompany = selectedRole.value === 'employer' ? form.company_name.trim() : true
  return Boolean(hasBasics && hasCompany && passwordStrength.value > 1)
})

const validateForm = () => {
  fieldErrors.name = ''
  fieldErrors.email = ''
  fieldErrors.password = ''
  fieldErrors.company_name = ''

  if (!form.name.trim()) fieldErrors.name = 'Name is required'
  if (selectedRole.value === 'employer' && !form.company_name.trim())
    fieldErrors.company_name = 'Company name is required'

  if (!form.email.trim()) fieldErrors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    fieldErrors.email = 'Enter a valid email address'

  if (!form.password) fieldErrors.password = 'Password is required'
  else if (form.password.length < 6) fieldErrors.password = 'Use at least 6 characters'
  else if (form.password.length < 10)
    fieldErrors.password = 'Use 10+ characters for better security'

  return Object.values(fieldErrors).every((msg) => !msg)
}

const submitRegistration = () => {
  if (!validateForm()) return
  handleRegister()
}

watch(
  () => route.query.role,
  (role) => {
    selectedRole.value = role === 'employer' ? 'employer' : 'candidate'
  },
  { immediate: true },
)
</script>

<template>
  <div class="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7 sm:p-8 animate-[fadeIn_0.3s_ease-out]">
    <div class="mb-7">
      <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Create account</h2>
      <p class="text-sm mt-2 text-slate-500 dark:text-slate-400">Set up your profile in less than a minute.</p>
    </div>

    <div class="mb-6 rounded-xl border border-slate-200 dark:border-slate-700 p-1 grid grid-cols-2 gap-1">
      <button
        type="button"
        @click="selectedRole = 'candidate'"
        class="py-2.5 rounded-lg text-xs font-black uppercase tracking-[0.14em]"
        :class="
          selectedRole === 'candidate'
            ? 'bg-sky-600 text-white'
            : 'text-slate-500 hover:text-sky-600 dark:text-slate-400'
        "
      >
        Candidate
      </button>
      <button
        type="button"
        @click="selectedRole = 'employer'"
        class="py-2.5 rounded-lg text-xs font-black uppercase tracking-[0.14em]"
        :class="
          selectedRole === 'employer'
            ? 'bg-sky-600 text-white'
            : 'text-slate-500 hover:text-sky-600 dark:text-slate-400'
        "
      >
        Employer
      </button>
    </div>

    <form @submit.prevent="submitRegistration" class="space-y-5">
      <div class="space-y-4">
        <div
          v-for="field in selectedRole === 'employer'
            ? ['name', 'company_name', 'email', 'password']
            : ['name', 'email', 'password']"
          :key="field"
          class="space-y-2"
        >
          <label class="text-xs font-bold text-slate-600 dark:text-slate-300">
            {{ field.replace('_', ' ') }}
          </label>
          <div class="relative">
            <input
              v-model.trim="form[field]"
              :type="field === 'password' ? (showPassword ? 'text' : 'password') : 'text'"
              :placeholder="
                field === 'password' ? '••••••••' : 'Enter your ' + field.replace('_', ' ')
              "
              class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-xl outline-none transition-all font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
              :class="
                fieldErrors[field]
                  ? 'border-red-300 dark:border-red-500/40 focus:ring-4 focus:ring-red-500/10'
                  : 'border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-sky-600/20 focus:ring-4 focus:ring-sky-600/5'
              "
              required
            />
            <button
              v-if="field === 'password'"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-sky-600 transition-colors"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
          <p v-if="fieldErrors[field]" class="text-xs font-semibold text-red-500 px-1">
            {{ fieldErrors[field] }}
          </p>
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

      <div
        v-if="error"
        class="flex items-center gap-2 text-red-600 dark:text-red-300 text-sm bg-red-50 dark:bg-red-500/10 p-3 rounded-xl border border-red-100 dark:border-red-500/20"
      >
        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
        {{ error }}
      </div>

      <button
        type="submit"
        :disabled="isLoading || !isFormValid"
        class="w-full py-3.5 bg-sky-600 text-white rounded-xl font-black text-sm uppercase tracking-[0.16em] hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
      >
        <i v-if="isLoading" class="pi pi-spin pi-spinner text-lg"></i>
        {{ isLoading ? 'Processing...' : 'Create Account' }}
      </button>
    </form>
  </div>
</template>

<style></style>
