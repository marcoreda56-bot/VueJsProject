<template>
  <div class="max-w-5xl mx-auto space-y-8 animate-fadeIn">
    <button
      @click="$router.back()"
      class="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
    >
      <i class="pi pi-arrow-left"></i> Back to Jobs
    </button>

    <div v-if="employerStore.loading" class="flex justify-center py-20">
      <i class="pi pi-spin pi-spinner text-3xl text-indigo-600"></i>
    </div>

    <div v-else-if="job" class="space-y-8">
      <!-- Header -->
      <div
        class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800"
      >
        <div class="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <div class="flex items-center gap-3 mb-3">
              <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                {{ job.title }}
              </h1>
              <span :class="getStatusClass(job.status)" class="text-[9px] font-black px-3 py-1 rounded-full uppercase">
                {{ job.status?.replace('_', ' ') }}
              </span>
            </div>
            <div class="flex flex-wrap gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span><i class="pi pi-map-marker"></i> {{ job.city }}</span>
              <span><i class="pi pi-briefcase"></i> {{ job.type?.replace('_', ' ') }}</span>
              <span><i class="pi pi-globe"></i> {{ job.workplace_type?.replace('_', ' ') }}</span>
              <span><i class="pi pi-money-bill"></i> {{ job.salary_min }} - {{ job.salary_max }} EGP</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <router-link
              :to="`/employer/jobs/${job.id}/edit`"
              class="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all"
            >
              Edit
            </router-link>
            <router-link
              :to="`/employer/jobs/${job.id}/applications`"
              class="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all"
            >
              Applications ({{ job.applications_count || 0 }})
            </router-link>
          </div>
        </div>
      </div>

      <!-- Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800">
          <h3 class="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Description</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{{ job.description }}</p>
        </div>
        <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800">
          <h3 class="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Requirements</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{{ job.requirements || 'No requirements specified.' }}</p>
        </div>
      </div>

      <!-- Skills -->
      <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800">
        <h3 class="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Required Skills</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="skill in job.skills"
            :key="skill.id || skill.skill_id"
            class="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 text-[10px] font-black px-4 py-2 rounded-full uppercase"
          >
            {{ skill.name }}
          </span>
          <span v-if="!job.skills || job.skills.length === 0" class="text-slate-400 text-sm font-bold">No skills specified.</span>
        </div>
      </div>

      <!-- Meta -->
      <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Experience</p>
          <p class="text-sm font-black text-slate-900 dark:text-white">{{ job.experience_level }}</p>
        </div>
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vacancies</p>
          <p class="text-sm font-black text-slate-900 dark:text-white">{{ job.vacancies }}</p>
        </div>
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Posted</p>
          <p class="text-sm font-black text-slate-900 dark:text-white">{{ formatDate(job.created_at) }}</p>
        </div>
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expires</p>
          <p class="text-sm font-black text-slate-900 dark:text-white">{{ formatDate(job.expires_at) }}</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <p class="text-slate-400 font-bold">Job not found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useEmployerStore } from '@/stores/EmployerStore'

const route = useRoute()
const employerStore = useEmployerStore()
const job = computed(() => employerStore.currentJob)

onMounted(async () => {
  try {
    await employerStore.fetchJobById(route.params.id)
  } catch (err) {
    console.error('Failed to load job', err)
  }
})

const getStatusClass = (status) => {
  const styles = {
    active: 'bg-emerald-50 text-emerald-600',
    draft: 'bg-slate-100 text-slate-500',
    pending_review: 'bg-amber-50 text-amber-600',
    rejected: 'bg-rose-50 text-rose-600',
    closed: 'bg-slate-200 text-slate-700',
    expired: 'bg-orange-50 text-orange-600',
    paused: 'bg-orange-50 text-orange-600',
  }
  return styles[status] || 'bg-blue-50 text-blue-600'
}

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'
</script>
