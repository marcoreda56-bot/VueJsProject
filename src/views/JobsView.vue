<template>
  <div
    class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 py-12 px-4 lg:px-12 font-['Plus_Jakarta_Sans',sans-serif]"
  >
    <div class="max-w-[1440px] mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <aside class="lg:col-span-3">
          <div
            class="sticky top-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm"
          >
            <h3
              class="text-xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-8 flex items-center gap-3"
            >
              <i class="pi pi-filter text-indigo-600"></i> Filter Jobs
            </h3>

            <div class="space-y-2 mb-8">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"
                >Keyword Search</label
              >
              <div class="relative group">
                <i
                  class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors"
                ></i>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="UI Designer, Cairo..."
                  class="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl outline-none transition-all font-bold text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div class="space-y-2 mb-8">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"
                >Specialization</label
              >
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
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"
                >Employment Type</label
              >
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
                    >{{ type.replace('_', ' ') }}</label
                  >
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
          <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 px-4">
            <div>
              <h2
                class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic"
              >
                Available <span class="text-indigo-600">Opportunities</span>
              </h2>
              <p class="text-slate-400 font-bold text-sm tracking-tight">
                {{ filteredJobs.length }} premium roles found
              </p>
            </div>

            <div
              class="flex items-center bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
            >
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
            ></div>
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
              <div
                class="absolute left-0 top-0 bottom-0 w-2 bg-indigo-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-top"
              ></div>

              <div class="flex flex-col md:flex-row justify-between items-start gap-6">
                <div class="flex gap-6 items-center">
                  <div
                    class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500"
                  >
                    {{ job.title.charAt(0) }}
                  </div>
                  <div>
                    <h4
                      class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic group-hover:text-indigo-600 transition-colors leading-none mb-2"
                    >
                      {{ job.title }}
                    </h4>
                    <p class="text-slate-400 font-bold text-sm flex items-center gap-2">
                      <i class="pi pi-map-marker text-xs"></i> {{ job.location }}
                    </p>
                  </div>
                </div>
                <Tag
                  :value="job.type.replace('_', ' ')"
                  class="px-4 py-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-none font-black text-[10px] uppercase tracking-widest rounded-xl"
                />
              </div>

              <div
                class="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex flex-wrap justify-between items-center gap-4"
              >
                <div class="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {{ job.salary_min }} - {{ job.salary_max }}
                  <small class="text-[10px] text-slate-400 uppercase ml-1">{{
                    job.currency
                  }}</small>
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    Posted: {{ new Date(job.created_at).toLocaleDateString() }}
                  </span>
                  <div
                    class="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:rotate-45 transition-transform"
                  >
                    <i class="pi pi-arrow-up-right text-xs"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="!jobStore.loading && filteredJobs.length === 0"
            class="text-center py-32 animate-[fadeIn_0.5s]"
          >
            <div
              class="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6"
            >
              <i class="pi pi-search-plus text-slate-200 text-4xl"></i>
            </div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
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
const route = useRoute()

const searchQuery = ref('')
const selectedCategory = ref(null)
const selectedType = ref(null)
const layout = ref('list')

const syncFiltersFromUrl = () => {
  if (route.query.categoryId) {
    selectedCategory.value = parseInt(route.query.categoryId)
  }
}

onMounted(() => {
  jobStore.initialize()
  syncFiltersFromUrl()
})

watch(
  () => route.query.categoryId,
  (newId) => {
    selectedCategory.value = newId ? parseInt(newId) : null
  },
)

const filteredJobs = computed(() => {
  return jobStore.jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesCategory = selectedCategory.value
      ? job.category_id === selectedCategory.value
      : true

    const matchesType = selectedType.value ? job.type === selectedType.value : true

    return matchesSearch && matchesCategory && matchesType
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = null
  selectedType.value = null
}
</script>

<style>
.custom-select {
  @apply !bg-slate-50 dark:!bg-slate-800/50 !border-none !rounded-2xl !p-2 !shadow-none !text-sm font-bold;
}

.custom-select .p-select-label {
  @apply !text-slate-900 dark:!text-slate-200;
}

.p-radiobutton .p-radiobutton-box {
  @apply !border-slate-200 dark:!border-slate-700 !bg-white dark:!bg-slate-800;
}

.p-radiobutton .p-radiobutton-box.p-highlight {
  @apply !bg-indigo-600 !border-indigo-600;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
