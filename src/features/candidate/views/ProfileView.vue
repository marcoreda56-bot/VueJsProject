<template>
  <div class="p-8 lg:p-12 animate-[fadeIn_0.5s_ease-out] max-w-6xl mx-auto">
    <header class="mb-12 flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-2">
          My <span class="text-indigo-600">Profile</span>
        </h1>
        <p class="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
          Manage your professional identity
        </p>
      </div>
      <button
        @click="saveProfile"
        :disabled="saving"
        class="group relative px-10 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
      >
        <span class="relative z-10 flex items-center gap-2">
          <i v-if="saving" class="pi pi-spin pi-spinner"></i>
          <i v-else class="pi pi-check"></i>
          {{ saving ? 'Saving...' : 'Save Profile' }}
        </span>
      </button>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-4 space-y-6">
        <div
          class="p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] text-center shadow-sm"
        >
          <div class="relative w-32 h-32 mx-auto mb-6 group">
            <img
              :src="userAvatar"
              class="w-full h-full object-cover rounded-[2.5rem] shadow-2xl transition-transform group-hover:scale-105"
              alt="Profile"
            />
          </div>
          <h3 class="text-xl font-black text-slate-900 dark:text-white mb-1">
            {{ auth.user?.name }}
          </h3>
          <span
            class="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest"
          >
            {{ formData.title || 'Candidate' }}
          </span>
        </div>
      </div>

      <div class="lg:col-span-8">
        <div
          class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              v-for="field in fields"
              :key="field.label"
              :class="field.full ? 'md:col-span-2' : ''"
            >
              <label
                class="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 ml-2"
              >
                {{ field.label }}
              </label>
              <input
                v-if="field.type !== 'textarea'"
                v-model="formData[field.key]"
                :type="field.type"
                class="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-[1.5rem] outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
                :placeholder="field.placeholder"
              />
              <textarea
                v-else
                v-model="formData[field.key]"
                rows="5"
                class="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-[2rem] outline-none transition-all font-medium text-slate-600 dark:text-slate-300"
                placeholder="Write your professional story..."
              ></textarea>
            </div>

            <div class="md:col-span-2 mt-4 border-t border-slate-50 dark:border-slate-800 pt-8">
              <label
                class="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 ml-2"
              >
                Technical Skills
              </label>

              <SkillSelector
                v-model="formData.skills"
                :skills="allSkills"
                placeholder="Search for skills (e.g. JavaScript, PHP)..."
              />

              <div
                v-if="loadingSkills"
                class="mt-2 flex items-center gap-2 text-[10px] text-slate-400"
              >
                <i class="pi pi-spin pi-spinner"></i> Syncing skills...
              </div>
            </div>

            <!-- Work Experience -->
            <div class="md:col-span-2 mt-12 border-t border-slate-50 dark:border-slate-800 pt-12">
              <div class="flex justify-between items-center mb-8">
                <label
                  class="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2"
                >
                  Work Experience
                </label>
                <button
                  @click="addExperience"
                  class="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-all font-sans"
                >
                  <i class="pi pi-plus text-[8px]"></i> Add Experience
                </button>
              </div>

              <div class="space-y-6">
                <div
                  v-for="(exp, index) in experienceData"
                  :key="index"
                  class="p-8 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2rem] border border-slate-100 dark:border-slate-800 relative group animate-[fadeIn_0.3s_ease-out]"
                >
                  <button
                    @click="removeExperience(index)"
                    class="absolute top-6 right-6 w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                  >
                    <i class="pi pi-trash text-xs"></i>
                  </button>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Title</label>
                      <input v-model="exp.title" type="text" class="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500/30 font-bold text-sm" placeholder="e.g. Senior Developer" />
                    </div>
                    <div class="space-y-2">
                      <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Company</label>
                      <input v-model="exp.company" type="text" class="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500/30 font-bold text-sm" placeholder="e.g. Google" />
                    </div>
                    <div class="space-y-2">
                      <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                      <input v-model="exp.location" type="text" class="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500/30 font-bold text-sm" placeholder="e.g. Menlo Park, CA" />
                    </div>
                    <div class="space-y-2">
                      <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Job Type</label>
                      <select v-model="exp.job_type" class="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500/30 font-bold text-sm">
                        <option value="full_time">Full-time</option>
                        <option value="part_time">Part-time</option>
                        <option value="freelance">Freelance</option>
                        <option value="internship">Internship</option>
                      </select>
                    </div>
                    <div class="space-y-2">
                      <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Start Date</label>
                      <input v-model="exp.start_date" type="date" class="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500/30 font-bold text-sm" />
                    </div>
                    <div class="space-y-2">
                      <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">End Date</label>
                      <input v-model="exp.end_date" :disabled="exp.is_current" type="date" class="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500/30 font-bold text-sm disabled:opacity-50" />
                    </div>
                    <div class="flex items-center gap-2 pt-8">
                      <input v-model="exp.is_current" type="checkbox" :id="'curr-exp-' + index" class="w-4 h-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500" @change="exp.is_current ? (exp.end_date = null) : null" />
                      <label :for="'curr-exp-' + index" class="text-[10px] font-black uppercase tracking-widest text-slate-500">I currently work here</label>
                    </div>
                    <div class="md:col-span-2 space-y-2">
                      <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                      <textarea v-model="exp.description" rows="3" class="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-indigo-500/30 font-medium text-sm" placeholder="Describe your responsibilities and achievements..."></textarea>
                    </div>
                  </div>
                </div>

                <div v-if="experienceData.length === 0" class="py-12 border-2 border-dashed border-slate-100 dark:border-slate-800/50 rounded-[2rem] text-center">
                  <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No experience added yet.</p>
                </div>
              </div>
            </div>

            <!-- Education -->
            <div class="md:col-span-2 mt-12 border-t border-slate-50 dark:border-slate-800 pt-12">
              <div class="flex justify-between items-center mb-8">
                <label
                  class="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2"
                >
                  Education
                </label>
                <button
                  @click="addEducation"
                  class="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-all font-sans"
                >
                  <i class="pi pi-plus text-[8px]"></i> Add Education
                </button>
              </div>

              <div class="space-y-6">
                <div
                  v-for="(edu, index) in educationData"
                  :key="index"
                  class="p-8 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2rem] border border-slate-100 dark:border-slate-800 relative group animate-[fadeIn_0.3s_ease-out]"
                >
                  <button
                    @click="removeEducation(index)"
                    class="absolute top-6 right-6 w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                  >
                    <i class="pi pi-trash text-xs"></i>
                  </button>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Degree</label>
                      <input v-model="edu.degree" type="text" class="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500/30 font-bold text-sm" placeholder="e.g. Bachelor of Science" />
                    </div>
                    <div class="space-y-2">
                      <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Institution</label>
                      <input v-model="edu.institution" type="text" class="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500/30 font-bold text-sm" placeholder="e.g. Cairo University" />
                    </div>
                    <div class="space-y-2">
                      <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Field of Study</label>
                      <input v-model="edu.field_of_study" type="text" class="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500/30 font-bold text-sm" placeholder="e.g. Computer Science" />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Start Year</label>
                        <input v-model.number="edu.start_year" type="number" class="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500/30 font-bold text-sm" />
                      </div>
                      <div class="space-y-2">
                        <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">End Year</label>
                        <input v-model.number="edu.end_year" :disabled="edu.is_current" type="number" class="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500/30 font-bold text-sm disabled:opacity-50" />
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div class="space-y-2">
                        <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Grade</label>
                        <input v-model="edu.grade" type="text" class="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500/30 font-bold text-sm" placeholder="e.g. Excellent, Very Good" />
                      </div>
                      <div class="flex items-center gap-2 pt-8">
                        <input v-model="edu.is_current" type="checkbox" :id="'curr-edu-' + index" class="w-4 h-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500" @change="edu.is_current ? (edu.end_year = null) : null" />
                        <label :for="'curr-edu-' + index" class="text-[10px] font-black uppercase tracking-widest text-slate-500">I am currently studying here</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="educationData.length === 0" class="py-12 border-2 border-dashed border-slate-100 dark:border-slate-800/50 rounded-[2rem] text-center">
                  <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No education added yet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useCandidateStore } from '@/stores/candidate.store'
import { skillsApi } from '@/api/services/api'
import SkillSelector from '@/components/shared/SkillsSelector.vue'
import Swal from 'sweetalert2'

const auth = useAuthStore()
const candidateStore = useCandidateStore()
const saving = ref(false)
const loadingSkills = ref(true)
const allSkills = ref([])

const educationData = ref([])
const experienceData = ref([])

const fields = [
  {
    label: 'Job Title',
    key: 'title',
    type: 'text',
    placeholder: 'e.g. Senior Full-Stack Engineer',
  },
  { label: 'Location', key: 'location', type: 'text', placeholder: 'e.g. Cairo, Egypt' },
  { label: 'Professional Bio', key: 'bio', type: 'textarea', placeholder: '', full: true },
]

const formData = reactive({
  title: '',
  location: '',
  bio: '',
  skills: [],
})

const fetchAllSkills = async () => {
  try {
    loadingSkills.value = true
    const response = await skillsApi.getAll()
    allSkills.value = response.data
  } catch (error) {
    console.error('Failed to fetch skills:', error)
  } finally {
    loadingSkills.value = false
  }
}

const addEducation = () => {
  educationData.value.push({
    degree: '',
    institution: '',
    field_of_study: '',
    start_year: new Date().getFullYear(),
    end_year: new Date().getFullYear(),
    grade: '',
    is_current: false,
  })
}

const removeEducation = (index) => {
  educationData.value.splice(index, 1)
}

const addExperience = () => {
  experienceData.value.push({
    title: '',
    company: '',
    location: '',
    job_type: 'full_time',
    start_date: new Date().toISOString().split('T')[0],
    end_date: null,
    is_current: true,
    description: '',
  })
}

const removeExperience = (index) => {
  experienceData.value.splice(index, 1)
}

onMounted(async () => {
  await fetchAllSkills()

  await candidateStore.initialize()
  if (candidateStore.profile) {
    Object.assign(formData, {
      title: candidateStore.profile.title || '',
      location: candidateStore.profile.location || '',
      bio: candidateStore.profile.bio || '',
      skills: Array.isArray(candidateStore.profile.skills)
        ? candidateStore.profile.skills.map((s) => String(s))
        : [],
    })
    educationData.value = JSON.parse(JSON.stringify(candidateStore.education))
    experienceData.value = JSON.parse(JSON.stringify(candidateStore.experience))
  }
})

const userAvatar = computed(() => {
  if (auth.user?.avatar) return auth.user.avatar
  const name = auth.user?.name || 'User'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&bold=true`
})

const saveProfile = async () => {
  saving.value = true
  try {
    await candidateStore.updateProfile(
      {
        ...candidateStore.profile,
        ...formData,
      },
      educationData.value,
      experienceData.value,
    )

    Swal.fire({
      title: 'Profile Updated!',
      text: 'Your skills, education, and experience have been synchronized.',
      icon: 'success',
      confirmButtonColor: '#6366f1',
      customClass: { popup: 'rounded-[2.5rem] font-sans' },
    })
  } catch (err) {
    console.error('Save Error:', err)
    Swal.fire('Error', 'Failed to save profile changes.', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
