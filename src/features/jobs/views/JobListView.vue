<template>
  <div class="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 py-8 px-4 font-['Plus_Jakarta_Sans']">
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
      <h1 class="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic">
        Find Your <span class="text-indigo-600">Next.</span>
      </h1>

      <div class="w-full lg:w-[500px] relative group">
        <i
          class="pi pi-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors z-10"
        ></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search roles, companies, or locations (e.g. Cairo)..."
          class="w-full pl-16 pr-8 py-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] outline-none shadow-sm font-bold text-slate-900 dark:text-white transition-all focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <aside class="lg:col-span-3">
        <div
          class="sticky top-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[3rem] shadow-sm"
        >
          <h3
            class="text-xl font-black text-slate-900 dark:text-white italic mb-8 flex items-center gap-3"
          >
            <i class="pi pi-sliders-h text-indigo-600"></i> Filters
          </h3>

          <div class="space-y-4 mb-8">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2"
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
              class="px-6 py-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between font-black text-[10px] uppercase tracking-widest hover:scale-[1.02]"
            >
              {{ type.label }}
              <i v-if="selectedType === type.id" class="pi pi-check"></i>
            </div>
          </div>

          <button
            @click="resetFilters"
            class="w-full text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 transition-colors py-2"
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
                class="w-16 h-16 bg-slate-900 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-white font-black text-2xl group-hover:bg-indigo-600 transition-all shadow-inner"
              >
                {{ job.title.charAt(0) }}
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
import { ref, computed, onMounted } from 'vue'
import { useJobsStore } from '@/stores/jobs'

const jobStore = useJobsStore()
const searchQuery = ref('')
const selectedType = ref(null)

const jobTypes = [
  { id: 'full-time', label: 'Full Time' },
  { id: 'remote', label: 'Remote' },
  { id: 'part-time', label: 'Part Time' },
]

onMounted(() => jobStore.initialize())

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

    return matchesSearch && matchesType
  })
})

const toggleType = (id) => {
  selectedType.value = selectedType.value === id ? null : id
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedType.value = null
}
</script>
