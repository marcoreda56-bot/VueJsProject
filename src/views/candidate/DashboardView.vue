<template>
  <div class="space-y-10">
    <!-- Header Section -->
    <div class="animate-fadeIn">
      <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
        Candidate <span class="text-indigo-600">Dashboard.</span>
      </h2>
      <p class="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">
        Track your job search progress at a glance
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 group"
      >
        <div
          :class="stat.color"
          class="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-100 dark:shadow-none transition-transform group-hover:scale-110"
        >
          <i :class="stat.icon" class="text-xl"></i>
        </div>
        <p class="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
          {{ stat.label }}
        </p>
        <p class="text-3xl font-black text-slate-900 dark:text-white">
          {{ candidateStore.loading ? '...' : stat.value }}
        </p>
      </div>
    </div>

    <!-- Profile Completion -->
    <div
      v-if="candidateStore.profile"
      class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Profile Completion
        </h3>
        <span class="text-2xl font-black text-indigo-600">{{ profileCompletion }}%</span>
      </div>
      <div class="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          class="h-full bg-indigo-600 rounded-full transition-all duration-1000"
          :style="{ width: `${profileCompletion}%` }"
        ></div>
      </div>
      <p class="text-xs text-slate-400 font-bold mt-3 uppercase tracking-widest">
        A complete profile increases your chances of getting hired by 3x
      </p>
    </div>

    <!-- Recent Applications -->
    <div
      class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm"
    >
      <div class="flex justify-between items-center mb-8 px-2">
        <h3 class="font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Recent Applications
        </h3>
        <router-link
          to="/candidate/applications"
          class="text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-colors"
        >
          View All <i class="pi pi-arrow-right ml-2 text-[10px]"></i>
        </router-link>
      </div>

      <div v-if="recentApplications.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800"
            >
              <th class="pb-6 px-4">Job Title</th>
              <th class="pb-6 px-4">Company</th>
              <th class="pb-6 px-4">Status</th>
              <th class="pb-6 px-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
            <tr
              v-for="app in recentApplications"
              :key="app.id"
              class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
              @click="$router.push(`/candidate/applications/${app.id}`)"
            >
              <td class="py-5 px-4 font-bold text-sm text-slate-900 dark:text-white">
                {{ app.job_snapshot?.title || app.job?.title }}
              </td>
              <td class="py-5 px-4 text-sm text-slate-500">
                {{ app.employer_snapshot?.company_name || app.job?.employer?.company_name }}
              </td>
              <td class="py-5 px-4">
                <span
                  :class="getStatusClass(app.current_status || app.status)"
                  class="text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest"
                >
                  {{ (app.current_status || app.status)?.replace('_', ' ') }}
                </span>
              </td>
              <td class="py-5 px-4 text-right text-xs text-slate-400 font-bold">
                {{ formatDate(app.applied_at || app.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center py-20">
        <div
          class="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="pi pi-inbox text-slate-300 text-2xl"></i>
        </div>
        <p class="text-slate-400 font-bold text-sm">No applications yet.</p>
        <router-link
          to="/jobs"
          class="text-indigo-600 font-black text-xs uppercase tracking-widest mt-2 inline-block"
        >
          Browse Jobs
        </router-link>
      </div>
    </div>

    <!-- Saved Jobs Preview -->
    <div
      class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm"
    >
      <div class="flex justify-between items-center mb-8 px-2">
        <h3 class="font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Saved Jobs
        </h3>
        <router-link
          to="/candidate/saved-jobs"
          class="text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-colors"
        >
          View All <i class="pi pi-arrow-right ml-2 text-[10px]"></i>
        </router-link>
      </div>

      <div v-if="recentSavedJobs.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="saved in recentSavedJobs"
          :key="saved.id"
          class="p-5 border border-slate-50 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
        >
          <div class="flex items-start justify-between">
            <div>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                {{ saved.job?.title }}
              </h4>
              <p class="text-xs text-slate-500 mt-1">{{ saved.job?.employer?.company_name }}</p>
            </div>
            <button
              @click="unsaveJob(saved.job_id)"
              class="text-slate-300 hover:text-rose-500 transition-colors"
            >
              <i class="pi pi-bookmark-fill text-sm"></i>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-12">
        <p class="text-slate-400 font-bold text-sm">No saved jobs yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useCandidateStore } from '@/stores/CandidateStore'
import { getFileUrl } from '@/api/services/api'

const candidateStore = useCandidateStore()

const profileCompletion = computed(() =>
  candidateStore.profile?.profile_completion_score || 0,
)

const stats = computed(() => [
  {
    label: 'Applications',
    value: candidateStore.applications.length,
    icon: 'pi pi-send',
    color: 'bg-indigo-600',
  },
  {
    label: 'Saved Jobs',
    value: candidateStore.savedJobs.length,
    icon: 'pi pi-bookmark',
    color: 'bg-amber-500',
  },
  {
    label: 'Interviews',
    value: candidateStore.applications.reduce(
      (sum, a) => sum + (a.interviews_count || 0),
      0,
    ),
    icon: 'pi pi-calendar',
    color: 'bg-emerald-500',
  },
  {
    label: 'Profile Score',
    value: `${profileCompletion.value}%`,
    icon: 'pi pi-chart-bar',
    color: 'bg-rose-500',
  },
])

const recentApplications = computed(() =>
  (candidateStore.applications || []).slice(0, 5),
)

const recentSavedJobs = computed(() =>
  (candidateStore.savedJobs || []).slice(0, 4),
)

onMounted(async () => {
  await Promise.all([
    candidateStore.fetchProfile(),
    candidateStore.fetchApplications(),
    candidateStore.fetchSavedJobs(),
  ])
})

const unsaveJob = async (jobId) => {
  await candidateStore.unsaveJob(jobId)
}

const getStatusClass = (status) => {
  const map = {
    applied: 'bg-blue-100 text-blue-700',
    reviewed: 'bg-purple-100 text-purple-700',
    shortlisted: 'bg-indigo-100 text-indigo-700',
    interviewed: 'bg-yellow-100 text-yellow-700',
    offered: 'bg-orange-100 text-orange-700',
    hired: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    withdrawn: 'bg-slate-100 text-slate-500',
    job_removed: 'bg-slate-100 text-slate-400',
  }
  return map[status] || 'bg-slate-100 text-slate-600'
}

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '...'
</script>
