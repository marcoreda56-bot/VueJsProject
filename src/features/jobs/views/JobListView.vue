<template>
  <div class="min-h-screen bg-[#F1F5F9] dark:bg-slate-950 font-['Outfit'] antialiased">
    <header
      class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30"
    >
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore <span class="text-indigo-600">Opportunities</span>
            </h1>
            <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Find your dream role from top-tier companies.
            </p>
          </div>

          <div class="relative w-full md:w-96">
            <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Job title, keywords, or company..."
              class="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            />
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 py-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside class="lg:col-span-3">
          <div class="sticky top-28 space-y-6">
            <div
              class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div class="flex items-center justify-between mb-6">
                <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <i class="pi pi-filter text-indigo-600"></i> Filters
                </h3>
                <button
                  @click="resetFilters"
                  class="text-xs text-indigo-600 hover:underline font-medium"
                >
                  Clear all
                </button>
              </div>

              <div class="mb-8">
                <label
                  class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 block"
                  >Job Type</label
                >
                <div class="space-y-2">
                  <div
                    v-for="type in jobTypes"
                    :key="type.id"
                    @click="toggleType(type.id)"
                    :class="
                      selectedType === type.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600'
                        : 'border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-200'
                    "
                    class="px-4 py-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-sm font-semibold"
                  >
                    {{ type.label }}
                    <div
                      v-if="selectedType === type.id"
                      class="w-2 h-2 rounded-full bg-indigo-600"
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <label
                  class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 block"
                  >Categories</label
                >
                <div class="grid grid-cols-1 gap-2">
                  <button
                    v-for="category in jobStore.categories"
                    :key="category.id"
                    @click="toggleCategory(category.id)"
                    :class="
                      selectedCategory === category.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    "
                    class="flex items-center gap-3 p-3 rounded-xl transition-all text-left text-sm font-medium"
                  >
                    <i
                      :class="[
                        getCategoryStyle(category.icon).icon,
                        selectedCategory === category.id
                          ? 'text-white'
                          : getCategoryStyle(category.icon).text,
                      ]"
                    ></i>
                    <span class="flex-1 truncate">{{ category.name }}</span>
                    <span class="text-[10px] opacity-60">{{ category.jobs_count || 0 }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main class="lg:col-span-9">
          <div class="flex items-center justify-between mb-6 px-2">
            <p class="text-slate-500 text-sm font-medium">
              Showing
              <span class="text-slate-900 dark:text-white font-bold">{{
                filteredJobs.length
              }}</span>
              jobs found
            </p>
          </div>

          <div
            v-if="filteredJobs.length === 0"
            class="bg-white dark:bg-slate-900 rounded-3xl p-20 text-center border border-dashed border-slate-300 dark:border-slate-700"
          >
            <div
              class="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <i class="pi pi-search text-indigo-500 text-3xl"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">No results found</h3>
            <p class="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
          </div>

          <div v-else class="grid grid-cols-1 gap-4">
            <div
              v-for="job in filteredJobs"
              :key="job.id"
              @click="$router.push({ name: 'candidate.job-details', params: { id: job.id } })"
              class="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl transition-all hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer relative overflow-hidden"
            >
              <div
                class="absolute top-0 left-0 w-1 h-0 bg-indigo-600 group-hover:h-full transition-all duration-300"
              ></div>

              <div class="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div
                  class="w-16 h-16 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700"
                >
                  <img
                    :src="`https://ui-avatars.com/api/?name=${getCompanyName(job.employer_id)}&background=6366f1&color=fff&bold=true`"
                    class="w-full h-full object-cover"
                  />
                </div>

                <div class="flex-1">
                  <div class="flex flex-wrap items-center gap-2 mb-1">
                    <h4
                      class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors"
                    >
                      {{ job.title }}
                    </h4>
                    <span
                      class="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold rounded uppercase"
                    >
                      {{ job.type }}
                    </span>
                  </div>

                  <div
                    class="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-500 dark:text-slate-400"
                  >
                    <span
                      class="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300"
                    >
                      <i class="pi pi-building text-xs"></i> {{ getCompanyName(job.employer_id) }}
                    </span>
                    <span class="flex items-center gap-1.5">
                      <i class="pi pi-map-marker text-xs"></i> {{ job.location }}
                    </span>
                    <span class="flex items-center gap-1.5">
                      <i class="pi pi-calendar text-xs"></i> 2 days ago
                    </span>
                  </div>
                </div>

                <div
                  class="sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 flex sm:flex-col justify-between items-center gap-2"
                >
                  <div class="text-lg font-bold text-slate-900 dark:text-white">
                    {{ job.currency }} {{ job.salary_min?.toLocaleString() }}
                  </div>
                  <button
                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'

const route = useRoute()
const jobStore = useJobsStore()
const searchQuery = ref(route.query.q || '')

watch(
  () => route.query.q,
  (newQ) => {
    searchQuery.value = newQ || ''
  },
)

const selectedType = ref(null)
const selectedCategory = ref(null)

const jobTypes = [
  { id: 'full_time', label: 'Full Time' },
  { id: 'remote', label: 'Remote' },
  { id: 'part_time', label: 'Part Time' },
]

const lucideToPrime = {
  Code: {
    icon: 'pi pi-desktop',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-100 dark:border-blue-800',
  },
  Palette: {
    icon: 'pi pi-palette',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    text: 'text-pink-600 dark:text-pink-400',
    border: 'border-pink-100 dark:border-pink-800',
  },
  LayoutDashboard: {
    icon: 'pi pi-th-large',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-100 dark:border-indigo-800',
  },
  Megaphone: {
    icon: 'pi pi-megaphone',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-100 dark:border-orange-800',
  },
  Database: {
    icon: 'pi pi-database',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-100 dark:border-emerald-800',
  },
  Briefcase: {
    icon: 'pi pi-chart-line',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-100 dark:border-purple-800',
  },
  Users: {
    icon: 'pi pi-users',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-100 dark:border-cyan-800',
  },
  Pencil: {
    icon: 'pi pi-pencil',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-100 dark:border-amber-800',
  },
}

const getCategoryStyle = (iconName) => {
  return (
    lucideToPrime[iconName] || {
      icon: 'pi pi-tag',
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-500 dark:text-slate-400',
      border: 'border-slate-200 dark:border-slate-700',
    }
  )
}

onMounted(async () => {
  await jobStore.initialize()

  if (route.query.category) {
    selectedCategory.value = String(route.query.category)
  }
})

const getCompanyName = (employerId) => {
  const employer = jobStore.employers.find((e) => String(e.id) === String(employerId))
  return employer?.company_name || 'HireMasr Partner'
}

const filteredJobs = computed(() => {
  return jobStore.jobs.filter((job) => {
    if (!job || !job.id || (!job.title && !job.slug)) return false

    const query = searchQuery.value.toLowerCase()

    const companyName = getCompanyName(job.employer_id).toLowerCase()

    const title = (job.title || '').toLowerCase()
    const location = (job.location || '').toLowerCase()

    const matchesSearch =
      title.includes(query) || companyName.includes(query) || location.includes(query)

    const currentJobType = job.type || job.work_type
    const matchesType = !selectedType.value || currentJobType === selectedType.value

    const matchesCategory =
      !selectedCategory.value || String(job.category_id) === String(selectedCategory.value)

    const isActive = job.status !== 'draft'
    return matchesSearch && matchesType && matchesCategory && isActive
  })
})

const toggleType = (id) => {
  selectedType.value = selectedType.value === id ? null : id
}

const toggleCategory = (id) => {
  selectedCategory.value = selectedCategory.value === id ? null : id
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedType.value = null
  selectedCategory.value = null
}
</script>