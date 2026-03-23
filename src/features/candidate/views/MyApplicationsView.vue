<template>
  <div
    class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 p-6 lg:p-10 font-['Plus_Jakarta_Sans',sans-serif] animate-[fadeIn_0.6s_ease-out]"
  >
    <header
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
    >
      <div>
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-2">
          Track <span class="text-indigo-600">Applications.</span>
        </h1>
        <p class="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-tight uppercase">
          Stay updated on your <span class="text-indigo-600 italic">career journey</span>.
        </p>
      </div>

      <div
        class="flex gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
      >
        <button
          class="px-4 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest transition-all"
        >
          All ({{ applications.length }})
        </button>
        <button
          class="px-4 py-2 rounded-xl text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-indigo-600 transition-all"
        >
          Interviews
        </button>
      </div>
    </header>

    <div
      v-if="applications.length === 0"
      class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-20 text-center shadow-sm relative overflow-hidden"
    >
      <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full"></div>

      <div
        class="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:rotate-12 transition-transform"
      >
        <i class="pi pi-send text-4xl text-slate-200 dark:text-slate-700"></i>
      </div>
      <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-4">
        No applications yet?
      </h3>
      <p class="text-slate-400 font-bold text-lg mb-10 max-w-sm mx-auto leading-relaxed">
        Your dream job is waiting for you. Start exploring and take the first step!
      </p>
      <router-link
        to="/jobs"
        class="inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-1 transition-all"
      >
        Find Opportunities <i class="pi pi-arrow-right"></i>
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 gap-6">
      <div
        v-for="app in applications"
        :key="app.id"
        class="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 relative overflow-hidden"
      >
        <div
          :class="statusBg(app.status)"
          class="absolute left-0 top-0 bottom-0 w-2 transition-all"
        ></div>

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div class="flex items-center gap-6">
            <div
              class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all"
            >
              {{ app.company.charAt(0) }}
            </div>
            <div>
              <h4
                class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic group-hover:text-indigo-600 transition-colors leading-none mb-2"
              >
                {{ app.role }}
              </h4>
              <p
                class="text-slate-400 font-bold text-sm uppercase tracking-tight flex items-center gap-2"
              >
                {{ app.company }} •
                <span class="text-[10px] text-slate-300">Applied on {{ app.date }}</span>
              </p>
            </div>
          </div>

          <div
            class="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 border-slate-50 dark:border-slate-800 pt-6 md:pt-0"
          >
            <div class="flex flex-col items-end gap-1">
              <span
                :class="statusText(app.status)"
                class="text-[10px] font-black uppercase tracking-[0.2em]"
              >
                {{ app.status }}
              </span>
              <div class="w-32 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  :class="statusBg(app.status)"
                  :style="{ width: app.progress + '%' }"
                  class="h-full rounded-full transition-all duration-1000"
                ></div>
              </div>
            </div>

            <button
              class="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 hover:bg-white transition-all flex items-center justify-center border border-transparent hover:border-slate-100 shadow-sm"
            >
              <i class="pi pi-eye"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const applications = ref([
  {
    id: 1,
    role: 'Senior Vue.js Developer',
    company: 'TechFlow Systems',
    status: 'shortlisted',
    date: 'Mar 15, 2026',
    progress: 75,
  },
  {
    id: 2,
    role: 'UI/UX Designer',
    company: 'CreativePulse',
    status: 'pending',
    date: 'Mar 18, 2026',
    progress: 25,
  },
  {
    id: 3,
    role: 'Backend Laravel Expert',
    company: 'Global Solutions',
    status: 'rejected',
    date: 'Feb 28, 2026',
    progress: 100,
  },
])

const statusBg = (status) => {
  switch (status) {
    case 'shortlisted':
      return 'bg-emerald-500'
    case 'pending':
      return 'bg-amber-500'
    case 'rejected':
      return 'bg-rose-500'
    default:
      return 'bg-slate-400'
  }
}

const statusText = (status) => {
  switch (status) {
    case 'shortlisted':
      return 'text-emerald-500'
    case 'pending':
      return 'text-amber-500'
    case 'rejected':
      return 'text-rose-500'
    default:
      return 'text-slate-400'
  }
}
</script>

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
