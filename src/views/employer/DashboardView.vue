<template>
  <div class="space-y-10">
    <!-- Header Section -->
    <div class="animate-fadeIn">
      <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
        Employer <span class="text-indigo-600">Analytics.</span>
      </h2>
      <p class="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">
        Real-time overview of your hiring pipeline
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
          {{ employerStore.loading ? '...' : stat.value }}
        </p>
      </div>
    </div>

    <!-- Recent Activity Table -->
    <div
      class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm"
    >
      <div class="flex justify-between items-center mb-8 px-2">
        <h3 class="font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Recent Applications
        </h3>
        <router-link
          to="/employer/applications"
          class="text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-colors"
        >
          View All Pipeline <i class="pi pi-arrow-right ml-2 text-[10px]"></i>
        </router-link>
      </div>

      <div v-if="employerStore.applications.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800"
            >
              <th class="pb-6 px-4">Candidate</th>
              <th class="pb-6 px-4">Job Title</th>
              <th class="pb-6 px-4">Status</th>
              <th class="pb-6 px-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
            <tr
              v-for="app in employerStore.applications.slice(0, 5)"
              :key="app.id"
              class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all"
            >
              <td class="py-5 px-4 font-bold text-sm text-slate-900 dark:text-white">
                {{ app.candidate?.name }}
              </td>
              <td class="py-5 px-4 text-sm text-slate-500">{{ app.job?.title }}</td>
              <td class="py-5 px-4">
                <span
                  :class="getStatusClass(app.status)"
                  class="text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest"
                >
                  {{ app.status }}
                </span>
              </td>
              <td class="py-5 px-4 text-right text-xs text-slate-400 font-bold">
                {{ formatDate(app.created_at) }}
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
        <p class="text-slate-400 font-bold text-sm">No applications received yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useEmployerStore } from '@/stores/EmployerStore'

const employerStore = useEmployerStore()

const stats = computed(() => [
  {
    label: 'Active Listings',
    value: employerStore.myJobs.length,
    icon: 'pi pi-briefcase',
    color: 'bg-indigo-600',
  },
  {
    label: 'Total Candidates',
    value: employerStore.applications.length,
    icon: 'pi pi-users',
    color: 'bg-emerald-500',
  },
  {
    label: 'Shortlisted',
    value: employerStore.applications.filter((a) => a.status === 'shortlisted').length,
    icon: 'pi pi-star',
    color: 'bg-amber-500',
  },
  { label: 'Unread Messages', value: '0', icon: 'pi pi-bell', color: 'bg-rose-500' },
])

onMounted(async () => {
  await Promise.all([employerStore.fetchMyJobs(), employerStore.fetchApplications()])
})

const getStatusClass = (status) => {
  const map = {
    pending: 'bg-amber-100 text-amber-600',
    shortlisted: 'bg-indigo-100 text-indigo-600',
    rejected: 'bg-rose-100 text-rose-600',
    accepted: 'bg-emerald-100 text-emerald-600',
  }
  return map[status] || 'bg-slate-100 text-slate-600'
}

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
</script>
