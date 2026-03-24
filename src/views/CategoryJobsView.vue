<script setup>
import { computed, onMounted } from 'vue'
import { useJobsStore } from '../stores/jobs.js'
import { useRouter } from 'vue-router'
import JobCard from '@/features/jobs/components/JobCard.vue'
import { useRoute } from 'vue-router'

const jobStore = useJobsStore()
const router = useRouter()
const route = useRoute()
const categoryId = computed(() => Number(route.params.id))
const currentCategory = computed(() =>
  jobStore.categories.find((cat) => Number(cat.id) === categoryId.value),
)
const jobs = computed(() => jobStore.jobsByCategory(categoryId.value))

onMounted(() => {
  jobStore.initialize()
})

const goBack = () => router.push({ name: 'categories' })
</script>

<template>
  <div class="font-['Plus_Jakarta_Sans',sans-serif]">
    <button
      @click="goBack"
      class="mb-6 text-xs font-black uppercase tracking-[0.16em] text-slate-500 hover:text-sky-700 dark:hover:text-sky-300"
    >
      <i class="pi pi-arrow-left mr-2"></i>Back to categories
    </button>

    <header
      class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 mb-8"
    >
      <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
        {{ currentCategory?.name || 'Category Jobs' }}
      </h1>
      <p class="mt-2 text-slate-500 dark:text-slate-400">
        {{ jobs.length }} open position(s) in this category.
      </p>
    </header>

    <div v-if="jobStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="i in 6"
        :key="i"
        class="h-[250px] rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse"
      ></div>
    </div>

    <div v-else-if="jobs.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <JobCard v-for="job in jobs" :key="job.id" :job="job" />
    </div>

    <div v-else class="text-center py-20 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <p class="text-slate-500 dark:text-slate-400">No jobs found for this category yet.</p>
      <button
        @click="router.push({ name: 'public.jobs' })"
        class="mt-4 rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-sky-700"
      >
        Browse all jobs
      </button>
    </div>
  </div>
</template>
