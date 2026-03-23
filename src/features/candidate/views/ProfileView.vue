<template>
  <div
    class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 py-12 px-4 lg:px-12 font-['Plus_Jakarta_Sans',sans-serif]"
  >
    <div class="max-w-5xl mx-auto animate-[fadeIn_0.8s_ease-out]">
      <div
        class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-sm mb-10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden"
      >
        <div
          class="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full"
        ></div>

        <div class="relative group">
          <div
            class="w-40 h-40 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-5xl group-hover:border-indigo-500 transition-all duration-500 cursor-pointer overflow-hidden shadow-inner"
          >
            <span class="group-hover:scale-110 transition-transform duration-500">📸</span>
          </div>
          <div
            class="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform"
          >
            <i class="pi pi-pencil text-xs"></i>
          </div>
        </div>

        <div class="flex-1 text-center md:text-left z-10">
          <div class="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 class="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic">
              {{ profile.name }}
            </h1>
            <span
              class="inline-flex items-center px-4 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 dark:border-emerald-500/20 w-fit mx-auto md:mx-0"
            >
              Verified Talent
            </span>
          </div>

          <p
            class="text-indigo-600 dark:text-indigo-400 font-black text-xl italic tracking-tight mb-6"
          >
            {{ profile.title }}
          </p>

          <div class="flex flex-wrap justify-center md:justify-start gap-6">
            <span
              class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2"
            >
              <i class="pi pi-map-marker text-indigo-500"></i> {{ profile.location }}
            </span>
            <span
              class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2"
            >
              <i class="pi pi-envelope text-indigo-500"></i>
              {{ user?.email || 'marco@hiremasr.com' }}
            </span>
          </div>
        </div>

        <button
          @click="isEditing = !isEditing"
          :class="
            isEditing
              ? 'bg-rose-50 text-rose-600 border-rose-100'
              : 'bg-slate-900 dark:bg-indigo-600 text-white border-transparent'
          "
          class="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center gap-3 border"
        >
          <i :class="isEditing ? 'pi pi-times' : 'pi pi-user-edit'"></i>
          {{ isEditing ? 'Cancel' : 'Edit Profile' }}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div class="lg:col-span-4 space-y-10">
          <div
            class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm"
          >
            <h3
              class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center justify-between"
            >
              Core Skills
              <i class="pi pi-bolt text-indigo-500"></i>
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in profile.skills"
                :key="skill"
                class="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black rounded-xl border border-transparent hover:border-indigo-500/30 hover:bg-white dark:hover:bg-slate-700 transition-all cursor-default uppercase tracking-widest"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-8 space-y-10">
          <div
            class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden"
          >
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">
              Professional Summary
            </h3>

            <div v-if="!isEditing">
              <p
                class="text-slate-600 dark:text-slate-400 leading-relaxed font-bold text-lg italic tracking-tight"
              >
                "{{ profile.bio }}"
              </p>
            </div>
            <div v-else class="space-y-6 animate-in fade-in duration-500">
              <textarea
                v-model="profile.bio"
                rows="4"
                class="w-full p-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[2rem] focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-900 dark:text-white"
              ></textarea>
              <button
                @click="saveProfile"
                class="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
              >
                Save Biography
              </button>
            </div>
          </div>

          <div
            class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm"
          >
            <div class="flex justify-between items-center mb-10">
              <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Work Experience
              </h3>
              <button
                class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 hover:scale-110 transition-transform"
              >
                <i class="pi pi-plus text-xs"></i>
              </button>
            </div>

            <div class="space-y-12">
              <div
                v-for="exp in profile.experience"
                :key="exp.id"
                class="flex gap-8 items-start group"
              >
                <div
                  class="w-16 h-16 bg-slate-900 dark:bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center font-black text-xl shadow-lg group-hover:rotate-6 transition-transform"
                >
                  {{ exp.company.charAt(0) }}
                </div>
                <div
                  class="flex-1 border-b border-slate-50 dark:border-slate-800 pb-8 group-last:border-none"
                >
                  <div class="flex justify-between items-start mb-2">
                    <h4
                      class="font-black text-slate-900 dark:text-white text-2xl tracking-tighter italic"
                    >
                      {{ exp.role }}
                    </h4>
                    <span
                      class="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-lg italic"
                    >
                      {{ exp.period }}
                    </span>
                  </div>
                  <p class="text-slate-400 font-bold text-sm tracking-widest uppercase mb-4">
                    {{ exp.company }}
                  </p>
                  <p class="text-slate-500 text-sm font-medium leading-relaxed">
                    Lead development of scalable features and optimized database queries for
                    high-performance applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

const auth = useAuthStore()
const user = auth.user

const isEditing = ref(false)

const profile = reactive({
  name: user?.name || 'Marco Reda',
  title: 'Full Stack Developer',
  bio: 'Passionate about building clean, scalable web applications with Vue.js, Node.js, and Laravel. Expert in crafting seamless terminal UIs and high-performance databases.',
  location: 'Cairo, Egypt',
  skills: [
    'Vue.js',
    'Angular',
    'Laravel',
    'Node.js',
    'PostgreSQL',
    'Bash Scripting',
    'Tailwind CSS',
  ],
  experience: [
    { id: 1, company: 'Freelance Hub', role: 'Full Stack Engineer', period: '2025 - Present' },
    { id: 2, company: 'Tech Startup', role: 'Frontend Intern', period: '2024 - 2025' },
  ],
})

const saveProfile = () => {
  isEditing.value = false
  // Logic to call API: profilesApi.updateCandidate(profile)
  console.log('Profile Syncronized!', profile)
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
