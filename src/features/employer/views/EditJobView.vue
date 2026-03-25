<template>
  <div class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-10">
        <div class="flex items-center gap-3 mb-2">
          <button
            @click="$router.push({ name: 'employer.manage-jobs' })"
            class="w-10 h-10 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <i class="pi pi-arrow-left text-sm"></i>
          </button>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Back to My Jobs</p>
        </div>
        <h1 class="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic leading-tight">
          Edit <span class="text-indigo-600">Job</span>
        </h1>
        <p class="text-slate-500 font-medium mt-2">Update your job listing details below.</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-24 text-slate-400 font-bold italic text-lg">
        Loading job details...
      </div>

      <!-- Not Found -->
      <div v-else-if="!form" class="text-center py-24">
        <h3 class="text-3xl font-black text-slate-900 dark:text-white italic mb-4">Job Not Found</h3>
        <button
          @click="$router.push({ name: 'employer.manage-jobs' })"
          class="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all"
        >
          Go Back
        </button>
      </div>

      <!-- Form Card -->
      <form v-else @submit.prevent="handleSubmit" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-sm space-y-8">

        <!-- Section: Basic Details -->
        <div>
          <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-5 flex items-center gap-3">
            <span class="w-6 h-[2px] bg-indigo-600"></span> Basic Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Job Title *</label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Category *</label>
              <select
                v-model="form.category_id"
                required
                class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="" disabled>Select category</option>
                <option v-for="cat in employerStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Location *</label>
              <input
                v-model="form.location"
                type="text"
                required
                class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Work Type *</label>
              <div class="flex gap-3">
                <button
                  v-for="type in workTypes"
                  :key="type.value"
                  type="button"
                  @click="form.work_type = type.value"
                  :class="form.work_type === type.value
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700 hover:border-indigo-300'"
                  class="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all"
                >
                  {{ type.label }}
                </button>
              </div>
            </div>
            <div>
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Experience Level</label>
              <select
                v-model="form.experience_level"
                class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="">Any level</option>
                <option value="junior">Junior (0-2 yrs)</option>
                <option value="mid">Mid-level (2-5 yrs)</option>
                <option value="senior">Senior (5+ yrs)</option>
                <option value="lead">Lead / Principal</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Section: Salary -->
        <div>
          <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-5 flex items-center gap-3">
            <span class="w-6 h-[2px] bg-indigo-600"></span> Salary Range (EGP / Month)
          </h3>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Min Salary</label>
              <input
                v-model.number="form.salary_min"
                type="number"
                min="0"
                class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Max Salary</label>
              <input
                v-model.number="form.salary_max"
                type="number"
                min="0"
                class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        <!-- Section: Technologies -->
        <div>
          <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-5 flex items-center gap-3">
            <span class="w-6 h-[2px] bg-indigo-600"></span> Technologies / Skills
          </h3>
          <div class="flex gap-3 mb-4">
            <input
              v-model="techInput"
              type="text"
              placeholder="Add technology (press Enter)"
              @keydown.enter.prevent="addTech"
              class="flex-1 px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
            />
            <button
              type="button"
              @click="addTech"
              class="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all"
            >
              Add
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(tech, i) in form.technologies"
              :key="tech"
              class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-black border border-indigo-100 dark:border-indigo-500/20"
            >
              {{ tech }}
              <button type="button" @click="removeTech(i)" class="text-indigo-400 hover:text-red-500 transition-colors">
                <i class="pi pi-times text-[9px]"></i>
              </button>
            </span>
          </div>
        </div>

        <!-- Section: Description -->
        <div>
          <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-5 flex items-center gap-3">
            <span class="w-6 h-[2px] bg-indigo-600"></span> Job Description *
          </h3>
          <textarea
            v-model="form.description"
            required
            rows="5"
            class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
          ></textarea>
        </div>

        <!-- Section: Requirements -->
        <div>
          <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-5 flex items-center gap-3">
            <span class="w-6 h-[2px] bg-indigo-600"></span> Requirements *
          </h3>
          <textarea
            v-model="form.requirements"
            required
            rows="5"
            class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
          ></textarea>
        </div>

        <!-- Section: Benefits -->
        <div>
          <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-5 flex items-center gap-3">
            <span class="w-6 h-[2px] bg-indigo-600"></span> Benefits
          </h3>
          <textarea
            v-model="form.benefits"
            rows="4"
            class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
          <button
            type="button"
            @click="$router.push({ name: 'employer.manage-jobs' })"
            class="px-8 py-4 border border-slate-200 dark:border-slate-700 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-500 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <i class="pi pi-save"></i>
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployerStore } from '@/stores/employer.store'
import { jobsApi } from '@/api/services/api'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const employerStore = useEmployerStore()

const loading = ref(true)
const saving = ref(false)
const form = ref(null)
const techInput = ref('')

const workTypes = [
  { label: 'Remote', value: 'remote' },
  { label: 'Onsite', value: 'onsite' },
  { label: 'Hybrid', value: 'hybrid' },
]

onMounted(async () => {
  if (!employerStore.categories.length) {
    await employerStore.fetchCategories()
  }

  // Try local store first
  let job = employerStore.getJobById(route.params.id)

  // If not in store, fetch from API
  if (!job) {
    try {
      const res = await jobsApi.getById(route.params.id)
      job = res.data
    } catch {
      job = null
    }
  }

  if (job) {
    form.value = {
      ...job,
      technologies: Array.isArray(job.technologies) ? [...job.technologies] : [],
      salary_min: job.salary_min || '',
      salary_max: job.salary_max || '',
      experience_level: job.experience_level || '',
      benefits: job.benefits || '',
    }
  }

  loading.value = false
})

const addTech = () => {
  const val = techInput.value.trim()
  if (val && !form.value.technologies.includes(val)) {
    form.value.technologies.push(val)
  }
  techInput.value = ''
}

const removeTech = (i) => {
  form.value.technologies.splice(i, 1)
}

const handleSubmit = async () => {
  saving.value = true
  try {
    await employerStore.updateJob(route.params.id, form.value)

    await Swal.fire({
      title: 'Changes Saved!',
      text: 'Your job listing has been updated.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      customClass: { popup: 'rounded-[2rem] p-10' },
    })

    router.push({ name: 'employer.manage-jobs' })
  } catch {
    Swal.fire({
      title: 'Error',
      text: 'Failed to save changes. Please try again.',
      icon: 'error',
      customClass: { popup: 'rounded-[2rem] p-10' },
    })
  } finally {
    saving.value = false
  }
}
</script>
