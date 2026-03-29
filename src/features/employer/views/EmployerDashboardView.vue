<template>
  <div class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
    <!-- Hero Banner -->
    <div class="max-w-[1800px] mx-auto mb-8">
      <section
        class="relative overflow-hidden bg-slate-900 rounded-[3rem] py-16 px-12 shadow-2xl animate-[fadeIn_0.8s_ease-out]"
      >
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/30 blur-[120px] rounded-full animate-pulse"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full"></div>
        <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full mb-5">
              <span class="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">Employer Workspace</span>
            </div>
            <h1 class="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[0.9] mb-4 italic">
              Hello, <span class="text-indigo-400">{{ firstName }}</span>
            </h1>
            <p class="text-slate-400 font-medium text-lg">
              You have <span class="text-white border-b-2 border-indigo-500/50">{{ employerStore.jobs.length }} posted jobs</span> and
              <span class="text-white border-b-2 border-indigo-500/50">{{ employerStore.pendingApplications.length }} pending applications</span>.
            </p>
          </div>
          <div class="flex gap-4">
            <button
              @click="$router.push({ name: 'employer.post-job' })"
              class="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-500 transition-all active:scale-95 flex items-center gap-3"
            >
              <i class="pi pi-plus-circle"></i> Post Job
            </button>
            <button
              @click="$router.push({ name: 'employer.manage-jobs' })"
              class="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-50 transition-all active:scale-95 flex items-center gap-3"
            >
              <i class="pi pi-briefcase"></i> My Jobs
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- Stats -->
    <section class="max-w-[1400px] mx-auto px-4 mb-10 grid grid-cols-2 md:grid-cols-4 gap-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] hover:-translate-y-2 transition-all duration-500 group shadow-sm"
      >
        <div
          :class="stat.bg"
          class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform"
        >
          <i :class="[stat.icon, stat.color]" class="text-xl"></i>
        </div>
        <p class="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">{{ stat.label }}</p>
        <h3 class="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter">{{ stat.value }}</h3>
      </div>
    </section>

    <!-- Recent Applications -->
    <section class="max-w-[1400px] mx-auto px-4 pb-20">
      <div class="flex items-center justify-between mb-8 px-2">
        <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic flex items-center gap-4">
          <span class="w-10 h-[2px] bg-indigo-600"></span> Recent Applications
        </h2>
        <router-link
          to="/employer/applications"
          class="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 hover:tracking-[0.3em] transition-all"
        >
          View All
        </router-link>
      </div>

      <div v-if="employerStore.loading" class="text-center py-16 text-slate-400 font-bold italic">
        Loading...
      </div>

      <div v-else-if="recentApplications.length === 0" class="text-center py-16">
        <div class="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-3xl text-slate-300">
          <i class="pi pi-inbox"></i>
        </div>
        <p class="text-slate-400 font-bold italic text-lg">No applications yet.</p>
      </div>

      <div v-else class="grid gap-5">
        <div
          v-for="app in recentApplications"
          :key="app.id"
          class="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-7 rounded-[2.5rem] hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div class="flex items-center gap-6">
            <div class="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
              {{ (app.candidate_snapshot?.name || 'C').charAt(0).toUpperCase() }}
            </div>
            <div>
              <h4 class="text-xl font-black text-slate-900 dark:text-white tracking-tighter group-hover:text-indigo-600 transition-colors">
                {{ app.candidate_snapshot?.name || 'Candidate' }}
              </h4>
              <p class="text-slate-400 font-bold text-xs uppercase tracking-widest italic mt-1">
                Applied for: <span class="text-indigo-500">{{ getJobTitle(app.job_id) }}</span>
              </p>
              <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-0.5">
                {{ formatDate(app.applied_at) }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span :class="statusStyle(app.status)" class="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border">
              {{ app.status }}
            </span>
            <router-link
              to="/employer/applications"
              class="w-10 h-10 rounded-full bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center hover:rotate-45 transition-transform shadow-lg"
            >
              <i class="pi pi-arrow-up-right text-xs"></i>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useEmployerStore } from '@/stores/employer.store'

const auth = useAuthStore()
const employerStore = useEmployerStore()

const firstName = computed(() => auth.user?.name?.split(' ')[0] || 'Employer')

onMounted(async () => {
  await employerStore.initialize()
})

const stats = computed(() => [
  {
    label: 'Jobs Posted',
    value: employerStore.jobs.length,
    icon: 'pi pi-briefcase',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
  },
  {
    label: 'Active Jobs',
    value: employerStore.activeJobs.length,
    icon: 'pi pi-check-circle',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
  {
    label: 'Total Applications',
    value: employerStore.totalApplications,
    icon: 'pi pi-inbox',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
  },
  {
    label: 'Pending Review',
    value: employerStore.pendingApplications.length,
    icon: 'pi pi-clock',
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
  },
])

const recentApplications = computed(() =>
  [...employerStore.applications].reverse().slice(0, 5)
)

const getJobTitle = (jobId) => {
  const job = employerStore.jobs.find((j) => String(j.id) === String(jobId))
  return job?.title || 'Job Position'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const statusStyle = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'accepted') return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10'
  if (s === 'rejected') return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10'
  return 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800'
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
