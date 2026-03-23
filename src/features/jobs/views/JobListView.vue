<script setup>
import { ref, onMounted } from 'vue'
import { jobsApi } from '@/api/services/api'
import JobCard from '../components/JobCard.vue'

const jobs = ref([])
const isLoading = ref(true)
const error = ref(null)

// 1. Fetch Jobs from API
const fetchJobs = async () => {
  isLoading.value = true
  try {
    const response = await jobsApi.getAll()
    jobs.value = response.data
  } catch (err) {
    error.value = 'Failed to load jobs. Please try again later.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchJobs)
</script>

<template>
  <div
    class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 py-16 px-6 lg:px-12 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden"
  >
    <div
      class="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"
    ></div>

    <div class="max-w-7xl mx-auto relative z-10">
      <header class="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
        <div class="animate-[slideDown_0.6s_ease-out]">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
            <span
              class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em]"
              >Live Feed</span
            >
          </div>
          <h1
            class="text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic leading-none mb-4"
          >
            Explore<span class="text-indigo-600">.</span>Careers
          </h1>
          <p class="text-slate-500 dark:text-slate-400 font-bold text-lg max-w-md leading-relaxed">
            Find your next big opportunity in
            <span
              class="text-slate-900 dark:text-white underline decoration-indigo-500/30 decoration-4"
              >tech & design</span
            >.
          </p>
        </div>

        <div class="flex items-center gap-4 animate-[slideUp_0.6s_auto]">
          <div
            class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-8 py-5 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] flex flex-col items-center group hover:border-indigo-500/30 transition-all duration-500"
          >
            <span
              class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter group-hover:scale-110 transition-transform"
              >{{ jobs.length }}</span
            >
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mt-1"
              >Open Positions</span
            >
          </div>
        </div>
      </header>

      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div
          v-for="i in 6"
          :key="i"
          class="h-[380px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6 overflow-hidden relative"
        >
          <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
          <div class="space-y-3">
            <div class="h-6 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
            <div class="h-4 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
          </div>
          <div class="flex gap-2">
            <div class="h-8 w-20 bg-slate-50 dark:bg-slate-800 rounded-full animate-pulse"></div>
            <div class="h-8 w-20 bg-slate-50 dark:bg-slate-800 rounded-full animate-pulse"></div>
          </div>
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-slate-800/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"
          ></div>
        </div>
      </div>

      <div
        v-else-if="error"
        class="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 animate-[fadeIn_0.5s]"
      >
        <div
          class="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6"
        >
          <i class="pi pi-bolt text-red-500 text-3xl"></i>
        </div>
        <p
          class="text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-sm mb-4"
        >
          {{ error }}
        </p>
        <button
          @click="fetchJobs"
          class="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all shadow-xl shadow-indigo-500/10"
        >
          Reconnect Now
        </button>
      </div>

      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-[fadeIn_0.8s_ease-out]"
      >
        <JobCard v-for="job in jobs" :key="job.id" :job="job" />
      </div>

      <div v-if="!isLoading && jobs.length === 0" class="text-center py-32 opacity-50">
        <i class="pi pi-inbox text-6xl text-slate-200 dark:text-slate-800 mb-6"></i>
        <p class="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.3em] text-xs">
          No opportunities found today.
        </p>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
