<template>
  <div class="p-4 mx-auto" style="max-width: 1000px">
    <Button
      label="Back to Jobs"
      icon="pi pi-arrow-left"
      text
      class="mb-4"
      @click="$router.back()"
    />

    <div v-if="loading" class="card p-8 text-center shadow-2 border-round-xl">
      <ProgressSpinner style="width: 50px; height: 50px" />
    </div>

    <div v-else-if="job" class="grid">
      <div class="col-12 mb-4">
        <div class="p-card p-5 border-round-2xl shadow-3 surface-card border-left-3 border-primary">
          <div class="flex flex-column md:flex-row justify-content-between align-items-start gap-4">
            <div class="flex gap-4">
              <div
                class="w-5rem h-5rem bg-primary-50 border-round-xl flex align-items-center justify-content-center text-primary text-4xl font-bold shadow-sm"
              >
                {{ job.title.charAt(0) }}
              </div>
              <div>
                <h1 class="m-0 text-4xl font-bold text-900">{{ job.title }}</h1>
                <p class="text-xl text-primary font-medium mt-1">
                  {{ job.employer?.company_name || 'Premium Company' }}
                </p>
                <div class="flex flex-wrap gap-3 mt-3 text-600">
                  <span class="flex align-items-center gap-1"
                    ><i class="pi pi-map-marker"></i> {{ job.location }}</span
                  >
                  <span class="flex align-items-center gap-1"
                    ><i class="pi pi-calendar"></i> Posted {{ formatDate(job.created_at) }}</span
                  >
                </div>
              </div>
            </div>
            <div class="flex flex-column gap-2 w-full md:w-auto">
              <Button
                label="Apply Now"
                icon="pi pi-send"
                class="p-button-lg shadow-4 border-round-pill"
                @click="handleApply"
              />
              <Button label="Save Job" icon="pi pi-bookmark" outlined class="border-round-pill" />
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 lg:col-8">
        <div class="p-card p-5 border-round-2xl shadow-1 h-full">
          <h3 class="text-2xl font-bold mb-4 border-bottom-1 border-50 pb-2">Job Description</h3>
          <p class="line-height-3 text-700 text-lg mb-6">{{ job.description }}</p>

          <h3 class="text-2xl font-bold mb-4">Requirements & Skills</h3>
          <ul class="list-none p-0 m-0">
            <li
              v-for="(skill, index) in job.job_skills"
              :key="index"
              class="flex align-items-start gap-3 mb-3"
            >
              <i class="pi pi-check-circle text-green-500 mt-1"></i>
              <span class="text-700 font-medium text-lg"
                >{{ skill.skill_name }} ({{ skill.required_level }})</span
              >
            </li>
          </ul>
        </div>
      </div>

      <div class="col-12 lg:col-4">
        <div class="flex flex-column gap-4">
          <Panel header="Job Overview" class="shadow-1 border-round-xl overflow-hidden">
            <div class="flex flex-column gap-4 py-2">
              <div class="flex align-items-center gap-3">
                <i class="pi pi-money-bill text-2xl text-primary"></i>
                <div>
                  <div class="text-500 text-sm">Salary Range</div>
                  <div class="font-bold">
                    {{ job.salary_min }} - {{ job.salary_max }} {{ job.currency }}
                  </div>
                </div>
              </div>
              <div class="flex align-items-center gap-3">
                <i class="pi pi-briefcase text-2xl text-primary"></i>
                <div>
                  <div class="text-500 text-sm">Job Type</div>
                  <div class="font-bold capitalize">{{ job.type.replace('_', ' ') }}</div>
                </div>
              </div>
              <div class="flex align-items-center gap-3">
                <i class="pi pi-users text-2xl text-primary"></i>
                <div>
                  <div class="text-500 text-sm">Experience Level</div>
                  <div class="font-bold">{{ job.experience_level }}</div>
                </div>
              </div>
            </div>
          </Panel>

          <div class="p-card p-4 bg-primary-900 text-white border-round-xl text-center shadow-4">
            <h4 class="m-0 mb-2">Want to work here?</h4>
            <p class="text-primary-100 text-sm mb-4">
              Be among the first applicants for this position!
            </p>
            <Button
              label="Easy Apply"
              class="p-button-warning w-full font-bold"
              @click="handleApply"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useJobsStore } from '../stores/jobs.js'
import Button from 'primevue/button'
import Panel from 'primevue/panel'
import ProgressSpinner from 'primevue/progressspinner'
import { useToast } from 'primevue/usetoast' // سنحتاج لإضافة Toast في main.js

const route = useRoute()
const jobStore = useJobsStore()
const job = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    // استخدمنا الـ Action اللي إنت عملته fetchJobById
    job.value = await jobStore.fetchJobById(route.params.id)
  } finally {
    loading.value = false
  }
})

const handleApply = async () => {
  // هنا نستخدم دالة التقديم اللي في الـ Store بتاعك
  // سنفترض مؤقتاً أن المستخدم رقم 1 هو المسجل
  jobStore.setCurrentUser(1)
  try {
    await jobStore.applyForJob(job.value.id)
    alert('Applied Successfully! Good luck, Marco.')
  } catch (err) {
    alert('Error: ' + err.message)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>
