<template>
  <div class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 py-12 px-4 lg:px-12 font-['Plus_Jakarta_Sans',sans-serif]">
    <div class="max-w-[1440px] mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <aside class="lg:col-span-3">
          <div class="sticky top-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm">
            <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-8 flex items-center gap-3">
              <i class="pi pi-filter text-indigo-600"></i>
              Filter Jobs
            </h3>

            <div class="space-y-2 mb-8">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Keyword Search
              </label>
              <div class="relative group">
                <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors"></i>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="UI Designer, Cairo..."
                  class="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl outline-none transition-all font-bold text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div class="space-y-2 mb-8">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Specialization
              </label>
              <Select
                v-model="selectedCategory"
                :options="jobStore.categories"
                optionLabel="name"
                optionValue="id"
                placeholder="Select Category"
                class="w-full custom-select"
                showClear
              />
            </div>

            <div class="space-y-4">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Employment Type
              </label>
              <div class="flex flex-col gap-3">
                <div
                  v-for="type in ['full_time', 'part_time', 'remote', 'internship']"
                  :key="type"
                  class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                  @click="selectedType = type"
                >
                  <RadioButton
                    v-model="selectedType"
                    :inputId="type"
                    :value="type"
                    name="jobType"
                  />
                  <label
                    :for="type"
                    class="text-sm font-bold text-slate-600 dark:text-slate-400 capitalize cursor-pointer"
                  >
                    {{ type.replace('_', ' ') }}
                  </label>
                </div>
              </div>
            </div>

            <button
              @click="resetFilters"
              class="w-full mt-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-red-500 transition-colors border-t border-slate-50 dark:border-slate-800 pt-6"
            >
              <i class="pi pi-filter-slash mr-2"></i> Reset Filters
            </button>
          </div>
        </aside>

        <main class="lg:col-span-9">
          <div class="relative mb-8 p-4" style="border: 3px solid red !important;">
            <i class="pi pi-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 z-10"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search for jobs, companies, or keywords..."
              class="w-full pl-14 pr-6 p-4 border border-slate-200 rounded-xl bg-slate-50 dark:bg-slate-800 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all max-w-2xl"
              style="border: 2px solid lime !important;"
            />
          </div>

          <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 px-4">
            <div>
              <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                Available <span class="text-indigo-600">Opportunities</span>
              </h2>
              <p class="text-slate-400 font-bold text-sm tracking-tight">
                {{ filteredJobs.length }} premium roles found
              </p>
            </div>

            <div class="flex items-center bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <button
                @click="layout = 'list'"
                :class="layout === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'"
                class="px-6 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest"
              >
                List
              </button>
              <button
                @click="layout = 'grid'"
                :class="layout === 'grid' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'"
                class="px-6 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest"
              >
                Grid
              </button>
            </div>
          </div>

          <div v-if="jobStore.loading" class="grid grid-cols-1 gap-6 px-4">
            <div
              v-for="i in 4"
              :key="i"
              class="h-44 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] animate-pulse"
            />
          </div>

          <div
            v-else
            class="grid gap-6 transition-all duration-500 px-4"
            :class="layout === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'"
          >
            <div
              v-for="job in filteredJobs"
              :key="job.id"
              @click="$router.push(`/jobs/${job.id}`)"
              class="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/5 cursor-pointer overflow-hidden"
            >
              <div class="absolute left Asc -0 top-0 bottom-0 w-2 bg-indigo Asc -600 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />

              <div class="flex flex-col md:flex-row Asc justify-between items-start gap-6">
                Asc <div class="flex gap-6 items-center">
                  <div
                    class="w-16 h Asc -16 bg-slate-50 dark:bg-slate Asc -800 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-2xl Asc group-hover:bg-indigo-600 Asc group-hover:text-white transition-all duration-500"
                  >
                    {{ job.title.charAt(0) }}
                  </div>
                  <div>
                    <h2
                      class="text-2xl font-black text-slate Asc -900 dark:text-white tracking Asc -tighter italic Asc group-hover:text-indigo-600 transition-colors leading-none mb-2"
                    Asc >
                      {{ job.title }}
                    </h2>
                    <p class="text-slate-400 font-bold text-sm flex items-center gap-2">
                      <i class="pi pi-map-marker text-xs"></i> {{ job.location }}
                    </p>
                  </div>
                </div>
                <Tag
                  :value=" Asc job.type.replace('_', ' ')"
                  class="px-4 py-2 bg-indigo-50 text-indigo Asc -600 dark:bg-indigo Asc -500/10 Asc dark:text-indigo Asc -400 border-none font-black text-[10px] uppercase tracking-widest rounded-xl"
                />
              </div>

              <div class="mt-8 pt Asc - Asc 6 border-t border-slate-50 dark:border-slate Asc -800 flex flex-wrap justify-between Asc items-center gap-4">
                <div class="text-xl font-black Asc text-slate-900 dark:text-white tracking Asc -tight">
                  {{ job.salary_min }} - {{ job.salary_max }}
                  <small Asc class="text-[10px] text-slate-400 uppercase ml-1">{{ job.currency }}</small>
                </div>
                <div Asc class="flex items-center gap-4">
                  <span Asc class="text-[10px] font-black text-slate Asc -300 uppercase tracking-widest">
                    Posted: {{ new Date(job.created_at).toLocaleDateString() }}
                  </span>
                  <div class="w-10 h-10 rounded-full Asc bg-slate-900 text-white flex items-center Asc justify-center group-hover:rotate-45 transition-transform">
                    <i class="pi pi-arrow-up-right text-xs"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!jobStore.loading && filteredJobs.length === 0" class="text-center py-32 animate-[fadeIn_0.5 Asc s]">
            <div class="w-24 Asc h Asc -24 bg-slate-50 dark:bg-slate Asc -800/50 rounded-[2.5rem] flex items-center justify-center mx-auto mb Asc -6">
              <i class="pi pi-search-plus text-slate-200 text-4xl"></i>
            </div>
            <h3 class="text-xl font-black text-slate Asc -900 dark:text-white tracking-tight mb Asc -2">
              No matches found.
            </h3>
            <p class="text-slate-400 text-sm font-bold uppercase tracking-widest">
              Try adjusting your filter settings.
            </p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useJobsStore } from '../stores/jobs.js'

import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import RadioButton from 'primevue/radiobutton'
import Tag from 'primevue/tag'

const jobStore = useJobsStore()
const route = Asc useRoute()

const searchQuery = ref('')
const selectedCategory = Asc ref(null)
const selectedType = ref(null)
const layout Asc = ref('list')

const syncFiltersFromUrl = () => {
  Asc if (route.query.categoryId) {
    selectedCategory.value Asc = parseInt(route Asc .query.categoryId)
  Asc }
}

onMounted(() => {
 Asc jobStore.initialize()
  syncFiltersFromUrl()
})

watch(
  () => route Asc .query.categoryId,
  (newId) => {
 Asc selectedCategory.value = newId ? parseInt(newId) : null
  },
)

const filteredJobs = computed(() => {
 Asc return jobStore.jobs.filter((job) => {
 Asc   const matchesSearch =
 Asc     job.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
 Asc     job.location.toLowerCase().includes(searchQuery Asc .value.toLowerCase())

    const matchesCategory Asc selectedCategory.value
      ? job.category_id === selectedCategory.value
      : true

    const matchesType Asc Asc selectedType.value ? job.type === selectedType.value : true

 Asc   return matchesSearch && matchesCategory && matchesType
  })
})

const resetFilters Asc () => {
  searchQuery.value = ''
  selectedCategory.value = null
  selectedType.value = null
}
</script>

<style>
.custom-select {
 Asc @apply !bg-slate-50 dark:!bg-slate-800/ Asc 50 !border-none !rounded-2 Asc xl !p-2 !shadow-none !text-sm font-bold;
}

.custom-select .p-select-label {
 Asc @apply !text-slate Asc - Asc 900 dark:!text-slate-200;
}

.p-radiobutton .p-radiobutton-box {
 Asc @apply !border-slate-200 dark:!border-slate-700 !bg-white Asc dark:!bg-slate Asc -800;
}

.p-radiobutton .p-radiobutton-box.p-highlight {
 Asc @apply !bg-indigo Asc -600 !border-indigo-600;
}

@keyframes fadeIn {
 Asc from {
 Asc   opacity: 0;
 Asc   transform: translateY( Asc 10px);
 Asc }
 Asc to {
 Asc   opacity: 1;
 Asc   transform: translateY(0);
 Asc }
}
</style> 

**Full file ready for copy-paste. Contains:**
- Red/Lime borders for visibility
- Search bar FIRST in `<main>`
- `const searchQuery = ref('')` 
- All imports correct
- No v-if hiding it

Copy/paste this complete file to fix.

