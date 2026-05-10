<template>
  <div class="space-y-8 animate-fadeIn">
    <button
      @click="$router.back()"
      class="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
    >
      <i class="pi pi-arrow-left"></i> Back to Jobs
    </button>

    <div v-if="employerStore.loading" class="flex justify-center py-20">
      <i class="pi pi-spin pi-spinner text-3xl text-indigo-600"></i>
    </div>

    <div v-else class="space-y-8">
      <!-- Pipeline Summary Chips -->
      <div v-if="pipelineSummary" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <button
          v-for="(count, stage) in pipelineSummary"
          :key="stage"
          @click="filterStage = filterStage === stage ? '' : stage"
          :class="filterStage === stage ? 'ring-2 ring-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'bg-white dark:bg-slate-900'"
          class="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center transition-all hover:shadow-md"
        >
          <p class="text-2xl font-black text-slate-900 dark:text-white">{{ count }}</p>
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{{ stage.replace('_', ' ') }}</p>
        </button>
      </div>

      <!-- Applications List -->
      <div class="space-y-4">
        <div v-if="filteredApplications.length === 0" class="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
          <i class="pi pi-inbox text-4xl text-slate-300 mb-4"></i>
          <p class="text-slate-400 font-bold uppercase text-xs tracking-widest">No applications for this stage.</p>
        </div>

        <div
          v-for="app in filteredApplications"
          :key="app.id"
          class="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-indigo-200 transition-all"
        >
          <div class="flex items-center gap-4">
            <img
              :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(app.candidate_snapshot?.name || 'U')}&background=6366f1&color=fff`"
              class="w-12 h-12 rounded-2xl object-cover"
            />
            <div>
              <p class="font-black text-slate-900 dark:text-white text-sm">
                {{ app.candidate_snapshot?.name || 'Unknown' }}
              </p>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {{ app.candidate_snapshot?.headline || 'Candidate' }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 flex-wrap">
            <span :class="statusClass(app.current_status)" class="text-[9px] font-black px-3 py-1 rounded-full uppercase">
              {{ app.current_status?.replace('_', ' ') }}
            </span>
            <span class="text-[10px] font-bold text-slate-400">
              {{ formatDate(app.applied_at) }}
            </span>
            <router-link
              :to="`/employer/applications/${app.id}`"
              class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
            >
              Review
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEmployerStore } from '@/stores/EmployerStore'

const route = useRoute()
const employerStore = useEmployerStore()
const filterStage = ref('')

const pipelineSummary = computed(() => employerStore.pipelineSummary)
const applications = computed(() => employerStore.jobApplications)

const filteredApplications = computed(() => {
  if (!filterStage.value) return applications.value
  return applications.value.filter((a) => a.current_status === filterStage.value)
})

onMounted(async () => {
  try {
    await employerStore.fetchJobApplications(route.params.jobId)
  } catch (err) {
    console.error('Failed to load job applications', err)
  }
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

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
</script>
