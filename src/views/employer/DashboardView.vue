<template>
  <div class="space-y-10">
    <div class="animate-fadeIn">
      <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
        Employer <span class="text-indigo-600">Analytics.</span>
      </h2>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white dark:bg-slate-900 p-8 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all group hover:border-indigo-200 cursor-pointer"
        @click="stat.onClick ? stat.onClick() : null"
      >
        <div
          :class="stat.color"
          class="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform"
        >
          <i :class="stat.icon" class="text-xl"></i>
        </div>
        <p class="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
          {{ stat.label }}
        </p>
        <p class="text-3xl font-black text-slate-900 dark:text-white">
          {{ employerStore.loading ? '...' : stat.value }}
        </p>
        <p v-if="stat.sublabel" class="text-[10px] text-slate-400 font-bold mt-2">
          {{ stat.sublabel }}
        </p>
      </div>
    </div>

    <!-- Applications by Job -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">
          Recent Applications
        </h3>
        <router-link
          to="/employer/applications"
          class="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition"
        >
          View All <i class="pi pi-arrow-right ml-1"></i>
        </router-link>
      </div>

      <!-- Job Cards with Applicants -->
      <div v-if="employerStore.loading" class="flex justify-center py-20">
        <i class="pi pi-spin pi-spinner text-3xl text-indigo-600"></i>
      </div>

      <div
        v-else-if="recentJobsWithApps.length === 0"
        class="text-center py-16 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800"
      >
        <i class="pi pi-inbox text-4xl text-slate-300 mb-4"></i>
        <p class="text-slate-400 font-bold uppercase text-xs tracking-widest">
          No applications yet.
        </p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="job in recentJobsWithApps"
          :key="job.id"
          class="bg-white dark:bg-slate-900 rounded-4xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:border-indigo-200 transition-all"
        >
          <!-- Job Header -->
          <div
            class="p-6 md:p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-indigo-50 dark:bg-slate-800 rounded-4xl flex items-center justify-center text-indigo-600 font-black text-lg"
              >
                {{ job.title.charAt(0) }}
              </div>
              <div>
                <h4 class="font-black text-slate-900 dark:text-white text-sm">{{ job.title }}</h4>
                <div class="flex items-center gap-3 mt-1">
                  <span
                    :class="getJobStatusClass(job.status)"
                    class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase"
                    >{{ job.status?.replace('_', ' ') }}</span
                  >
                  <span class="text-[10px] font-bold text-slate-400"
                    >{{ job.applications_count || 0 }} applicant{{
                      job.applications_count === 1 ? '' : 's'
                    }}</span
                  >
                </div>
              </div>
            </div>
            <router-link
              :to="`/employer/jobs/${job.id}/applications`"
              class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
            >
              View Pipeline
            </router-link>
          </div>

          <!-- Applicant Previews -->
          <div class="divide-y divide-slate-50 dark:divide-slate-800">
            <router-link
              v-for="app in (job.applications || []).slice(0, 3)"
              :key="app.id"
              :to="`/employer/applications/${app.id}`"
              class="flex items-center justify-between p-5 md:px-8 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
            >
              <div class="flex items-center gap-4">
                <img
                  :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(app.candidate_snapshot?.name || 'U')}&background=6366f1&color=fff`"
                  class="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <p class="font-bold text-slate-900 dark:text-white text-sm">
                    {{ app.candidate_snapshot?.name || 'Unknown' }}
                  </p>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {{ app.candidate_snapshot?.headline || 'Candidate' }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span
                  :class="statusClass(app.current_status)"
                  class="text-[9px] font-black px-2 py-1 rounded-full uppercase"
                  >{{ app.current_status?.replace('_', ' ') }}</span
                >
                <span class="text-[10px] text-slate-400 font-bold">{{
                  formatDate(app.applied_at)
                }}</span>
              </div>
            </router-link>

            <div v-if="(job.applications || []).length > 3" class="p-4 text-center">
              <router-link
                :to="`/employer/jobs/${job.id}/applications`"
                class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
              >
                +{{ (job.applications || []).length - 3 }} more applicants
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pipeline Summary Bar -->
    <div
      v-if="pipelineTotals.total > 0"
      class="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-4xl border border-slate-100 dark:border-slate-800"
    >
      <h3 class="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">
        Pipeline Overview
      </h3>
      <div class="flex flex-wrap gap-3">
        <div
          v-for="stage in pipelineStages"
          :key="stage.value"
          class="flex items-center gap-2 px-4 py-2 rounded-xl"
          :class="stage.class"
        >
          <span class="text-lg font-black">{{ pipelineTotals[stage.value] || 0 }}</span>
          <span class="text-[10px] font-black uppercase tracking-widest">{{ stage.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployerStore } from '@/stores/EmployerStore'

const employerStore = useEmployerStore()
const router = useRouter()

const stats = computed(() => [
  {
    label: 'Active Listings',
    value: (employerStore.myJobs || []).filter((j) => j.status === 'active').length,
    icon: 'pi pi-briefcase',
    color: 'bg-indigo-600',
    onClick: () => router.push('/employer/manage-jobs'),
  },
  {
    label: 'Total Candidates',
    value: (employerStore.applications || []).length,
    icon: 'pi pi-users',
    color: 'bg-emerald-500',
    sublabel: 'across all jobs',
    onClick: () => router.push('/employer/applications'),
  },
  {
    label: 'Shortlisted',
    value: (employerStore.applications || []).filter((a) => a.current_status === 'shortlisted')
      .length,
    icon: 'pi pi-star',
    color: 'bg-amber-500',
  },
  {
    label: 'Pending Review',
    value: (employerStore.myJobs || []).filter((j) => j.status === 'pending_review').length,
    icon: 'pi pi-clock',
    color: 'bg-rose-500',
    onClick: () => router.push('/employer/manage-jobs'),
  },
])

const pipelineStages = [
  {
    value: 'applied',
    label: 'Applied',
    class: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  },
  {
    value: 'reviewed',
    label: 'Reviewed',
    class: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  },
  {
    value: 'shortlisted',
    label: 'Shortlisted',
    class: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
  },
  {
    value: 'interviewed',
    label: 'Interviewed',
    class: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  },
  {
    value: 'offered',
    label: 'Offered',
    class: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
  },
  {
    value: 'hired',
    label: 'Hired',
    class: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  },
  {
    value: 'rejected',
    label: 'Rejected',
    class: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  },
]

const pipelineTotals = computed(() => {
  const totals = { total: 0 }
  pipelineStages.forEach((s) => {
    totals[s.value] = 0
  })
  ;(employerStore.applications || []).forEach((a) => {
    if (totals[a.current_status] !== undefined) {
      totals[a.current_status]++
      totals.total++
    }
  })
  return totals
})

// Group applications by job and show jobs with applications
const recentJobsWithApps = computed(() => {
  const jobsWithApps = employerStore.myJobs
    .map((job) => {
      const apps = (employerStore.applications || []).filter((a) => {
        const appJobId = a.job_id || a.job?.id
        return appJobId === job.id
      })
      return { ...job, applications: apps }
    })
    .filter((job) => job.applications.length > 0)
    .sort((a, b) => {
      const aDate = new Date(a.applications[0]?.applied_at || 0)
      const bDate = new Date(b.applications[0]?.applied_at || 0)
      return bDate - aDate
    })
  return jobsWithApps.slice(0, 3)
})

onMounted(async () => {
  await Promise.all([employerStore.fetchMyJobs(), employerStore.fetchApplications()])
})

const statusClass = (status) => {
  const map = {
    applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    reviewed: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
    shortlisted: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
    interviewed: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    offered: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
    hired: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    withdrawn: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    job_removed: 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500',
  }
  return map[status] || map.applied
}

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

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
</script>
