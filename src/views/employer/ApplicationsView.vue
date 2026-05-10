<template>
  <div class="space-y-8 animate-fadeIn">
    <div>
      <h1 class="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
        Talent <span class="text-indigo-600">Inbox.</span>
      </h1>
      <p class="text-slate-400 text-sm mt-1">All applications grouped by job posting.</p>
    </div>

    <!-- Status Filter Chips -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="stage in stages"
        :key="stage.value"
        @click="toggleStage(stage.value)"
        :class="selectedStages.includes(stage.value)
          ? stage.activeClass
          : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800'"
        class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:shadow-md"
      >
        {{ stage.label }}
        <span v-if="stageCounts[stage.value]" class="ml-1 opacity-70">({{ stageCounts[stage.value] }})</span>
      </button>
      <button
        v-if="selectedStages.length > 0 || searchQuery"
        @click="clearFilters"
        class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all"
      >
        Clear Filters
      </button>
    </div>

    <!-- Search -->
    <div class="relative">
      <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by job title..."
        class="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl pl-11 pr-6 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all"
      />
    </div>

    <!-- Loading -->
    <div v-if="employerStore.loading" class="flex justify-center py-20">
      <i class="pi pi-spin pi-spinner text-3xl text-indigo-600"></i>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredJobsWithApps.length === 0" class="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
      <i class="pi pi-inbox text-4xl text-slate-300 mb-4"></i>
      <p class="text-slate-400 font-bold uppercase text-xs tracking-widest">No applications found.</p>
    </div>

    <!-- Job Cards with Application Counts -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="job in filteredJobsWithApps"
        :key="job.id"
        class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden hover:border-indigo-200 transition-all shadow-sm group"
      >
        <!-- Job Header -->
        <div class="p-6 md:p-8 border-b border-slate-50 dark:border-slate-800">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-indigo-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg">
              {{ job.title.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-black text-slate-900 dark:text-white text-sm truncate group-hover:text-indigo-600 transition-colors">
                {{ job.title }}
              </h3>
              <div class="flex items-center gap-2 mt-1">
                <span :class="getJobStatusClass(job.status)" class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase">{{ job.status?.replace('_', ' ') }}</span>
                <span class="text-[10px] font-bold text-slate-400">{{ job.city || 'Remote' }}</span>
              </div>
            </div>
          </div>

          <!-- Application Count Badge -->
          <div class="flex items-center justify-between">
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-black text-slate-900 dark:text-white">{{ job.totalApplications }}</span>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">applicant{{ job.totalApplications === 1 ? '' : 's' }}</span>
            </div>
            <div v-if="job.newApplications > 0" class="bg-indigo-100 text-indigo-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              {{ job.newApplications }} new
            </div>
          </div>
        </div>

        <!-- Stage Breakdown -->
        <div class="p-6 md:px-8">
          <div class="flex flex-wrap gap-2 mb-4">
            <template v-for="stage in visibleStages" :key="stage.value">
              <div
                v-if="job.stageCounts[stage.value] > 0"
                class="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase"
                :class="stage.class"
              >
                <span>{{ job.stageCounts[stage.value] }}</span>
                <span class="opacity-70">{{ stage.label }}</span>
              </div>
            </template>
          </div>

          <!-- Recent Applicants Avatars -->
          <div v-if="job.recentApplicants.length > 0" class="flex items-center justify-between">
            <div class="flex items-center -space-x-2">
              <img
                v-for="app in job.recentApplicants.slice(0, 4)"
                :key="app.id"
                :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(app.candidate_snapshot?.name || 'U')}&background=6366f1&color=fff`"
                class="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 object-cover"
              />
              <div v-if="job.recentApplicants.length > 4" class="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[9px] font-black text-slate-500">
                +{{ job.recentApplicants.length - 4 }}
              </div>
            </div>
            <router-link
              :to="`/employer/jobs/${job.id}/applications`"
              class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
            >
              Manage <i class="pi pi-arrow-right ml-1 text-[10px]"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEmployerStore } from '@/stores/EmployerStore'

const employerStore = useEmployerStore()
const selectedStages = ref([])
const searchQuery = ref('')

const stages = [
  { value: 'applied', label: 'Applied', activeClass: 'bg-blue-100 text-blue-700 border border-blue-200' },
  { value: 'reviewed', label: 'Reviewed', activeClass: 'bg-purple-100 text-purple-700 border border-purple-200' },
  { value: 'shortlisted', label: 'Shortlisted', activeClass: 'bg-indigo-100 text-indigo-700 border border-indigo-200' },
  { value: 'interviewed', label: 'Interviewed', activeClass: 'bg-yellow-100 text-yellow-700 border border-yellow-200' },
  { value: 'offered', label: 'Offered', activeClass: 'bg-orange-100 text-orange-700 border border-orange-200' },
  { value: 'hired', label: 'Hired', activeClass: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
  { value: 'rejected', label: 'Rejected', activeClass: 'bg-red-100 text-red-700 border border-red-200' },
  { value: 'withdrawn', label: 'Withdrawn', activeClass: 'bg-slate-100 text-slate-600 border border-slate-200' },
]

const visibleStages = [
  { value: 'applied', label: 'Applied', class: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
  { value: 'reviewed', label: 'Reviewed', class: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
  { value: 'shortlisted', label: 'Shortlisted', class: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' },
  { value: 'interviewed', label: 'Interviewed', class: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' },
  { value: 'offered', label: 'Offered', class: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' },
  { value: 'hired', label: 'Hired', class: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' },
  { value: 'rejected', label: 'Rejected', class: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' },
  { value: 'withdrawn', label: 'Withdrawn', class: 'bg-slate-50 text-slate-600 dark:bg-slate-800/20 dark:text-slate-400' },
]

const toggleStage = (stage) => {
  const idx = selectedStages.value.indexOf(stage)
  if (idx === -1) {
    selectedStages.value.push(stage)
  } else {
    selectedStages.value.splice(idx, 1)
  }
}

const clearFilters = () => {
  selectedStages.value = []
  searchQuery.value = ''
}

// Build jobs enriched with application data
const jobsWithApplications = computed(() => {
  return (employerStore.myJobs || []).map((job) => {
    const apps = (employerStore.applications || []).filter((a) => a.job_id === job.id)

    // Count by stage
    const stageCounts = {}
    stages.forEach((s) => { stageCounts[s.value] = 0 })
    apps.forEach((a) => {
      if (stageCounts[a.current_status] !== undefined) {
        stageCounts[a.current_status]++
      }
    })

    // Filter by selected stages
    const filteredApps = selectedStages.value.length > 0
      ? apps.filter((a) => selectedStages.value.includes(a.current_status))
      : apps

    return {
      ...job,
      totalApplications: apps.length,
      filteredCount: filteredApps.length,
      newApplications: apps.filter((a) => a.current_status === 'applied').length,
      stageCounts,
      recentApplicants: apps.sort((a, b) => new Date(b.applied_at || 0) - new Date(a.applied_at || 0)),
    }
  })
})

const filteredJobsWithApps = computed(() => {
  let jobs = jobsWithApplications.value.filter((j) => j.filteredCount > 0)

  // Search by job title
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    jobs = jobs.filter((j) => j.title.toLowerCase().includes(q))
  }

  // Sort by most total applications first
  return jobs.sort((a, b) => b.totalApplications - a.totalApplications)
})

const stageCounts = computed(() => {
  const counts = {}
  stages.forEach((s) => { counts[s.value] = 0 })
  ;(employerStore.applications || []).forEach((a) => {
    if (counts[a.current_status] !== undefined) {
      counts[a.current_status]++
    }
  })
  return counts
})

onMounted(() => {
  Promise.all([employerStore.fetchMyJobs(), employerStore.fetchApplications()])
})

const getJobStatusClass = (status) => {
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
</script>
