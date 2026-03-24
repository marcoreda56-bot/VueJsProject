<template>
  <div class="font-['Plus_Jakarta_Sans',sans-serif]">
    <button
      @click="$router.back()"
      class="group mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
    >
      <i class="pi pi-arrow-left group-hover:-translate-x-1 transition-transform"></i>
      Back to jobs
    </button>

    <div v-if="loading" class="flex flex-col items-center justify-center py-32 space-y-4">
      <div class="w-12 h-12 border-4 border-sky-600/20 border-t-sky-600 rounded-full animate-spin"></div>
      <p class="text-slate-500 dark:text-slate-400 font-semibold">Loading job details...</p>
    </div>

    <div v-else-if="job" class="space-y-8">
      <header class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div class="space-y-4">
            <span class="inline-flex rounded-full bg-sky-100 dark:bg-sky-900/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">
              {{ job.type || 'Full time' }}
            </span>
            <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">{{ job.title }}</h1>
            <p class="text-sky-700 dark:text-sky-300 font-bold">{{ job.employer?.company_name || job.company_name || 'Company' }}</p>
            <div class="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span class="flex items-center gap-2"><i class="pi pi-map-marker"></i>{{ job.location || 'Egypt' }}</span>
              <span class="flex items-center gap-2"><i class="pi pi-calendar"></i>Posted {{ formatDate(job.created_at) }}</span>
            </div>
          </div>
          <button
            @click="handleApply"
            class="px-8 py-3.5 bg-sky-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.16em] hover:bg-sky-700 transition-all"
          >
            Apply now
          </button>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section class="lg:col-span-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
          <h3 class="text-xl font-black text-slate-900 dark:text-white mb-4">Job Description</h3>
          <p class="text-slate-600 dark:text-slate-300 whitespace-pre-line leading-7">
            {{ job.description || 'No description provided.' }}
          </p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white mt-10 mb-4">Requirements</h3>
          <ul class="space-y-3">
            <li
              v-for="(skill, index) in job.job_skills || []"
              :key="index"
              class="rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-200"
            >
              <i class="pi pi-check-circle text-sky-600 mr-2"></i>
              {{ skill.skill_name }} <span class="text-slate-500">({{ skill.required_level }})</span>
            </li>
          </ul>
        </section>

        <aside class="lg:col-span-4 space-y-4">
          <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h4 class="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 mb-5">
              Job overview
            </h4>
            <div class="space-y-4 text-sm">
              <p class="flex justify-between gap-3"><span class="text-slate-500">Salary</span><span class="font-bold text-slate-900 dark:text-white">{{ job.salary_min }} - {{ job.salary_max }} {{ job.currency }}</span></p>
              <p class="flex justify-between gap-3"><span class="text-slate-500">Type</span><span class="font-bold text-slate-900 dark:text-white capitalize">{{ job.type?.replace('_', ' ') }}</span></p>
              <p class="flex justify-between gap-3"><span class="text-slate-500">Experience</span><span class="font-bold text-slate-900 dark:text-white">{{ job.experience_level || 'Mid level' }}</span></p>
            </div>
          </div>
          <div class="rounded-3xl bg-gradient-to-br from-sky-600 to-cyan-700 p-6 text-white">
            <p class="text-lg font-black">Interested in this role?</p>
            <p class="text-sm text-sky-100 mt-1 mb-5">Submit your application in less than a minute.</p>
            <button
              @click="handleApply"
              class="w-full py-3 rounded-xl bg-white text-sky-700 font-black text-xs uppercase tracking-[0.16em] hover:bg-sky-50"
            >
              Easy Apply
            </button>
          </div>
        </aside>
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
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>
