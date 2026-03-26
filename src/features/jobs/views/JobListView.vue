<template>
  <div class="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 py-8 px-4 font-['Plus_Jakarta_Sans']">
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
      <h1 class="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic">
        Find Your <span class="text-indigo-600">Next.</span>
      </h1>

      <div class="flex items-center gap-4 lg:ml-auto">
        <!-- Mobile Filter Toggle -->
        <button 
          @click="showFilters = !showFilters"
          class="lg:hidden w-16 h-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm transition-all active:scale-95"
          :class="{ 'bg-indigo-600 !text-white border-indigo-600 shadow-lg shadow-indigo-200': showFilters }"
        >
          <i :class="showFilters ? 'pi pi-times' : 'pi pi-sliders-h'" class="text-xl"></i>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <aside 
        class="lg:col-span-3 transition-all duration-500"
        :class="[showFilters ? 'block' : 'hidden lg:block']"
      >
        <div
          class="sticky top-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[3rem] shadow-sm"
        >
          <h3
            class="text-xl font-black text-slate-900 dark:text-white italic mb-8 flex items-center gap-3"
          >
            <i class="pi pi-sliders-h text-indigo-600"></i> Filters
          </h3>

          <div class="space-y-4 mb-8">
            <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2 italic"
              >Job Type</label
            >
            <div
              v-for="type in jobTypes"
              :key="type.id"
              @click="toggleType(type.id)"
              :class="
                selectedType === type.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-500'
              "
              class="px-6 py-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between font-bold text-[13px] uppercase tracking-wider hover:scale-[1.02] font-sans"
            >
              {{ type.label }}
              <i v-if="selectedType === type.id" class="pi pi-check"></i>
            </div>
          </div>

          <div class="space-y-4 mb-8">
            <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2 italic"
              >Category</label
            >
            <div
              v-for="category in jobStore.categories"
              :key="category.id"
              @click="toggleCategory(category.id)"
              :class="
                selectedCategory === category.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none translate-x-2'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              "
              class="px-6 py-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between font-bold text-[13px] uppercase tracking-wider hover:scale-[1.02] font-sans"
            >
              <div class="flex items-center gap-3">
                <div 
                  v-if="selectedCategory !== category.id"
                  :class="[getCategoryStyle(category.icon).bg, getCategoryStyle(category.icon).text]"
                  class="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                >
                   <i :class="getCategoryStyle(category.icon).icon" class="text-sm"></i>
                </div>
                <i v-else :class="getCategoryStyle(category.icon).icon" class="text-sm text-white"></i>
                {{ category.name }}
              </div>
              <span v-if="selectedCategory !== category.id" class="text-[9px] opacity-60"
                >({{ category.jobs_count || 0 }})</span
              >
              <i v-if="selectedCategory === category.id" class="pi pi-check"></i>
            </div>
          </div>

          <button
            @click="resetFilters"
            class="w-full text-[12px] font-black uppercase text-slate-400 hover:text-rose-500 transition-colors py-2"
          >
            Reset All Filters
          </button>
        </div>
      </aside>

      <main class="lg:col-span-9">
        <div v-if="filteredJobs.length === 0" class="text-center py-20">
          <div
            class="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <i class="pi pi-search text-slate-300 text-2xl"></i>
          </div>
          <p class="text-slate-500 font-bold uppercase tracking-widest text-xs">
            No opportunities found for "{{ searchQuery }}"
          </p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="job in filteredJobs"
            :key="job.id"
            @click="$router.push({ name: 'candidate.job-details', params: { id: job.id } })"
            class="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[3.5rem] transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer"
          >
            <div class="flex justify-between items-start mb-6">
              <div
                class="w-16 h-16 bg-slate-900 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-white font-black text-2xl group-hover:bg-indigo-600 transition-all shadow-inner overflow-hidden"
              >
                <img 
                  :src="`https://ui-avatars.com/api/?name=${getCompanyName(job.employer_id)}&background=1e293b&color=fff&bold=true&font-size=0.4`" 
                  :alt="getCompanyName(job.employer_id)" 
                  class="w-full h-full object-cover" 
                />
              </div>
              <span
                class="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest"
              >
                {{ job.type }}
              </span>
            </div>

            <h4
              class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-1 group-hover:text-indigo-600 transition-colors"
            >
              {{ job.title }}
            </h4>

            <p class="text-slate-400 font-bold text-xs uppercase mb-8 flex items-center gap-2">
              <span class="text-slate-900 dark:text-slate-200">{{
                getCompanyName(job.employer_id)
              }}</span>
              <span class="w-1 h-1 rounded-full bg-slate-300"></span>
              <i class="pi pi-map-marker text-indigo-500 text-[10px]"></i> {{ job.location }}
            </p>

            <div
              class="pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center"
            >
              <span class="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {{ job.salary_min?.toLocaleString() }} - {{ job.salary_max?.toLocaleString() }}
                <small class="text-indigo-600 uppercase ml-1">{{ job.currency }}</small>
              </span>
              <div
                class="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all"
              >
                <i class="pi pi-arrow-up-right text-xs"></i>
              </div>
            </div>
          </div>
        </div>
      </main>
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

watch(() => route.query.q, (newQ) => {
  searchQuery.value = newQ || ''
})

const selectedType = ref(null)
const selectedCategory = ref(null)
const showFilters = ref(false)

const jobTypes = [
  { id: 'full_time', label: 'Full Time' },
  { id: 'remote', label: 'Remote' },
  { id: 'part_time', label: 'Part Time' },
]

const lucideToPrime = {
  'Code': { icon: 'pi pi-desktop', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-800' },
  'Palette': { icon: 'pi pi-palette', bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-100 dark:border-pink-800' },
  'LayoutDashboard': { icon: 'pi pi-th-large', bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-800' },
  'Megaphone': { icon: 'pi pi-megaphone', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-100 dark:border-orange-800' },
  'Database': { icon: 'pi pi-database', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-800' },
  'Briefcase': { icon: 'pi pi-chart-line', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-800' },
  'Users': { icon: 'pi pi-users', bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-100 dark:border-cyan-800' },
  'Pencil': { icon: 'pi pi-pencil', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-800' }
}

const getCategoryStyle = (iconName) => {
  return lucideToPrime[iconName] || { 
    icon: 'pi pi-tag', 
    bg: 'bg-slate-100 dark:bg-slate-800', 
    text: 'text-slate-500 dark:text-slate-400',
    border: 'border-slate-200 dark:border-slate-700'
  }
}

onMounted(async () => {
  await jobStore.initialize()
  
  // Activate category if present in query
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
    const query = searchQuery.value.toLowerCase()
    const companyName = getCompanyName(job.employer_id).toLowerCase()

    const matchesSearch =
      job.title?.toLowerCase().includes(query) ||
      companyName.includes(query) ||
      job.location?.toLowerCase().includes(query)

    const matchesType = selectedType.value ? job.type === selectedType.value : true
    const matchesCategory = selectedCategory.value
      ? String(job.category_id) === String(selectedCategory.value)
      : true

    return matchesSearch && matchesType && matchesCategory
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
