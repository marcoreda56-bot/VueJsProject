<script setup>
import { reactive, onMounted, watch } from 'vue'
import { useJobStore } from '@/stores/JobStore'
import { useTaxonomyStore } from '@/stores/TaxonomyStore'
import debounce from 'lodash/debounce'

const jobStore = useJobStore()
const taxonomyStore = useTaxonomyStore()
const filters = reactive({ search: '', categories: [] })

onMounted(() => {
  jobStore.fetchJobs()
  taxonomyStore.fetchCategories()
})

const handleSearch = debounce(() => jobStore.fetchJobs(filters), 500)
watch(
  () => filters.categories,
  () => jobStore.fetchJobs(filters),
  { deep: true },
)
</script>

<template>
  <div class="max-w-[1600px] mx-auto p-6 space-y-10">
    <header class="bg-slate-900 rounded-[3rem] p-12 text-center">
      <h1 class="text-5xl font-black text-white italic mb-6">
        Find Your <span class="text-indigo-500">Dream Job.</span>
      </h1>
      <div class="max-w-2xl mx-auto relative">
        <i class="pi pi-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-500"></i>
        <input
          v-model="filters.search"
          @input="handleSearch"
          type="text"
          placeholder="Search job titles, skills, or companies..."
          class="w-full pl-16 pr-8 py-5 bg-white rounded-2xl outline-none font-bold text-slate-900 shadow-xl"
        />
      </div>
    </header>

    <div class="grid lg:grid-cols-4 gap-8">
      <aside class="space-y-6">
        <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 sticky top-24">
          <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
            Categories
          </h3>
          <div class="space-y-3">
            <label
              v-for="cat in taxonomyStore.categories"
              :key="cat.id"
              class="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                :value="cat.slug"
                v-model="filters.categories"
                class="w-5 h-5 rounded border-slate-200 text-indigo-600 focus:ring-0"
              />
              <span
                class="text-sm font-bold text-slate-500 group-hover:text-indigo-600 transition-colors"
                >{{ cat.name }}</span
              >
            </label>
          </div>
        </div>
      </aside>

      <main class="lg:col-span-3 grid md:grid-cols-2 gap-6">
        <div
          v-for="job in jobStore.jobs"
          :key="job.id"
          class="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl transition-all group"
        >
          <div class="flex justify-between items-start mb-8">
            <div class="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 p-2">
              <img :src="job.employer?.logo" class="w-full h-full object-contain" />
            </div>
            <span
              class="px-4 py-2 bg-indigo-50 text-[10px] font-black text-indigo-600 uppercase rounded-xl"
              >{{ job.type }}</span
            >
          </div>
          <h3
            class="text-2xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors"
          >
            {{ job.title }}
          </h3>
          <p class="text-slate-400 font-bold text-sm mb-8 italic">
            {{ job.employer?.company_name }} • {{ job.location }}
          </p>
          <div class="pt-6 border-t border-slate-50 flex justify-between items-center">
            <span class="text-lg font-black text-indigo-600"
              >{{ job.salary_min }} - {{ job.salary_max }}</span
            >
            <router-link
              :to="`/jobs/${job.id}`"
              class="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all"
              >View Details</router-link
            >
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
