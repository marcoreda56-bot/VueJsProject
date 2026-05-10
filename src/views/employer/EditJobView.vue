<template>
  <div class="max-w-5xl mx-auto space-y-10 animate-fadeIn">
    <button
      @click="router.push('/employer/manage-jobs')"
      class="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
    >
      <i class="pi pi-arrow-left"></i> Back to Jobs
    </button>

    <div v-if="pageLoading" class="text-center py-20">
      <i class="pi pi-spin pi-spinner text-4xl text-indigo-600"></i>
    </div>

    <div v-else>
      <header class="mb-10 flex items-center justify-between">
        <h1 class="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
          Edit <span class="text-indigo-600">Job.</span>
        </h1>
        <span
          :class="isJobActive ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 bg-slate-100'"
          class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full"
        >
          {{ form.status?.replace('_', ' ') }}
        </span>
      </header>

      <form @submit.prevent="handleUpdate" class="space-y-8">
        <!-- General Info -->
        <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                Job Title <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                maxlength="200"
                :disabled="isJobActive"
                class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all disabled:opacity-50"
                :class="errors.title ? 'ring-2 ring-rose-500' : ''"
                placeholder="e.g. Senior Vue Developer"
              />
              <p v-if="errors.title" class="text-[10px] text-rose-500 font-bold ml-2">{{ errors.title }}</p>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                Category <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="form.category_id"
                :disabled="isJobActive"
                class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold disabled:opacity-50"
                :class="errors.category_id ? 'ring-2 ring-rose-500' : ''"
              >
                <option value="">Select category...</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
              <p v-if="errors.category_id" class="text-[10px] text-rose-500 font-bold ml-2">{{ errors.category_id }}</p>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
              Description <span class="text-rose-500">*</span>
            </label>
            <textarea
              v-model="form.description"
              rows="5"
              class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold"
              :class="errors.description ? 'ring-2 ring-rose-500' : ''"
            ></textarea>
            <p v-if="errors.description" class="text-[10px] text-rose-500 font-bold ml-2">{{ errors.description }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
              Requirements <span class="text-rose-500">*</span>
            </label>
            <textarea
              v-model="form.requirements"
              rows="4"
              class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold"
              :class="errors.requirements ? 'ring-2 ring-rose-500' : ''"
            ></textarea>
            <p v-if="errors.requirements" class="text-[10px] text-rose-500 font-bold ml-2">{{ errors.requirements }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Responsibilities</label>
              <textarea
                v-model="form.responsibilities"
                rows="3"
                class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold"
              ></textarea>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Benefits</label>
              <textarea
                v-model="form.benefits"
                rows="3"
                class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Skills Section -->
        <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6">
          <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Required Skills</label>
          <div class="flex gap-2">
            <select
              v-model="selectedSkillId"
              class="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold"
            >
              <option value="">Select a skill...</option>
              <option v-for="s in availableSkills" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
            <select
              v-model="selectedSkillLevel"
              class="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold"
            >
              <option value="">Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
            <button
              type="button"
              @click="addSkill"
              class="bg-indigo-600 text-white px-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition"
            >
              Add
            </button>
          </div>
          <div class="flex flex-wrap gap-2 mt-4">
            <span
              v-for="(s, i) in form.skills"
              :key="i"
              class="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-2 uppercase"
            >
              {{ getSkillName(s.skill_id) }}
              <span v-if="s.min_proficiency" class="text-indigo-400">({{ s.min_proficiency }})</span>
              <i @click="form.skills.splice(i, 1)" class="pi pi-times cursor-pointer hover:text-rose-500"></i>
            </span>
          </div>
        </div>

        <!-- Job Meta -->
        <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                Job Type <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="form.type"
                :disabled="isJobActive"
                class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold disabled:opacity-50"
              >
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                Workplace <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="form.workplace_type"
                class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold"
              >
                <option value="remote">Remote</option>
                <option value="on_site">On-Site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                Experience Level <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="form.experience_level"
                :disabled="isJobActive"
                class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold disabled:opacity-50"
              >
                <option value="junior">Junior</option>
                <option value="mid">Mid-Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
                <option value="executive">Executive</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Career Level</label>
              <input
                v-model="form.career_level"
                type="text"
                maxlength="50"
                class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold"
                placeholder="e.g. Manager, Director"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Education Level</label>
              <select
                v-model="form.education_level"
                class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold"
              >
                <option value="">Any</option>
                <option value="high_school">High School</option>
                <option value="diploma">Diploma</option>
                <option value="bachelor">Bachelor</option>
                <option value="master">Master</option>
                <option value="phd">PhD</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Vacancies</label>
              <input
                v-model.number="form.vacancies"
                type="number"
                min="1"
                class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                Location <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.location"
                type="text"
                maxlength="200"
                class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold"
                :class="errors.location ? 'ring-2 ring-rose-500' : ''"
                placeholder="e.g. Cairo, Egypt"
              />
              <p v-if="errors.location" class="text-[10px] text-rose-500 font-bold ml-2">{{ errors.location }}</p>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">City</label>
              <input
                v-model="form.city"
                type="text"
                maxlength="100"
                class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold"
                placeholder="e.g. Cairo"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Min Salary</label>
              <input
                v-model.number="form.salary_min"
                type="number"
                min="0"
                class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold"
                :class="errors.salary_min || errors.salary_max ? 'ring-2 ring-rose-500' : ''"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Max Salary</label>
              <input
                v-model.number="form.salary_max"
                type="number"
                min="0"
                class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold"
                :class="errors.salary_max ? 'ring-2 ring-rose-500' : ''"
              />
              <p v-if="errors.salary_max" class="text-[10px] text-rose-500 font-bold ml-2">{{ errors.salary_max }}</p>
            </div>
            <div class="flex items-center gap-3 pt-6">
              <input
                id="is_salary_visible"
                v-model="form.is_salary_visible"
                type="checkbox"
                class="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label for="is_salary_visible" class="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                Show salary publicly
              </label>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Expires At</label>
              <input
                v-model="form.expires_at"
                type="date"
                class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Country</label>
              <input
                v-model="form.country"
                type="text"
                maxlength="2"
                class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold uppercase"
                placeholder="e.g. EG"
              />
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-4 pt-4">
          <button
            type="button"
            @click="router.push('/employer/manage-jobs')"
            class="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
          >
            Discard
          </button>
          <button
            type="submit"
            :disabled="!isValid || loading"
            class="flex-[2] py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Saving...' : 'Update Listing' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { employerApi, publicApi } from '@/api/services/api'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const pageLoading = ref(true)
const loading = ref(false)
const categories = ref([])
const availableSkills = ref([])
const selectedSkillId = ref('')
const selectedSkillLevel = ref('')
const errors = ref({})

const form = ref({
  title: '',
  category_id: '',
  description: '',
  requirements: '',
  responsibilities: '',
  benefits: '',
  type: 'full_time',
  workplace_type: 'remote',
  experience_level: 'mid',
  career_level: '',
  education_level: '',
  salary_min: null,
  salary_max: null,
  is_salary_visible: false,
  location: '',
  city: '',
  country: '',
  vacancies: 1,
  status: '',
  expires_at: '',
  skills: [],
})

const isJobActive = computed(() => form.value.status === 'active')

const validate = () => {
  const e = {}

  if (!form.value.title || form.value.title.trim().length < 2) {
    e.title = 'Title is required (min 2 chars).'
  } else if (form.value.title.length > 200) {
    e.title = 'Title must be 200 characters or less.'
  }

  if (!form.value.category_id) {
    e.category_id = 'Please select a category.'
  }

  if (!form.value.description || form.value.description.trim().length < 5) {
    e.description = 'Description is required.'
  }

  if (!form.value.requirements || form.value.requirements.trim().length < 5) {
    e.requirements = 'Requirements are required.'
  }

  if (!form.value.location || form.value.location.trim().length < 1) {
    e.location = 'Location is required.'
  } else if (form.value.location.length > 200) {
    e.location = 'Location must be 200 characters or less.'
  }

  const min = form.value.salary_min
  const max = form.value.salary_max
  if (min !== null && max !== null && max < min) {
    e.salary_max = 'Max salary must be greater than or equal to min salary.'
  }

  errors.value = e
  return Object.keys(e).length === 0
}

const isValid = computed(() => {
  if (!form.value.title || form.value.title.trim().length < 2 || form.value.title.length > 200) return false
  if (!form.value.category_id) return false
  if (!form.value.description || form.value.description.trim().length < 5) return false
  if (!form.value.requirements || form.value.requirements.trim().length < 5) return false
  if (!form.value.location || form.value.location.trim().length < 1 || form.value.location.length > 200) return false

  const min = form.value.salary_min
  const max = form.value.salary_max
  if (min !== null && max !== null && max < min) return false

  return true
})

const notify = (icon, title, text) => {
  Swal.fire({
    icon,
    title,
    text,
    confirmButtonColor: '#6366f1',
    background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
    color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
  })
}

onMounted(async () => {
  try {
    const jobId = route.params.id
    const [jobData, categoriesData, skillsData] = await Promise.all([
      employerApi.getJobDetails(jobId),
      publicApi.getCategories(),
      publicApi.getSkills(),
    ])

    categories.value = Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || []
    availableSkills.value = Array.isArray(skillsData) ? skillsData : skillsData?.data || []

    if (!jobData) throw new Error('Job data not found')

    form.value = {
      title: jobData.title || '',
      category_id: jobData.category_id || '',
      description: jobData.description || '',
      requirements: jobData.requirements || '',
      responsibilities: jobData.responsibilities || '',
      benefits: jobData.benefits || '',
      type: jobData.type || 'full_time',
      workplace_type: jobData.workplace_type || 'remote',
      experience_level: jobData.experience_level || 'mid',
      career_level: jobData.career_level || '',
      education_level: jobData.education_level || '',
      salary_min: jobData.salary_min ?? null,
      salary_max: jobData.salary_max ?? null,
      is_salary_visible: jobData.is_salary_visible || false,
      location: jobData.location || '',
      city: jobData.city || '',
      country: jobData.country || '',
      vacancies: jobData.vacancies || 1,
      status: jobData.status || 'draft',
      expires_at: jobData.expires_at ? jobData.expires_at.split('T')[0] : '',
      skills: Array.isArray(jobData.skills)
        ? jobData.skills.map((s) => ({
            skill_id: s.skill_id || s.id,
            is_required: s.is_required ?? true,
            min_proficiency: s.min_proficiency || null,
          }))
        : [],
    }
  } catch (err) {
    console.error('Fetch Error:', err)
    notify('error', 'Fetch Failed', 'Could not load job details.')
  } finally {
    pageLoading.value = false
  }
})

const addSkill = () => {
  if (!selectedSkillId.value) return

  if (!form.value.skills.some((s) => s.skill_id === selectedSkillId.value)) {
    form.value.skills.push({
      skill_id: selectedSkillId.value,
      is_required: true,
      min_proficiency: selectedSkillLevel.value || null,
    })
    selectedSkillId.value = ''
    selectedSkillLevel.value = ''
  } else {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: 'Skill already added',
      showConfirmButton: false,
      timer: 2000,
    })
  }
}

const getSkillName = (id) => availableSkills.value.find((s) => s.id === id)?.name || 'Skill'

const handleUpdate = async () => {
  if (!validate()) return

  loading.value = true
  try {
    const payload = {
      title: form.value.title,
      category_id: form.value.category_id,
      description: form.value.description,
      requirements: form.value.requirements,
      responsibilities: form.value.responsibilities,
      benefits: form.value.benefits,
      type: form.value.type,
      workplace_type: form.value.workplace_type,
      experience_level: form.value.experience_level,
      career_level: form.value.career_level,
      education_level: form.value.education_level,
      salary_min: form.value.salary_min,
      salary_max: form.value.salary_max,
      is_salary_visible: form.value.is_salary_visible,
      location: form.value.location,
      city: form.value.city,
      country: form.value.country,
      vacancies: form.value.vacancies,
      expires_at: form.value.expires_at || null,
      skills: form.value.skills.map((s) => ({
        skill_id: s.skill_id,
        is_required: s.is_required,
        min_proficiency: s.min_proficiency,
      })),
    }

    await employerApi.updateJob(route.params.id, payload)

    Swal.fire({
      icon: 'success',
      title: 'Job Updated!',
      text: 'The listing has been successfully modified.',
      timer: 2000,
      showConfirmButton: false,
    })

    router.push('/employer/manage-jobs')
  } catch (err) {
    console.error('Update Error:', err)
    const errorMsg = err.response?.data?.message || 'Check your inputs and try again.'
    const serverErrors = err.response?.data?.errors
    if (serverErrors) {
      Object.assign(errors.value, serverErrors)
    }
    notify('error', 'Update Failed', errorMsg)
  } finally {
    loading.value = false
  }
}
</script>
