<template>
  <div class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 py-12 px-4 lg:px-12 font-['Plus_Jakarta_Sans',sans-serif]">
    <div class="max-w-[1440px] mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <aside class="lg:col-span-3">
          <div class="sticky top-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm">
            <h3 class="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3 italic">
              <i class="pi pi-filter text-indigo-600"></i> Filter Jobs
            </h3>

            <div class="space-y-2 mb-8">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialization</label>
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
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Type</label>
              <div v-for="type in ['full_time', 'part_time', 'remote']" :key="type" 
                   class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl cursor-pointer">
                <RadioButton v-model="selectedType" :value="type" :name="type" />
                <label class="text-sm font-bold capitalize text-slate-600 dark:text-slate-400">{{ type.replace('_', ' ') }}</label>
              </div>
            </div>

            <button @click="resetFilters" class="w-full mt-10 py-4 text-[10px] font-black uppercase text-slate-400 hover:text-red-500 border-t border-slate-50 pt-6 transition-colors">
              <i class="pi pi-filter-slash mr-2"></i> Reset Filters
            </button>
          </div>
        </aside>

        <main class="lg:col-span-9">
          <div class="relative mb-12 group">
            <i class="pi pi-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-indigo-600 transition-colors"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search for jobs, companies, or keywords..."
              class="w-full pl-16 pr-6 py-6 border-2 border-indigo-50 dark:border-slate-800 rounded-[2rem] bg-white dark:bg-slate-900 shadow-xl focus:border-indigo-500 outline-none transition-all text-lg font-bold"
            />
          </div>

          <div class="flex justify-between items-center mb-8 px-4">
            <div>
              <h2 class="text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter">
                Available <span class="text-indigo-600">Opportunities</span>
              </h2>
              <p class="text-slate-400 font-bold text-sm">{{ filteredJobs.length }} jobs matching your criteria</p>
            </div>
          </div>

          <div v-if="jobStore.loading" class="space-y-6">
            <div v-for="i in 3" :key="i" class="h-40 bg-slate-100 animate-pulse rounded-[2.5rem]"></div>
          </div>

          <div v-else class="grid gap-6">
            <div v-for="job in filteredJobs" :key="job.id" @click="$router.push(`/jobs/${job.id}`)"
                 class="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] hover:-translate-y-2 hover:shadow-2xl transition-all cursor-pointer">
              <div class="flex justify-between items-start">
                <div class="flex gap-6 items-center">
                  <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {{ job.title.charAt(0) }}
                  </div>
                  <div>
                    <h3 class="text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600">{{ job.title }}</h3>
                    <p class="text-slate-400 font-bold"><i class="pi pi-map-marker text-xs"></i> {{ job.location }}</p>
                  </div>
                </div>
                <Tag :value="job.type.replace('_', ' ')" class="p-tag-info" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useJobsStore } from '../stores/jobs.js'
import Select from 'primevue/select'
import RadioButton from 'primevue/radiobutton'
import Tag from 'primevue/tag'

const jobStore = useJobsStore()
const route = useRoute()

const searchQuery = ref('')
const selectedCategory = ref(null)
const selectedType = ref(null)

onMounted(async () => {
  await jobStore.initialize()
  if (route.query.categoryId) {
    selectedCategory.value = parseInt(route.query.categoryId)
  }
})

const filteredJobs = computed(() => {
  return jobStore.jobs.filter(job => {
    const s = searchQuery.value.toLowerCase()
    const matchesSearch = job.title.toLowerCase().includes(s) || job.location.toLowerCase().includes(s)
    const matchesCat = selectedCategory.value ? job.category_id === selectedCategory.value : true
    const matchesType = selectedType.value ? job.type === selectedType.value : true
    return matchesSearch && matchesCat && matchesType
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = null
  selectedType.value = null
}
</script>