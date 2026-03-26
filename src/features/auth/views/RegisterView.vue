<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '../components/AuthLayout.vue'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { register, isLoading, error } = useAuth()

const selectedRole = ref('candidate')
const form = reactive({ name: '', email: '', password: '', company_name: '' })

const handleRegister = async () => {
  const success = await register(form, selectedRole.value)
  if (success) router.push({ name: `${selectedRole.value}.dashboard` })
}
</script>

<template>
  <AuthLayout>
    <template #form>
      <div class="space-y-2 mb-8">
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Create account
        </h1>
        <p class="text-slate-500 dark:text-slate-400 font-medium">
          Join our community of professionals today.
        </p>
      </div>

      <!-- Role Selector Toggle -->
      <div class="p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl flex mb-8">
        <button
          v-for="role in [
            { id: 'candidate', label: 'Candidate', icon: 'pi-user' },
            { id: 'employer', label: 'Employer', icon: 'pi-briefcase' }
          ]"
          :key="role.id"
          @click="selectedRole = role.id"
          type="button"
          :class="[
            selectedRole === role.id
              ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          ]"
          class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 font-black text-xs uppercase tracking-widest"
        >
          <i :class="['pi', role.icon]"></i>
          {{ role.label }}
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-5">
        <!-- Dynamic Fields Container with transition -->
        <div class="space-y-5 transition-all duration-500">
          <!-- Full Name -->
          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">
              Full Name
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="John Doe"
              required
              class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-600/20 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
            />
          </div>

          <!-- Company Name (Employer only) -->
          <div v-if="selectedRole === 'employer'" class="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <label class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">
              Company Name
            </label>
            <input
              v-model="form.company_name"
              type="text"
              placeholder="Your Company LLC"
              required
              class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-600/20 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
            />
          </div>

          <!-- Email -->
          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">
              Email Address
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="name@example.com"
              required
              class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-600/20 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
            />
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">
              Password
            </label>
            <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              required
              class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-600/20 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
            />
          </div>
        </div>

        <!-- Error message -->
        <div
          v-if="error"
          class="flex items-center gap-3 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-500/10 p-4 rounded-2xl border border-red-100 dark:border-red-500/20"
        >
          <i class="pi pi-exclamation-circle text-lg"></i>
          <span class="font-bold">{{ error }}</span>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-3 transition-all shadow-xl shadow-indigo-200 dark:shadow-none uppercase tracking-[0.2em] text-xs mt-4"
        >
          <i v-if="isLoading" class="pi pi-spin pi-spinner text-lg"></i>
          <span>{{ isLoading ? 'Creating Account...' : 'Get Started' }}</span>
        </button>
      </form>

      <!-- Footer -->
      <p class="text-center text-sm text-slate-500 dark:text-slate-400 mt-10 font-medium tracking-tight">
        Already have an account?
        <router-link to="/auth/login" class="text-indigo-600 font-black hover:underline underline-offset-4 ml-1"
          >Log in</router-link
        >
      </p>
    </template>

    <template #illustration-icon>
      <div class="relative">
        <div class="absolute -inset-4 bg-purple-500/20 blur-2xl rounded-full"></div>
        <i class="pi pi-sparkles text-6xl text-purple-400 relative z-10"></i>
      </div>
    </template>
    
    <template #illustration-title>Join our community</template>
    <template #illustration-description>
      Whether you're hiring or looking for work, our platform provides the tools you need to succeed in the modern market.
    </template>
  </AuthLayout>
</template>

<style scoped>
.animate-in {
  animation: fadeInDown 0.4s ease-out forwards;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
