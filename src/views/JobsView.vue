<template>
  <div class="p-4 mx-auto" style="max-width: 1400px">
    <div class="grid">
      <div class="col-12 lg:col-3">
        <div class="p-card p-4 shadow-1 border-round-xl sticky top-0">
          <h3 class="font-bold mb-4 flex align-items-center gap-2">
            <i class="pi pi-filter text-primary"></i> Filter Jobs
          </h3>

          <div class="flex flex-column gap-2 mb-4">
            <label class="font-semibold text-700">Keyword</label>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-search" />
              <InputText v-model="searchQuery" placeholder="Developer, Cairo..." class="w-full" />
            </span>
          </div>

          <div class="flex flex-column gap-2 mb-4">
            <label class="font-semibold text-700">Category</label>
            <Select
              v-model="selectedCategory"
              :options="jobStore.categories"
              optionLabel="name"
              optionValue="id"
              placeholder="Select Category"
              class="w-full"
              showClear
            />
          </div>

          <div class="flex flex-column gap-2">
            <label class="font-semibold text-700">Job Type</label>
            <div class="flex flex-column gap-2">
              <div
                v-for="type in ['full_time', 'part_time', 'remote', 'internship']"
                :key="type"
                class="flex align-items-center gap-2"
              >
                <RadioButton v-model="selectedType" :inputId="type" :value="type" name="jobType" />
                <label :for="type" class="capitalize">{{ type.replace('_', ' ') }}</label>
              </div>
            </div>
          </div>

          <Button
            label="Reset Filters"
            icon="pi pi-filter-slash"
            class="p-button-text w-full mt-4"
            @click="resetFilters"
          />
        </div>
      </div>

      <div class="col-12 lg:col-9">
        <div class="flex justify-content-between align-items-center mb-4 px-2">
          <span class="text-600 font-medium">{{ filteredJobs.length }} Jobs found</span>
          <SelectButton v-model="layout" :options="['list', 'grid']" />
        </div>

        <div v-if="jobStore.loading" class="grid">
          <div v-for="i in 4" :key="i" class="col-12 p-3">
            <Skeleton height="150px" borderRadius="16px"></Skeleton>
          </div>
        </div>

        <div v-else class="grid">
          <div
            v-for="job in filteredJobs"
            :key="job.id"
            :class="layout === 'grid' ? 'col-12 md:col-6' : 'col-12'"
            class="p-2"
          >
            <div
              class="job-card-item p-4 border-round-xl shadow-1 bg-white hover:shadow-3 transition-all cursor-pointer"
              @click="$router.push(`/jobs/${job.id}`)"
            >
              <div class="flex justify-content-between align-items-start">
                <div class="flex gap-3">
                  <div
                    class="w-4rem h-4rem border-round bg-primary-50 flex align-items-center justify-content-center text-primary font-bold text-2xl shadow-sm"
                  >
                    {{ job.title.charAt(0) }}
                  </div>
                  <div>
                    <h4 class="m-0 text-xl font-bold text-900">{{ job.title }}</h4>
                    <p class="m-0 text-primary font-medium">{{ job.location }}</p>
                  </div>
                </div>
                <Tag :value="job.type" :severity="job.type === 'full_time' ? 'success' : 'info'" />
              </div>

              <div
                class="mt-4 flex justify-content-between align-items-center border-top-1 border-50 pt-3"
              >
                <span class="text-lg font-bold text-700">
                  {{ job.salary_min }} - {{ job.salary_max }} {{ job.currency }}
                </span>
                <span class="text-500 text-sm italic"
                  >Posted: {{ new Date(job.created_at).toLocaleDateString() }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <div v-if="!jobStore.loading && filteredJobs.length === 0" class="text-center py-8">
          <i class="pi pi-search-plus text-400 text-6xl mb-3"></i>
          <h3 class="text-600">No jobs match your search criteria.</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue' // ضيفنا watch
import { useRoute } from 'vue-router' // ضيفنا useRoute
import { useJobsStore } from '../stores/jobs.js'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import RadioButton from 'primevue/radiobutton'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Skeleton from 'primevue/skeleton'
import SelectButton from 'primevue/selectbutton'

const jobStore = useJobsStore()
const searchQuery = ref('')
const selectedCategory = ref(null)
const selectedType = ref(null)
const layout = ref('list')
const route = useRoute()

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

// منطق الفلترة (الـ Heart بتاع الصفحة)
const filteredJobs = computed(() => {
  return jobStore.jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.value.toLowerCase())
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

<style scoped>
.job-card-item {
  border: 1px solid #f0f0f0;
}
.job-card-item:hover {
  transform: translateX(5px);
  border-left: 4px solid var(--primary-color);
}
</style>
