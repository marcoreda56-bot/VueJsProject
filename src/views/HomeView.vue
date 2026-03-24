<template>
  <div class="font-['Plus_Jakarta_Sans',sans-serif] selection:bg-sky-100 dark:selection:bg-sky-800/40">
    <section
      class="relative overflow-hidden rounded-[2rem] border border-sky-100/70 dark:border-slate-800 bg-gradient-to-br from-sky-600 via-sky-700 to-cyan-700 px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20 text-white shadow-2xl shadow-sky-200/60 dark:shadow-none"
    >
      <div class="absolute -top-20 -left-12 h-56 w-56 rounded-full bg-white/20 blur-3xl"></div>
      <div class="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-cyan-300/25 blur-3xl"></div>

      <div class="relative z-10 grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div>
          <span
            class="inline-flex items-center rounded-full bg-white/15 border border-white/20 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.2em]"
          >
            Hiring made simple
          </span>
          <h1 class="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Find better jobs and
            <span class="text-cyan-200">hire faster</span>
            in Egypt.
          </h1>
          <p class="mt-5 max-w-2xl text-sky-100 text-base sm:text-lg leading-relaxed">
            One place for candidates, startups, and growing teams. Discover trusted opportunities
            and fill roles with confidence.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <button
              @click="$router.push('/jobs')"
              class="px-7 py-3.5 rounded-xl bg-white text-sky-700 font-extrabold text-xs uppercase tracking-[0.18em] hover:bg-sky-50 transition-all active:scale-[0.98] shadow-lg"
            >
              Explore Jobs
            </button>
            <button
              @click="$router.push('/auth/register')"
              class="px-7 py-3.5 rounded-xl bg-sky-900/30 border border-white/25 text-white font-extrabold text-xs uppercase tracking-[0.18em] hover:bg-sky-900/40 transition-all active:scale-[0.98]"
            >
              Join Free
            </button>
          </div>
        </div>

        <div class="lg:justify-self-end">
          <div class="rounded-2xl bg-white/10 border border-white/20 p-5 backdrop-blur-sm">
            <div class="flex -space-x-3">
              <img
                v-for="avatar in heroAvatars"
                :key="avatar"
                :src="avatar"
                alt="community member avatar"
                class="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
            </div>
            <p class="mt-4 text-sm font-semibold text-sky-100">Trusted by professionals and teams</p>
            <div class="mt-4 grid grid-cols-3 gap-2 text-center">
              <div class="rounded-xl bg-white/15 px-3 py-2">
                <p class="text-lg font-black">{{ stats.jobs }}</p>
                <p class="text-[10px] uppercase tracking-wider text-sky-100">Open Jobs</p>
              </div>
              <div class="rounded-xl bg-white/15 px-3 py-2">
                <p class="text-lg font-black">{{ stats.categories }}</p>
                <p class="text-[10px] uppercase tracking-wider text-sky-100">Categories</p>
              </div>
              <div class="rounded-xl bg-white/15 px-3 py-2">
                <p class="text-lg font-black">{{ stats.companies }}</p>
                <p class="text-[10px] uppercase tracking-wider text-sky-100">Companies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="pt-14">
      <div class="flex items-center justify-between gap-4 mb-7">
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Browse Categories
        </h2>
        <button
          @click="$router.push('/categories')"
          class="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 hover:text-sky-700 dark:hover:text-sky-300"
        >
          View all
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="cat in jobStore.categories.slice(0, 8)"
          :key="cat.id"
          @click="goToCategory(cat.id)"
          class="cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900 p-5 transition-all hover:border-sky-200 dark:hover:border-sky-700 hover:-translate-y-1 hover:shadow-lg"
        >
          <div
            class="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 flex items-center justify-center"
          >
            <i :class="cat.icon || 'pi pi-tag'" class="text-lg"></i>
          </div>
          <h3 class="mt-4 text-lg font-extrabold text-slate-900 dark:text-white">
            {{ cat.name }}
          </h3>
          <p class="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {{ jobStore.jobCountByCategory(cat.id) }} open positions
          </p>
        </div>
      </div>
    </section>

    <section class="pt-14">
      <div class="flex items-center justify-between gap-4 mb-7">
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Featured Jobs
        </h2>
        <button
          @click="$router.push('/jobs')"
          class="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 hover:text-sky-700 dark:hover:text-sky-300"
        >
          View all jobs
        </button>
      </div>

      <div v-if="jobStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="i in 6"
          :key="i"
          class="h-[250px] rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse"
        ></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="job in jobStore.featuredJobs()"
          :key="job.id"
          @click="goToJob(job.id)"
          class="group cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all hover:-translate-y-1 hover:border-sky-200 dark:hover:border-sky-700 hover:shadow-lg"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800/30 flex items-center justify-center"
              >
                <span class="text-sm font-black text-sky-700 dark:text-sky-300">
                  {{ (job.company_name || job.company || 'J').charAt(0) }}
                </span>
              </div>
              <p class="text-sm font-bold text-slate-500 dark:text-slate-400">
                {{ job.company_name || job.company || 'Unknown Company' }}
              </p>
            </div>
            <span
              class="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {{ job.type }}
            </span>
          </div>

          <h4 class="mt-5 text-xl font-black text-slate-900 dark:text-white leading-tight">
            {{ job.title }}
          </h4>
          <p class="mt-3 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <i class="pi pi-map-marker text-xs"></i> {{ job.location || 'Egypt' }}
          </p>

          <div class="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p class="text-sm font-black text-sky-700 dark:text-sky-300">
              {{ job.salary_min }} - {{ job.salary_max }}
              <span class="text-[11px] opacity-70">{{ job.currency }}</span>
            </p>
            <span
              class="w-9 h-9 rounded-full bg-sky-600 text-white flex items-center justify-center transition-transform group-hover:rotate-45"
            >
              <i class="pi pi-arrow-up-right text-xs"></i>
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '../stores/jobs'
import { useAuthStore } from '@/stores/auth.store'

const jobStore = useJobsStore()
const authStore = useAuthStore()
const router = useRouter()

const goToJob = (id) => router.push(`/jobs/${id}`)
const goToCategory = (id) => router.push({ name: 'public.jobs', query: { categoryId: id } })

const heroAvatars = [
  'https://i.pravatar.cc/80?img=12',
  'https://i.pravatar.cc/80?img=32',
  'https://i.pravatar.cc/80?img=48',
  'https://i.pravatar.cc/80?img=56',
]

const stats = computed(() => {
  const jobs = jobStore.jobs?.length || 0
  const categories = jobStore.categories?.length || 0
  const companies = new Set((jobStore.jobs || []).map((job) => job.company_name || job.company)).size
  return { jobs, categories, companies }
})

onMounted(() => {
  if (authStore.isAuthenticated && authStore.user) {
    const role = authStore.user.role
    router.replace({ name: `${role}.dashboard` })
    return
  }
  jobStore.initialize()
})
</script>

<style>
</style>
