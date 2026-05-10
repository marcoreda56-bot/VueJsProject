<script setup>
import { reactive, ref, onMounted, watch, computed } from 'vue'
import { useJobStore } from '@/stores/JobStore'
import { useTaxonomyStore } from '@/stores/TaxonomyStore'
import { useAuthStore } from '@/stores/AuthStore'
import debounce from 'lodash/debounce'

const jobStore = useJobStore()
const taxonomyStore = useTaxonomyStore()
const authStore = useAuthStore()
const filters = reactive({
  search: '',
  categories: [],
  types: [],
  workplaces: [],
  experience: [],
  location: '',
  salary_min: null,
  salary_max: null,
  sort: 'created_at:desc',
})

const showMobileFilters = ref(false)
const resultCount = computed(() => jobStore.jobs?.length || 0)

onMounted(() => {
  jobStore.fetchJobs()
  taxonomyStore.fetchCategories()
})

const handleSearch = debounce(() => {
  jobStore.fetchJobs(filters)
}, 500)

const buildApiFilters = () => {
  const params = {
    search: filters.search || undefined,
    sort: filters.sort,
  }
  if (filters.categories.length > 0) params.category = filters.categories[0]
  if (filters.types.length > 0) params.type = filters.types[0]
  if (filters.workplaces.length > 0) params.workplace = filters.workplaces[0]
  if (filters.experience.length > 0) params.experience = filters.experience[0]
  if (filters.location) params.location = filters.location
  if (filters.salary_min) params.salary_min = filters.salary_min
  if (filters.salary_max) params.salary_max = filters.salary_max
  return params
}

const applyFilters = () => {
  jobStore.fetchJobs(buildApiFilters())
}

watch(
  () => [filters.categories, filters.types, filters.workplaces, filters.experience, filters.sort],
  () => applyFilters(),
  { deep: true },
)

const clearAllFilters = () => {
  filters.search = ''
  filters.categories = []
  filters.types = []
  filters.workplaces = []
  filters.experience = []
  filters.location = ''
  filters.salary_min = null
  filters.salary_max = null
  filters.sort = 'created_at:desc'
  applyFilters()
}

const hasActiveFilters = computed(() => {
  return filters.categories.length > 0 ||
    filters.types.length > 0 ||
    filters.workplaces.length > 0 ||
    filters.experience.length > 0 ||
    filters.location ||
    filters.salary_min ||
    filters.salary_max ||
    filters.search
})

const formatSalary = (min, max, currency = 'EGP') => {
  if (!min && !max) return 'Salary not disclosed'
  if (!max) return `${Number(min).toLocaleString()} ${currency}+`
  if (!min) return `Up to ${Number(max).toLocaleString()} ${currency}`
  return `${Number(min).toLocaleString()} - ${Number(max).toLocaleString()} ${currency}`
}

const timeAgo = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays < 1) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return `${Math.floor(diffDays / 30)}mo ago`
}

const jobTypeClass = (type) => {
  const map = {
    full_time: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    part_time: 'bg-amber-50 text-amber-700 border-amber-100',
    contract: 'bg-purple-50 text-purple-700 border-purple-100',
    freelance: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    internship: 'bg-blue-50 text-blue-700 border-blue-100',
  }
  return map[type] || 'bg-slate-50 text-slate-600 border-slate-100'
}

const workplaceClass = (type) => {
  const map = {
    remote: 'bg-sky-50 text-sky-700 border-sky-100',
    on_site: 'bg-rose-50 text-rose-700 border-rose-100',
    hybrid: 'bg-violet-50 text-violet-700 border-violet-100',
  }
  return map[type] || 'bg-slate-50 text-slate-600 border-slate-100'
}

const experienceClass = (level) => {
  const map = {
    junior: 'bg-teal-50 text-teal-700 border-teal-100',
    mid: 'bg-orange-50 text-orange-700 border-orange-100',
    senior: 'bg-red-50 text-red-700 border-red-100',
    lead: 'bg-pink-50 text-pink-700 border-pink-100',
    executive: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  }
  return map[level] || 'bg-slate-50 text-slate-600 border-slate-100'
}

const typeOptions = [
  { value: 'full_time', label: 'Full Time', icon: 'pi pi-clock' },
  { value: 'part_time', label: 'Part Time', icon: 'pi pi-clock' },
  { value: 'contract', label: 'Contract', icon: 'pi pi-file' },
  { value: 'freelance', label: 'Freelance', icon: 'pi pi-briefcase' },
  { value: 'internship', label: 'Internship', icon: 'pi pi-graduation-cap' },
]

const workplaceOptions = [
  { value: 'remote', label: 'Remote', icon: 'pi pi-globe' },
  { value: 'on_site', label: 'On-Site', icon: 'pi pi-building' },
  { value: 'hybrid', label: 'Hybrid', icon: 'pi pi-arrows-h' },
]

const experienceOptions = [
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid-Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'executive', label: 'Executive' },
]

const sortOptions = [
  { value: 'created_at:desc', label: 'Newest First' },
  { value: 'created_at:asc', label: 'Oldest First' },
  { value: 'salary_max:desc', label: 'Highest Salary' },
  { value: 'applications_count:desc', label: 'Most Popular' },
]
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <!-- Hero Section -->
    <div class="relative bg-slate-900 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-emerald-900/20"></div>
      <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 32px 32px;"></div>

      <div class="relative max-w-[1600px] mx-auto px-6 py-16 md:py-24 text-center">
        <h1 class="text-4xl md:text-6xl font-black text-white italic tracking-tighter mb-4">
          Find Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Dream Job.</span>
        </h1>
        <p class="text-slate-400 text-sm md:text-base font-medium max-w-xl mx-auto mb-10">
          Discover thousands of opportunities from top companies. Filter by role, location, salary, and more.
        </p>

        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto">
          <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-indigo-500/10 flex items-center overflow-hidden">
            <i class="pi pi-search absolute left-5 text-slate-400 text-lg"></i>
            <input
              v-model="filters.search"
              @input="handleSearch"
              type="text"
              placeholder="Search job titles, skills, or companies..."
              class="flex-1 pl-14 pr-32 py-5 bg-transparent outline-none font-bold text-slate-900 dark:text-white text-sm"
            />
            <div class="absolute right-3 flex items-center gap-2">
              <button
                v-if="filters.search"
                @click="filters.search = ''; handleSearch()"
                class="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i class="pi pi-times text-xs"></i>
              </button>
              <button class="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all">
                Search
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Filter Toggle -->
        <button
          @click="showMobileFilters = !showMobileFilters"
          class="lg:hidden mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur text-white rounded-xl text-xs font-black uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all"
        >
          <i class="pi pi-sliders-h"></i>
          Filters
          <span v-if="hasActiveFilters" class="w-2 h-2 bg-emerald-400 rounded-full"></span>
        </button>
      </div>
    </div>

    <div class="max-w-[1600px] mx-auto px-4 md:px-6 py-10">
      <div class="grid lg:grid-cols-[320px_1fr] gap-8">
        <!-- Sidebar Filters -->
        <aside
          :class="[
            'space-y-6 transition-all',
            showMobileFilters ? 'block' : 'hidden lg:block',
          ]"
        >
          <!-- Active Filters Bar -->
          <div v-if="hasActiveFilters" class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Active Filters</h3>
              <button @click="clearAllFilters" class="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-600 transition-colors">
                Clear All
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-for="cat in filters.categories" :key="cat" class="text-[10px] font-black bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg flex items-center gap-1">
                {{ cat }}
                <i @click="filters.categories = filters.categories.filter(c => c !== cat); applyFilters()" class="pi pi-times cursor-pointer hover:text-rose-500"></i>
              </span>
              <span v-for="type in filters.types" :key="type" class="text-[10px] font-black bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg flex items-center gap-1">
                {{ typeOptions.find(t => t.value === type)?.label }}
                <i @click="filters.types = filters.types.filter(t => t !== type); applyFilters()" class="pi pi-times cursor-pointer hover:text-rose-500"></i>
              </span>
              <span v-for="wp in filters.workplaces" :key="wp" class="text-[10px] font-black bg-sky-50 text-sky-700 px-3 py-1.5 rounded-lg flex items-center gap-1">
                {{ workplaceOptions.find(w => w.value === wp)?.label }}
                <i @click="filters.workplaces = filters.workplaces.filter(w => w !== wp); applyFilters()" class="pi pi-times cursor-pointer hover:text-rose-500"></i>
              </span>
            </div>
          </div>

          <!-- Categories -->
          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5">
              <i class="pi pi-tag mr-1"></i> Categories
            </h3>
            <div v-if="taxonomyStore.loading" class="space-y-3">
              <div v-for="i in 5" :key="i" class="h-8 bg-slate-50 dark:bg-slate-800 rounded-xl animate-pulse"></div>
            </div>
            <div v-else class="space-y-2">
              <label
                v-for="cat in taxonomyStore.categories"
                :key="cat.id"
                class="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <input
                  type="checkbox"
                  :value="cat.slug"
                  v-model="filters.categories"
                  class="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">{{ cat.name }}</span>
                <span v-if="cat.jobs_count" class="ml-auto text-[10px] font-black text-slate-300 dark:text-slate-600">{{ cat.jobs_count }}</span>
              </label>
            </div>
          </div>

          <!-- Job Type -->
          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5">
              <i class="pi pi-briefcase mr-1"></i> Job Type
            </h3>
            <div class="space-y-2">
              <label
                v-for="opt in typeOptions"
                :key="opt.value"
                class="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <input
                  type="checkbox"
                  :value="opt.value"
                  v-model="filters.types"
                  class="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500"
                />
                <i :class="opt.icon" class="text-xs text-slate-400 group-hover:text-indigo-500 transition-colors"></i>
                <span class="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">{{ opt.label }}</span>
              </label>
            </div>
          </div>

          <!-- Workplace -->
          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5">
              <i class="pi pi-globe mr-1"></i> Workplace
            </h3>
            <div class="space-y-2">
              <label
                v-for="opt in workplaceOptions"
                :key="opt.value"
                class="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <input
                  type="checkbox"
                  :value="opt.value"
                  v-model="filters.workplaces"
                  class="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500"
                />
                <i :class="opt.icon" class="text-xs text-slate-400 group-hover:text-indigo-500 transition-colors"></i>
                <span class="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">{{ opt.label }}</span>
              </label>
            </div>
          </div>

          <!-- Experience Level -->
          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5">
              <i class="pi pi-chart-line mr-1"></i> Experience
            </h3>
            <div class="space-y-2">
              <label
                v-for="opt in experienceOptions"
                :key="opt.value"
                class="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <input
                  type="checkbox"
                  :value="opt.value"
                  v-model="filters.experience"
                  class="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">{{ opt.label }}</span>
              </label>
            </div>
          </div>

          <!-- Salary Range -->
          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5">
              <i class="pi pi-money-bill mr-1"></i> Salary Range
            </h3>
            <div class="space-y-4">
              <div>
                <label class="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Min Salary</label>
                <input
                  v-model.number="filters.salary_min"
                  type="number"
                  placeholder="e.g. 5000"
                  class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  @change="applyFilters"
                />
              </div>
              <div>
                <label class="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Max Salary</label>
                <input
                  v-model.number="filters.salary_max"
                  type="number"
                  placeholder="e.g. 20000"
                  class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  @change="applyFilters"
                />
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="space-y-6">
          <!-- Toolbar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <h2 class="text-lg font-black text-slate-900 dark:text-white tracking-tighter">
                {{ resultCount }} job{{ resultCount === 1 ? '' : 's' }} found
              </h2>
              <div v-if="jobStore.loading" class="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div class="flex items-center gap-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort By</label>
              <select
                v-model="filters.sort"
                class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>
          </div>

          <!-- Loading Skeletons -->
          <div v-if="jobStore.loading && !jobStore.jobs?.length" class="grid md:grid-cols-2 gap-6">
            <div v-for="i in 6" :key="i" class="bg-white dark:bg-slate-900 rounded-[2rem] p-7 border border-slate-100 dark:border-slate-800 animate-pulse">
              <div class="flex items-start justify-between mb-6">
                <div class="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
                <div class="w-20 h-7 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
              </div>
              <div class="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg w-3/4 mb-2"></div>
              <div class="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/2 mb-8"></div>
              <div class="flex gap-2 mb-6">
                <div class="w-16 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                <div class="w-16 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
              </div>
              <div class="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!jobStore.loading && (!jobStore.jobs || jobStore.jobs.length === 0)" class="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
            <div class="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-search text-slate-300 text-2xl"></i>
            </div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white mb-2">No jobs found</h3>
            <p class="text-slate-400 text-sm font-medium mb-6">Try adjusting your filters or search terms</p>
            <button @click="clearAllFilters" class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all">
              Clear All Filters
            </button>
          </div>

          <!-- Job Cards -->
          <div v-else class="grid md:grid-cols-2 gap-6">
            <div
              v-for="job in jobStore.jobs"
              :key="job.id"
              class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-200 dark:hover:border-indigo-900/30 transition-all group"
            >
              <div class="p-7">
                <!-- Top Row: Logo + Meta -->
                <div class="flex items-start justify-between gap-4 mb-5">
                  <div class="flex items-center gap-4 min-w-0">
                    <div class="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-2 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        :src="job.employer?.logo_url || '/default-logo.png'"
                        class="w-full h-full object-contain"
                        alt="Company logo"
                      />
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">{{ job.employer?.company_name }}</p>
                      <p class="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                        <i class="pi pi-map-marker text-[9px]"></i>
                        {{ job.city || job.location || 'Remote' }}
                      </p>
                    </div>
                  </div>
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex-shrink-0">
                    {{ timeAgo(job.created_at) }}
                  </span>
                </div>

                <!-- Title -->
                <h3 class="text-xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                  {{ job.title }}
                </h3>

                <!-- Badges Row -->
                <div class="flex flex-wrap gap-2 mb-5">
                  <span :class="jobTypeClass(job.type)" class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border">
                    {{ job.type?.replace('_', ' ') }}
                  </span>
                  <span :class="workplaceClass(job.workplace_type)" class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border">
                    {{ job.workplace_type?.replace('_', ' ') }}
                  </span>
                  <span :class="experienceClass(job.experience_level)" class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border">
                    {{ job.experience_level }}
                  </span>
                </div>

                <!-- Skills Chips -->
                <div v-if="job.skills && job.skills.length > 0" class="flex flex-wrap gap-1.5 mb-5">
                  <span
                    v-for="skill in job.skills.slice(0, 4)"
                    :key="skill.id || skill.skill_id"
                    class="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg"
                  >
                    {{ skill.skill?.name || skill.name }}
                  </span>
                  <span v-if="job.skills.length > 4" class="text-[10px] font-bold text-slate-400 dark:text-slate-500 px-2 py-1">
                    +{{ job.skills.length - 4 }} more
                  </span>
                </div>

                <!-- Footer -->
                <div class="flex items-center justify-between pt-5 border-t border-slate-50 dark:border-slate-800">
                  <div>
                    <p class="text-sm font-black text-indigo-600 dark:text-indigo-400">
                      {{ formatSalary(job.salary_min, job.salary_max, job.currency) }}
                    </p>
                    <p v-if="job.vacancies > 1" class="text-[10px] font-bold text-slate-400 mt-0.5">
                      {{ job.vacancies }} open positions
                    </p>
                  </div>

                  <!-- Guest: Login to apply -->
                  <template v-if="!authStore.isAuthenticated">
                    <router-link
                      :to="`/login?redirect=/jobs/${job.id}`"
                      class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                      Log in to apply
                    </router-link>
                  </template>
                  <!-- Candidate: View + Apply -->
                  <template v-else-if="authStore.userRole === 'candidate'">
                    <div class="flex items-center gap-2">
                      <router-link
                        :to="`/jobs/${job.id}`"
                        class="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                      >
                        View
                      </router-link>
                      <router-link
                        :to="`/jobs/${job.id}`"
                        class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
                      >
                        Apply
                      </router-link>
                    </div>
                  </template>
                  <!-- Other roles: View only -->
                  <template v-else>
                    <router-link
                      :to="`/jobs/${job.id}`"
                      class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                      View Details
                    </router-link>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
