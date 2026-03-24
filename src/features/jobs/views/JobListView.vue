<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { jobsApi } from '@/api/services/api'
import JobCard from '../components/JobCard.vue'

const jobs = ref([])
const isLoading = ref(true)
const error = ref(null)
const route = useRoute()
const router = useRouter()

const selectedCategoryId = computed(() => Number(route.query.categoryId || 0))
const searchQuery = computed(() =>
  typeof route.query.q === 'string' ? route.query.q.trim().toLowerCase() : '',
)
const filteredJobs = computed(() => {
  const byCategory = selectedCategoryId.value
    ? jobs.value.filter((job) => Number(job.category_id) === selectedCategoryId.value)
    : jobs.value

  if (!searchQuery.value) return byCategory

  return byCategory.filter((job) => {
    const haystack = [
      job.title,
      job.company_name,
      job.company,
      job.location,
      job.type,
      job.category,
      job.description,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(searchQuery.value)
  })
})

// 1. Fetch Jobs from API
const fetchJobs = async () => {
  isLoading.value = true
  try {
    const response = await jobsApi.getAll()
    jobs.value = response.data
  } catch (err) {
    error.value = 'Failed to load jobs. Please try again later.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchJobs)
</script>

<template>
  <div class="font-['Plus_Jakarta_Sans',sans-serif]">
    <header
      class="rounded-[2rem] border border-sky-100 dark:border-slate-800 bg-white/85 dark:bg-slate-900 p-6 sm:p-8 mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <p class="text-[11px] font-black uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
          Live opportunities
        </p>
        <h1 class="mt-3 text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Explore Jobs
        </h1>
        <p class="mt-3 text-slate-500 dark:text-slate-400 max-w-xl">
          Browse active openings and discover your next move.
        </p>
      </div>
      <div class="flex flex-wrap gap-3 items-center">
        <div
          class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-5 py-3"
        >
          <p class="text-xl font-black text-slate-900 dark:text-white">{{ filteredJobs.length }}</p>
          <p class="text-[10px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Matching jobs
          </p>
        </div>
        <button
          v-if="selectedCategoryId || searchQuery"
          @click="router.push({ name: 'public.jobs' })"
          class="rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-[0.16em] bg-sky-600 text-white hover:bg-sky-700"
        >
          Clear Filters
        </button>
      </div>
    </header>

    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="i in 6"
        :key="i"
        class="h-[320px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 space-y-6 overflow-hidden relative"
      >
        <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
        <div class="space-y-3">
          <div class="h-6 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
          <div class="h-4 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>

    <div
      v-else-if="error"
      class="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-red-200/70 dark:border-red-500/30"
    >
      <p class="text-red-600 dark:text-red-300 font-semibold mb-4">{{ error }}</p>
      <button
        @click="fetchJobs"
        class="px-6 py-3 bg-sky-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-sky-700 transition-all"
      >
        Retry
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <JobCard v-for="job in filteredJobs" :key="job.id" :job="job" />
    </div>

    <div v-if="!isLoading && filteredJobs.length === 0" class="text-center py-24 opacity-70">
      <i class="pi pi-inbox text-5xl text-slate-300 dark:text-slate-700 mb-4"></i>
      <p class="text-slate-500 dark:text-slate-400 font-semibold">No jobs match this filter yet.</p>
    </div>
  </div>
</template>
