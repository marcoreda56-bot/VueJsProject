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
        class="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all group"
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
      </div>
    </div>

    <!-- Applications Table -->
    <div
      class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm"
    >
      <div v-if="hasApplications" class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr
              class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800"
            >
              <th class="pb-6 px-4">Candidate</th>
              <th class="pb-6 px-4">Status</th>
              <th class="pb-6 px-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
            <tr v-for="app in (employerStore.applications || []).slice(0, 5)" :key="app.id">
              <td class="py-5 px-4 font-bold text-sm">{{ app.candidate?.name || 'Unknown' }}</td>
              <td class="py-5 px-4">
                <span
                  class="text-[9px] font-black px-3 py-1 rounded-full uppercase bg-indigo-50 text-indigo-600"
                  >{{ app.status }}</span
                >
              </td>
              <td class="py-5 px-4 text-right text-xs text-slate-400 font-bold">
                {{ formatDate(app.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center py-10">
        <p class="text-slate-400 font-bold text-sm uppercase">No applications yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useEmployerStore } from '@/stores/EmployerStore'

const employerStore = useEmployerStore()

const hasApplications = computed(
  () => employerStore.applications && employerStore.applications.length > 0,
)

const stats = computed(() => [
  {
    label: 'Active Listings',
    value: (employerStore.myJobs || []).length,
    icon: 'pi pi-briefcase',
    color: 'bg-indigo-600',
  },
  {
    label: 'Total Candidates',
    value: (employerStore.applications || []).length,
    icon: 'pi pi-users',
    color: 'bg-emerald-500',
  },
  {
    label: 'Shortlisted',
    value: (employerStore.applications || []).filter((a) => a.status === 'shortlisted').length,
    icon: 'pi pi-star',
    color: 'bg-amber-500',
  },
  { label: 'System Health', value: 'OK', icon: 'pi pi-check-circle', color: 'bg-rose-500' },
])

onMounted(async () => {
  await Promise.all([employerStore.fetchMyJobs(), employerStore.fetchApplications()])
})

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'
</script>
