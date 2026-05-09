<template>
  <div class="min-h-screen bg-slate-50 py-12 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- حالة التحميل -->
      <div v-if="loading" class="flex justify-center py-20">
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"
        ></div>
      </div>

      <div v-else-if="job" class="space-y-8">
        <!-- Header Section -->
        <div
          class="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200/60 relative overflow-hidden"
        >
          <div class="absolute top-0 right-0 p-8">
            <span
              class="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold uppercase tracking-wider"
            >
              {{ job.type }}
            </span>
          </div>

          <div class="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div
              class="w-24 h-24 bg-white rounded-3xl shadow-md border p-4 flex items-center justify-center"
            >
              <img
                :src="job.employer?.logo || '/default-logo.png'"
                class="max-w-full max-h-full object-contain"
              />
            </div>

            <div class="flex-1">
              <h1 class="text-4xl font-black text-slate-900 leading-tight mb-2">{{ job.title }}</h1>
              <p class="text-xl text-indigo-600 font-bold flex items-center gap-2">
                {{ job.employer?.company_name }}
                <span class="text-slate-300 font-light">|</span>
                <span class="text-slate-500 text-lg flex items-center gap-1 font-medium">
                  <i class="pi pi-map-marker"></i> {{ job.location }}
                </span>
              </p>
            </div>

            <div class="w-full md:w-auto pt-4 md:pt-0">
              <button
                @click="handleApplyClick"
                class="w-full md:w-auto px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content (Left) -->
          <div class="lg:col-span-2 space-y-8">
            <div class="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-200/60">
              <h3 class="text-2xl font-black text-slate-900 mb-6 italic">About the Role</h3>
              <div
                class="prose prose-indigo max-w-none text-slate-600 leading-relaxed text-lg"
                v-html="job.description"
              ></div>

              <!-- Skills Section -->
              <div v-if="job.skills?.length" class="mt-10">
                <h4 class="text-lg font-bold text-slate-900 mb-4">Required Skills</h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="skill in job.skills"
                    :key="skill.id"
                    class="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium text-sm"
                  >
                    {{ skill.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar (Right) -->
          <div class="space-y-6">
            <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60">
              <h4 class="font-black text-slate-900 mb-6 uppercase text-sm tracking-widest">
                Job Summary
              </h4>
              <div class="space-y-6">
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"
                  >
                    <i class="pi pi-money-bill text-xl"></i>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-slate-400 uppercase">Monthly Salary</p>
                    <p class="text-lg font-black text-slate-800">
                      ${{ job.salary_min }} - ${{ job.salary_max }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"
                  >
                    <i class="pi pi-briefcase text-xl"></i>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-slate-400 uppercase">Experience Level</p>
                    <p class="text-lg font-black text-slate-800">
                      {{ job.experience_level || 'Not Specified' }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600"
                  >
                    <i class="pi pi-calendar text-xl"></i>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-slate-400 uppercase">Posted Date</p>
                    <p class="text-lg font-black text-slate-800">
                      {{ new Date(job.created_at).toLocaleDateString() }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Apply Modal (Simple Implementation) -->
    <div
      v-if="showApplyModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <div
        class="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in duration-300"
      >
        <h2 class="text-2xl font-black text-slate-900 mb-2">Submit Application</h2>
        <p class="text-slate-500 mb-8">
          Apply for <span class="font-bold text-indigo-600">{{ job.title }}</span>
        </p>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-black text-slate-400 uppercase mb-2"
              >Select Your Resume</label
            >
            <select
              v-model="selectedResume"
              class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 ring-indigo-500 outline-none"
            >
              <option value="" disabled>Choose a resume...</option>
              <option v-for="res in resumes" :key="res.id" :value="res.id">
                {{ res.name || 'My Resume' }}
              </option>
            </select>
          </div>

          <button
            @click="submitApplication"
            :disabled="submitting"
            class="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all disabled:bg-slate-300"
          >
            {{ submitting ? 'Sending...' : 'Confirm Application' }}
          </button>

          <button
            @click="showApplyModal = false"
            class="w-full text-slate-400 font-bold text-sm hover:text-slate-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobStore } from '@/stores/JobStore'
import { candidateApi } from '@/api/services/api' // تأكد من استيراد الـ API

const route = useRoute()
const router = useRouter()
const jobStore = useJobStore()

const job = ref(null)
const loading = ref(true)
const showApplyModal = ref(false)
const resumes = ref([])
const selectedResume = ref('')
const submitting = ref(false)

onMounted(async () => {
  const jobId = route.params.id
  loading.value = true
  try {
    const data = await jobStore.fetchJobById(jobId)
    if (data) job.value = data
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
})

const handleApplyClick = async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  showApplyModal.value = true
  try {
    const resData = await candidateApi.getResumes()
    resumes.value = resData
    const defaultResume = resData.find((r) => r.is_default)
    if (defaultResume) selectedResume.value = defaultResume.id
  } catch (err) {
    console.error('Failed to load resumes', err)
  }
}

const submitApplication = async () => {
  if (!selectedResume.value) {
    alert('Please select a resume first')
    return
  }

  submitting.value = true
  try {
    await candidateApi.applyForJob({
      job_id: job.value.id,
      resume_id: selectedResume.value,
    })
    alert('Application submitted successfully!')
    showApplyModal.value = false
  } catch (err) {
    alert(err.response?.data?.message || 'Something went wrong')
  } finally {
    submitting.value = false
  }
}
</script>
