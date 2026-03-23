<template>
  <div
    class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 py-12 px-6 lg:px-12 font-['Plus_Jakarta_Sans',sans-serif]"
  >
    <div class="max-w-6xl mx-auto">
      <button
        @click="$router.back()"
        class="group mb-8 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors"
      >
        <i class="pi pi-arrow-left group-hover:-translate-x-1 transition-transform"></i>
        Back to listings
      </button>

      <div v-if="loading" class="flex flex-col items-center justify-center py-32 space-y-4">
        <div
          class="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"
        ></div>
        <p class="text-slate-400 font-black uppercase tracking-widest text-xs">
          Fetching opportunities...
        </p>
      </div>

      <div v-else-if="job" class="animate-[fadeIn_0.6s_ease-out]">
        <header
          class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 md:p-12 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] mb-10 relative overflow-hidden"
        >
          <div
            class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full"
          ></div>

          <div class="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">
            <div class="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div
                class="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black italic shadow-2xl shadow-indigo-200 dark:shadow-none"
              >
                {{ job.title.charAt(0) }}
              </div>
              <div>
                <h1
                  class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-2"
                >
                  {{ job.title }}
                </h1>
                <p
                  class="text-xl text-indigo-600 dark:text-indigo-400 font-bold tracking-tight italic"
                >
                  {{ job.employer?.company_name || 'Premium Company' }}
                </p>
                <div
                  class="flex flex-wrap gap-4 mt-6 text-slate-400 font-bold text-xs uppercase tracking-widest"
                >
                  <span class="flex items-center gap-2"
                    ><i class="pi pi-map-marker text-indigo-500"></i> {{ job.location }}</span
                  >
                  <span class="flex items-center gap-2"
                    ><i class="pi pi-calendar text-indigo-500"></i> Posted
                    {{ formatDate(job.created_at) }}</span
                  >
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-3 w-full md:w-auto">
              <button
                @click="handleApply"
                class="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <i class="pi pi-send"></i> Apply Now
              </button>
              <button
                class="px-10 py-5 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:text-indigo-600 transition-all"
              >
                <i class="pi pi-bookmark mr-2"></i> Save Job
              </button>
            </div>
          </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div class="lg:col-span-8 space-y-10">
            <section
              class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-[2.5rem]"
            >
              <h3
                class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-6 flex items-center gap-3"
              >
                <span class="w-8 h-[2px] bg-indigo-600"></span> Job Description
              </h3>
              <p
                class="text-slate-500 dark:text-slate-400 text-lg leading-[1.8] font-medium whitespace-pre-line"
              >
                {{ job.description }}
              </p>

              <h3
                class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic mt-12 mb-6 flex items-center gap-3"
              >
                <span class="w-8 h-[2px] bg-indigo-600"></span> Requirements
              </h3>
              <ul class="space-y-4">
                <li
                  v-for="(skill, index) in job.job_skills"
                  :key="index"
                  class="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-indigo-100 transition-colors"
                >
                  <i class="pi pi-check-circle text-indigo-500 mt-1"></i>
                  <span class="text-slate-600 dark:text-slate-300 font-bold text-lg">
                    {{ skill.skill_name }}
                    <span class="text-indigo-600/50 ml-2 italic text-sm"
                      >({{ skill.required_level }})</span
                    >
                  </span>
                </li>
              </ul>
            </section>
          </div>

          <aside class="lg:col-span-4 space-y-6">
            <div
              class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem]"
            >
              <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">
                Job Overview
              </h4>

              <div class="space-y-8">
                <div
                  v-for="info in [
                    {
                      icon: 'pi-money-bill',
                      label: 'Salary Range',
                      value: `${job.salary_min} - ${job.salary_max} ${job.currency}`,
                    },
                    { icon: 'pi-briefcase', label: 'Job Type', value: job.type.replace('_', ' ') },
                    { icon: 'pi-users', label: 'Experience Level', value: job.experience_level },
                  ]"
                  :key="info.label"
                  class="flex items-center gap-4"
                >
                  <div
                    class="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600"
                  >
                    <i :class="info.icon" class="text-xl"></i>
                  </div>
                  <div>
                    <p
                      class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1"
                    >
                      {{ info.label }}
                    </p>
                    <p class="text-slate-900 dark:text-white font-black tracking-tight capitalize">
                      {{ info.value }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-500/20 text-center relative overflow-hidden group"
            >
              <div
                class="absolute -top-12 -right-12 w-32 h-32 bg-white/10 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-700"
              ></div>
              <h4 class="text-xl font-black italic mb-2 relative z-10">Want to work here?</h4>
              <p class="text-indigo-100 text-sm font-bold mb-6 relative z-10 opacity-80">
                Be among the first applicants for this position!
              </p>
              <button
                @click="handleApply"
                class="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all relative z-10"
              >
                Easy Apply
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useJobsStore } from '../stores/jobs.js'

const route = useRoute()
const jobStore = useJobsStore()
const job = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    job.value = await jobStore.fetchJobById(route.params.id)
  } finally {
    loading.value = false
  }
})

const handleApply = async () => {
  jobStore.setCurrentUser(1)
  try {
    await jobStore.applyForJob(job.value.id)
    alert('Applied Successfully! Good luck, Marco.')
  } catch (err) {
    alert('Error: ' + err.message)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<style>
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
