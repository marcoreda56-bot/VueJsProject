<template>
  <div class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-['Outfit',sans-serif]">
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
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Employer Portal</p>
        </div>
        <h1 class="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic leading-tight">
          Post a <span class="text-indigo-600">New Job</span>
        </h1>
        <p class="text-slate-500 font-medium mt-2">Fill in all fields to reach the best candidates.</p>
      </div>

      <!-- Form Card -->
      <form @submit.prevent="handleSubmit" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-sm space-y-8">

        <!-- Section: Basic Details -->
        <div>
          <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-5 flex items-center gap-3">
            <span class="w-6 h-[2px] bg-indigo-600"></span> Basic Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Job Title <span class="text-rose-500">*</span></label>
              <input
                v-model="form.title"
                type="text"
                placeholder="e.g. Senior Frontend Developer"
                :class="[
                  errors.title ? 'border-rose-500 ring-rose-500' : 'border-slate-100 dark:border-slate-700 focus:ring-indigo-500',
                  'w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-slate-300'
                ]"
              />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Category <span class="text-rose-500">*</span></label>
              <select
                v-model="form.category_id"
                :class="[
                  errors.category ? 'border-rose-500 ring-rose-500' : 'border-slate-100 dark:border-slate-700 focus:ring-indigo-500',
                  'w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all'
                ]"
              >
                <option value="" disabled>Select category</option>
                <option v-for="cat in employerStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Location <span class="text-rose-500">*</span></label>
              <input
                v-model="form.location"
                type="text"
                placeholder="e.g. Cairo, Egypt"
                :class="[
                  errors.location ? 'border-rose-500 ring-rose-500' : 'border-slate-100 dark:border-slate-700 focus:ring-indigo-500',
                  'w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-slate-300'
                ]"
              />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Work Type <span class="text-rose-500">*</span></label>
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
                placeholder="e.g. 15000"
                :class="[
                  errors.salary ? 'border-rose-500 ring-rose-500' : 'border-slate-100 dark:border-slate-700 focus:ring-indigo-500',
                  'w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-slate-300'
                ]"
              />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Max Salary</label>
              <input
                v-model.number="form.salary_max"
                type="number"
                min="0"
                placeholder="e.g. 30000"
                :class="[
                  errors.salary ? 'border-rose-500 ring-rose-500' : 'border-slate-100 dark:border-slate-700 focus:ring-indigo-500',
                  'w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-slate-300'
                ]"
              />
            </div>
          </div>
          <p v-if="errors.salary" class="text-[10px] text-rose-500 mt-2 font-bold italic animate-[fadeIn_0.3s_ease-out]">
            <i class="pi pi-exclamation-circle text-[9px] mr-1"></i> {{ errors.salary }}
          </p>
        </div>

        <!-- Section: Technologies -->
        <div>
          <SkillsSelector
            v-model="form.skills"
            :skills="employerStore.skills"
            label="Technologies / Skills"
            required
            placeholder="Select required tech stack..."
          />
          <p class="text-[10px] text-slate-400 mt-2 font-medium italic">Selecting from the standard skills table ensures better candidate matching.</p>
        </div>

        <!-- Section: Description -->
        <div>
          <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-5 flex items-center gap-3">
            <span class="w-6 h-[2px] bg-indigo-600"></span> Job Description <span class="text-rose-500">*</span>
          </h3>
          <textarea
            v-model="form.description"
            rows="5"
            placeholder="Describe the role, team, and what a typical day looks like..."
            :class="[
              errors.description ? 'border-rose-500 ring-rose-500' : 'border-slate-100 dark:border-slate-700 focus:ring-indigo-500',
              'w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-slate-300 resize-none leading-relaxed'
            ]"
          ></textarea>
        </div>

        <!-- Section: Requirements -->
        <div>
          <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-5 flex items-center gap-3">
            <span class="w-6 h-[2px] bg-indigo-600"></span> Requirements <span class="text-rose-500">*</span>
          </h3>
          <textarea
            v-model="form.requirements"
            rows="5"
            placeholder="List the skills, experience, and qualifications needed..."
            :class="[
              errors.requirements ? 'border-rose-500 ring-rose-500' : 'border-slate-100 dark:border-slate-700 focus:ring-indigo-500',
              'w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-slate-300 resize-none leading-relaxed'
            ]"
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
            placeholder="e.g. Health insurance, annual bonus, remote work flexibility..."
            class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300 resize-none leading-relaxed"
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
            :disabled="employerStore.loading"
            class="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-500 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <i class="pi pi-check-circle"></i>
            {{ employerStore.loading ? 'Posting...' : 'Post Job' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployerStore } from '@/stores/employer.store'
import SkillsSelector from '@/components/shared/SkillsSelector.vue'
import Swal from 'sweetalert2'

const router = useRouter()
const employerStore = useEmployerStore()

const errors = ref({})
const workTypes = [
  { label: 'Remote', value: 'remote' },
  { label: 'Onsite', value: 'onsite' },
  { label: 'Hybrid', value: 'hybrid' },
]

const techInput = ref('')
const form = ref({
  title: '',
  category_id: '',
  location: '',
  work_type: 'onsite',
  experience_level: '',
  salary_min: '',
  salary_max: '',
  skills: [], // New: Skill IDs from shared component
  technologies: [], // Keeping for backward compatibility or display
  description: '',
  requirements: '',
  benefits: '',
})

onMounted(async () => {
  if (!employerStore.categories.length) {
    await employerStore.fetchCategories()
  }
  if (!employerStore.skills.length) {
    await employerStore.fetchSkills()
  }
})
// Removed addTech and removeTech as SkillsSelector handles it

const validateForm = () => {
  const errs = {}
  
  if (!form.value.title?.trim()) errs.title = 'Job title is required'
  if (!form.value.category_id) errs.category = 'Please select a category'
  if (!form.value.location?.trim()) errs.location = 'Location is required'
  if (!form.value.description?.trim()) errs.description = 'Job description is required'
  if (!form.value.requirements?.trim()) errs.requirements = 'Requirements are required'
  
  if (form.value.salary_min && form.value.salary_max) {
    if (Number(form.value.salary_min) >= Number(form.value.salary_max)) {
      errs.salary = 'Minimum salary must be less than maximum salary'
    }
  }
  
  errors.value = errs
  return Object.keys(errs).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    Swal.fire({
      title: 'Validation Error',
      text: 'Please check the form for errors.',
      icon: 'warning',
      customClass: { popup: 'rounded-[2rem] p-10' },
    })
    return
  }
  
  try {
    // Generate technologies array from skill names for backward compatibility if needed
    const selectedSkills = employerStore.skills.filter(s => form.value.skills.includes(s.id))
    form.value.technologies = selectedSkills.map(s => s.name)

    await employerStore.postJob({ ...form.value })

    await Swal.fire({
      title: 'Job Posted!',
      text: 'Your job listing is now live.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-[2rem] p-10',
      },
    })

    router.push({ name: 'employer.manage-jobs' })
  } catch {
    Swal.fire({
      title: 'Error',
      text: 'Failed to post job. Please try again.',
      icon: 'error',
      customClass: { popup: 'rounded-[2rem] p-10' },
    })
  }
}
</script>
