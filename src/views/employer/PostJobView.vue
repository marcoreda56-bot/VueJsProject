<template>
  <div class="max-w-5xl mx-auto space-y-10 animate-fadeIn">
    <div>
      <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
        Create <span class="text-indigo-600">Job.</span>
      </h2>
      <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">
        Post a new position to your company
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
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
              class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all"
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
              class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold"
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
              class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold"
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
              class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold"
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
            <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Save As</label>
            <select
              v-model="form.status"
              class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold"
            >
              <option value="">Publish immediately</option>
              <option value="draft">Draft</option>
              <option value="pending_review">Submit for Review</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        :disabled="!isValid || employerStore.loading"
        class="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        {{ employerStore.loading ? 'Processing...' : 'Publish Job Listing' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useEmployerStore } from '@/stores/EmployerStore'
import { publicApi } from '@/api/services/api'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const employerStore = useEmployerStore()
const router = useRouter()
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

onMounted(async () => {
  try {
    categories.value = await publicApi.getCategories()
    availableSkills.value = await publicApi.getSkills()
  } catch (err) {
    console.error('Failed to load form data', err)
  }
})

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
  // Trigger validation silently to compute state
  const e = {}

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

const addSkill = () => {
  if (!selectedSkillId.value) return
  if (!form.value.skills.find((s) => s.skill_id === selectedSkillId.value)) {
    form.value.skills.push({
      skill_id: selectedSkillId.value,
      is_required: true,
      min_proficiency: selectedSkillLevel.value || null,
    })
  }
  selectedSkillId.value = ''
  selectedSkillLevel.value = ''
}

const getSkillName = (id) => availableSkills.value.find((s) => s.id === id)?.name

const handleSubmit = async () => {
  if (!validate()) return

  const payload = {}
  Object.keys(form.value).forEach((key) => {
    const val = form.value[key]
    if (val !== null && val !== undefined && val !== '') {
      payload[key] = val
    }
  })

  // If status is empty string, omit it so backend defaults apply
  if (!payload.status) delete payload.status

  try {
    await employerStore.createJob(payload)
    Swal.fire({
      icon: 'success',
      title: 'Job Created',
      text: payload.status === 'draft' ? 'Saved as draft.' : 'Job posted successfully.',
      timer: 2000,
      showConfirmButton: false,
    })
    router.push('/employer/manage-jobs')
  } catch (err) {
    const msg = err.response?.data?.message || err.message || 'Failed to create job'
    const serverErrors = err.response?.data?.errors
    if (serverErrors) {
      Object.assign(errors.value, serverErrors)
    }
    Swal.fire({ icon: 'error', title: 'Error', text: msg, confirmButtonColor: '#6366f1' })
  }
}
</script>
