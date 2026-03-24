<template>
  <div
    v-if="job"
    class="p-8 lg:p-12 animate-[fadeIn_0.5s_ease-out] max-w-6xl mx-auto font-['Plus_Jakarta_Sans']"
  >
    <button
      @click="$router.push({ name: 'candidate.find-jobs' })"
      class="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-10 transition-all"
    >
      <i class="pi pi-arrow-left"></i> Back to Explorer
    </button>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div class="lg:col-span-8 space-y-8">
        <div
          class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-12 rounded-[3.5rem] shadow-sm"
        >
          <div class="flex items-center gap-6 mb-10">
            <div
              class="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black italic shadow-2xl"
            >
              {{ job.title.charAt(0) }}
            </div>
            <div>
              <h1
                class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-2 leading-none"
              >
                {{ job.title }}
              </h1>
              <p class="text-indigo-600 font-black uppercase text-xs tracking-widest">
                {{ job.employer?.company_name }}
              </p>
            </div>
          </div>
          <div class="space-y-10">
            <div>
              <h3 class="text-xl font-black italic text-slate-900 dark:text-white mb-4">
                Role Overview
              </h3>
              <p class="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                {{ job.description }}
              </p>
            </div>
            <div>
              <h3 class="text-xl font-black italic text-slate-900 dark:text-white mb-4">
                Requirements
              </h3>
              <div
                class="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 whitespace-pre-line text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed font-mono italic"
              >
                {{ job.requirements }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-4">
        <div class="sticky top-6 space-y-6">
          <div
            class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-[3rem] shadow-sm"
          >
            <div class="space-y-6 mb-10">
              <div class="flex flex-col gap-1">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                  >Expected Salary</span
                >
                <span
                  class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic"
                  >{{ job.salary_min.toLocaleString() }} - {{ job.salary_max.toLocaleString() }}
                  <small class="text-indigo-600 text-[10px]">{{ job.currency }}</small></span
                >
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                  >Office Location</span
                >
                <span class="text-sm font-black text-slate-700 dark:text-slate-200 italic">{{
                  job.location
                }}</span>
              </div>
            </div>
            <button
              @click="$router.push({ name: 'candidate.job-apply', params: { id: job.id } })"
              class="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all"
            >
              Easy apply
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'
const route = useRoute()
const jobStore = useJobsStore()
const job = ref(null)
onMounted(async () => {
  job.value = await jobStore.fetchJobById(route.params.id)
})
</script>
