<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useJobStore } from '@/stores/JobStore'
import { useTaxonomyStore } from '@/stores/TaxonomyStore'

const jobStore = useJobStore()
const taxonomyStore = useTaxonomyStore()
const route = useRoute()

const filters = ref({
  search: '',
  category: route.query.category || '',
  type: '',
})

const fetchFilteredJobs = () => {
  jobStore.fetchJobs({
    q: filters.value.search,
    category: filters.value.category,
    type: filters.value.type,
  })
}

watch(
  () => route.query.category,
  (newCat) => {
    filters.value.category = newCat || ''
    fetchFilteredJobs()
  },
)

watch([() => filters.value.category, () => filters.value.type], () => {
  fetchFilteredJobs()
})

onMounted(async () => {
  await Promise.all([taxonomyStore.fetchCategories(), fetchFilteredJobs()])
})
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-['Outfit'] p-6 md:p-12">
    <div class="max-w-[1600px] mx-auto">
      <header class="mb-16 animate-[fadeIn_0.5s_ease-out]">
        <h1 class="text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-4">
          Explore <span class="text-indigo-600">Opportunities.</span>
        </h1>
        <p class="text-slate-400 font-medium text-lg">
          Direct access to Egypt's most prestigious tech roles.
        </p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <!-- Sidebar: Filters -->
        <aside class="space-y-10">
          <div
            class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-500/5"
          >
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 mb-8">
              Search & Filter
            </h3>

            <div class="space-y-8">
              <!-- Search Input -->
              <div class="relative">
                <input
                  v-model="filters.search"
                  @input="fetchFilteredJobs"
                  type="text"
                  placeholder="Job title or keyword..."
                  class="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
                />
                <i class="pi pi-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
              </div>

              <!-- Category Select -->
              <div class="space-y-4">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2"
                  >Category</label
                >
                <select
                  v-model="filters.category"
                  class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold text-slate-600 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                >
                  <option value="">All Categories</option>
                  <option v-for="cat in taxonomyStore.categories" :key="cat.id" :value="cat.slug">
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <!-- Job Type Filter -->
              <div class="space-y-4">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2"
                  >Job Type</label
                >
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="type in ['Full-time', 'Part-time', 'Remote', 'Freelance']"
                    :key="type"
                    @click="filters.type = filters.type === type ? '' : type"
                    :class="
                      filters.type === type
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                    "
                    class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                  >
                    {{ type }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content: Jobs List -->
        <main class="lg:col-span-3">
          <div v-if="jobStore.loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="i in 4"
              :key="i"
              class="h-64 bg-white dark:bg-slate-900 rounded-[2.5rem] animate-pulse border border-slate-100 dark:border-slate-800"
            ></div>
          </div>

          <div v-else-if="jobStore.jobs.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="job in jobStore.jobs"
              :key="job.id"
              @click="$router.push(`/jobs/${job.slug}`)"
              class="group p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 cursor-pointer relative overflow-hidden"
            >
              <div class="flex justify-between items-start mb-6">
                <div
                  class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700"
                >
                  <img
                    :src="
                      job.employer?.logo ||
                      `https://ui-avatars.com/api/?name=${job.employer?.company_name}&background=6366f1&color=fff`
                    "
                    class="w-full h-full object-cover"
                  />
                </div>
                <span
                  class="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-xl"
                >
                  {{ job.type }}
                </span>
              </div>

              <h3
                class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 group-hover:text-indigo-600 transition-colors"
              >
                {{ job.title }}
              </h3>
              <p class="text-slate-400 font-bold text-sm flex items-center gap-2 mb-6">
                <i class="pi pi-map-marker text-indigo-500"></i>
                {{ job.location || 'Cairo, Egypt' }}
              </p>

              <div
                class="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between"
              >
                <span class="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {{ job.salary_min }} - {{ job.salary_max }}
                  <small class="text-[10px] text-slate-400 uppercase ml-1">{{
                    job.currency
                  }}</small>
                </span>
                <div
                  class="w-12 h-12 rounded-full bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center group-hover:rotate-45 transition-transform shadow-lg"
                >
                  <i class="pi pi-arrow-up-right"></i>
                </div>
              </div>
            </div>
          </div>

          <div
            v-else
            class="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800"
          >
            <i class="pi pi-search text-4xl text-slate-200 mb-4"></i>
            <p class="text-slate-400 font-black uppercase tracking-widest text-xs">
              No matching opportunities found
            </p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

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
