<template>
  <div
    class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-indigo-100"
  >
    <div class="max-w-[1800px] mx-auto p-6">
      <section
        class="relative overflow-hidden bg-slate-900 rounded-[3rem] py-20 px-12 shadow-2xl animate-[fadeIn_0.8s_ease-out]"
      >
        <div
          class="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/30 blur-[120px] rounded-full animate-pulse"
        ></div>
        <div
          class="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full"
        ></div>

        <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div class="text-left max-w-2xl">
            <div
              class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full mb-6"
            >
              <span class="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]"
                >Candidate Workspace</span
              >
            </div>
            <h1
              class="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-6 italic"
            >
              Hello,
              <span class="text-indigo-500">{{ auth.user?.name?.split(' ')[0] || 'Marco' }}</span>
            </h1>
            <p class="text-lg text-slate-400 font-medium leading-relaxed">
              You have
              <span class="text-white border-b-2 border-indigo-500/50"
                >{{ userApplications.length }} active applications</span
              >. Keep pushing for your dream tech role!
            </p>
          </div>
          <button
            @click="$router.push({ name: 'candidate.find-jobs' })"
            class="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-50 transition-all active:scale-95 flex items-center gap-3"
          >
            <i class="pi pi-search-plus"></i> Browse New Jobs
          </button>
        </div>
      </section>
    </div>

    <section class="max-w-[1400px] mx-auto px-10 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] hover:-translate-y-2 transition-all duration-500 group shadow-sm"
      >
        <div
          :class="stat.bg"
          class="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-transparent group-hover:rotate-6 transition-transform"
        >
          <i :class="[stat.icon, stat.color]" class="text-2xl"></i>
        </div>
        <p class="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
          {{ stat.label }}
        </p>
        <h3 class="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter">
          {{ stat.value }}
        </h3>
      </div>
    </section>

    <section class="max-w-[1400px] mx-auto px-10 py-10 mb-20">
      <div class="flex items-center justify-between mb-10 px-4">
        <h2
          class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic flex items-center gap-4"
        >
          <span class="w-10 h-[2px] bg-indigo-600"></span> Recent Applications
        </h2>
        <router-link
          to="/candidate/applications"
          class="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 hover:tracking-[0.3em] transition-all"
        >
          View All Trackers
        </router-link>
      </div>

      <div class="grid gap-6">
        <div
          v-for="app in recentApplications"
          :key="app.id"
          class="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div class="flex items-center gap-8">
            <div
              class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all"
            >
              {{ getJobTitle(app.job_id).charAt(0) }}
            </div>
            <div>
              <h4
                class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter group-hover:text-indigo-600 transition-colors leading-none mb-2"
              >
                {{ getJobTitle(app.job_id) }}
              </h4>
              <p class="text-slate-400 font-bold text-sm uppercase tracking-widest italic">
                Applied on: {{ new Date(app.created_at).toLocaleDateString() }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <span
              :class="statusStyle(app.status)"
              class="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-transparent"
            >
              {{ app.status }}
            </span>
            <div
              @click="$router.push({ name: 'candidate.applications' })"
              class="w-12 h-12 rounded-full bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center group-hover:rotate-45 transition-transform shadow-lg cursor-pointer"
            >
              <i class="pi pi-arrow-up-right text-xs"></i>
            </div>
          </div>
        </div>

        <div
          v-if="recentApplications.length === 0"
          class="text-center py-10 text-slate-400 font-bold italic"
        >
          No applications found. Start applying now!
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useCandidateStore } from '@/stores/candidate.store'
import { useJobsStore } from '@/stores/jobs'

const auth = useAuthStore()
const candidateStore = useCandidateStore()
const jobStore = useJobsStore()

onMounted(async () => {
  await jobStore.initialize()
  await candidateStore.initialize()
})

const userApplications = computed(() => {
  return candidateStore.applications || []
})

const recentApplications = computed(() => {
  return [...userApplications.value].reverse().slice(0, 3)
})

const getJobTitle = (jobId) => {
  const job = jobStore.jobs.find((j) => j.id == jobId)
  return job ? job.title : 'Software Engineer'
}

const stats = computed(() => [
  {
    label: 'Total Apps',
    value: userApplications.value.length,
    icon: 'pi pi-send',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
  },
  {
    label: 'In Review',
    value: userApplications.value.filter((a) => a.status?.toLowerCase() === 'pending').length,
    icon: 'pi pi-clock',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
  },
  {
    label: 'Interviews',
    value: userApplications.value.filter((a) => a.status?.toLowerCase().includes('interview'))
      .length,
    icon: 'pi pi-users',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
])

const statusStyle = (status) => {
  const s = status?.toLowerCase() || ''
  if (s.includes('interview')) return 'bg-amber-50 text-amber-600 dark:bg-amber-500/10'
  if (s.includes('pending')) return 'bg-slate-50 text-slate-500 dark:bg-slate-800/50'
  if (s.includes('reject')) return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'
  if (s.includes('offer')) return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10'
  return 'bg-slate-50 text-slate-500'
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
