<template>
  <div class="max-w-4xl mx-auto p-6 font-['Outfit']">
    <div v-if="pageLoading" class="text-center py-20">
      <i class="pi pi-spin pi-spinner text-4xl text-indigo-600"></i>
    </div>

    <div v-else>
      <header class="mb-10 flex items-center justify-between">
        <h1 class="text-4xl font-black tracking-tighter">
          Edit <span class="text-indigo-600">Job</span>
        </h1>
        <span
          :class="isJobActive ? 'text-amber-600' : 'text-slate-400'"
          class="text-[10px] font-black uppercase tracking-widest"
        >
          Status: {{ form.status }}
        </span>
      </header>

      <form
        @submit.prevent="handleUpdate"
        class="space-y-8 bg-white p-12 rounded-[3rem] shadow-2xl shadow-indigo-100/50 border border-slate-50"
      >
        <!-- Basic Info -->
        <div class="grid md:grid-cols-2 gap-8">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-2">Job Title</label>
            <input
              v-model="form.title"
              :disabled="isJobActive"
              type="text"
              class="w-full bg-slate-50 border-none p-5 rounded-3xl focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
              required
            />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-2">Category</label>
            <select
              v-model="form.category_id"
              :disabled="isJobActive"
              class="w-full bg-slate-50 border-none p-5 rounded-3xl focus:ring-2 focus:ring-indigo-500"
            >
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase text-slate-400 ml-2"
            >Job Description</label
          >
          <textarea
            v-model="form.description"
            rows="6"
            class="w-full bg-slate-50 border-none p-5 rounded-3xl focus:ring-2 focus:ring-indigo-500"
            required
          ></textarea>
        </div>

        <!-- Skills Section (The Laravel Join Table Way) -->
        <div class="p-8 bg-indigo-50/30 rounded-[2.5rem] space-y-4">
          <h3 class="text-xs font-black uppercase text-indigo-600">Required Skills</h3>
          <div class="flex gap-4">
            <select v-model="selectedSkillId" class="flex-1 bg-white border-none p-4 rounded-2xl">
              <option value="">Select a skill...</option>
              <option v-for="s in availableSkills" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
            <button
              type="button"
              @click="addSkill"
              class="px-8 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all"
            >
              Add
            </button>
          </div>

          <div class="flex flex-wrap gap-2">
            <div
              v-for="(s, index) in form.skills"
              :key="index"
              class="bg-white border border-indigo-100 px-4 py-2 rounded-xl flex items-center gap-3 text-xs font-bold"
            >
              {{ getSkillName(s.skill_id) }}
              <button type="button" @click="form.skills.splice(index, 1)" class="text-rose-500">
                <i class="pi pi-times-circle"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Meta Data -->
        <div class="grid md:grid-cols-3 gap-6">
          <div>
            <label class="text-[10px] font-black uppercase text-slate-400 ml-2">Type</label>
            <select
              v-model="form.type"
              :disabled="isJobActive"
              class="w-full bg-slate-50 border-none p-4 rounded-2xl"
            >
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-black uppercase text-slate-400 ml-2">Experience</label>
            <select
              v-model="form.experience_level"
              :disabled="isJobActive"
              class="w-full bg-slate-50 border-none p-4 rounded-2xl"
            >
              <option value="junior">Junior</option>
              <option value="mid">Mid-Level</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-black uppercase text-slate-400 ml-2">Vacancies</label>
            <input
              v-model.number="form.vacancies"
              type="number"
              class="w-full bg-slate-50 border-none p-4 rounded-2xl"
            />
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-4 pt-10">
          <button
            type="button"
            @click="router.push('/employer/manage-jobs')"
            class="flex-1 py-5 bg-slate-100 text-slate-500 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
          >
            Discard
          </button>
          <button
            :disabled="loading"
            type="submit"
            class="flex-[2] py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
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

const form = ref({
  title: '',
  category_id: '',
  description: '',
  requirements: 'N/A',
  responsibilities: '',
  benefits: '',
  type: 'full_time',
  workplace_type: 'on_site',
  experience_level: 'junior',
  salary_min: 0,
  salary_max: 0,
  location: '',
  city: '',
  vacancies: 1,
  status: '',
  skills: [],
})

const isJobActive = computed(() => form.value.status === 'active')

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
      requirements: jobData.requirements || 'N/A',
      responsibilities: jobData.responsibilities || '',
      benefits: jobData.benefits || '',
      type: jobData.type || 'full_time',
      workplace_type: jobData.workplace_type || 'on_site',
      experience_level: jobData.experience_level || 'junior',
      salary_min: jobData.salary_min || 0,
      salary_max: jobData.salary_max || 0,
      location: jobData.location || '',
      city: jobData.city || '',
      vacancies: jobData.vacancies || 1,
      status: jobData.status || 'draft',
      skills: Array.isArray(jobData.skills)
        ? jobData.skills.map((s) => ({
            skill_id: s.skill_id || s.id,
            is_required: s.is_required ?? true,
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
    })
    selectedSkillId.value = ''
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
  if (form.value.skills.length === 0) {
    notify('warning', 'Missing Skills', 'Please add at least one required skill.')
    return
  }

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
      salary_min: form.value.salary_min,
      salary_max: form.value.salary_max,
      location: form.value.location,
      city: form.value.city,
      vacancies: form.value.vacancies,
      skills: form.value.skills.map((s) => ({
        skill_id: s.skill_id,
        is_required: s.is_required,
      })),
    }

    await employerApi.updateJob(route.params.id, payload)

    await Swal.fire({
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
    notify('error', 'Update Failed', errorMsg)
  } finally {
    loading.value = false
  }
}
</script>
