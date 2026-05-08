<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployerStore } from '@/stores/EmployerStore'
import { useJobStore } from '@/stores/JobStore'

const route = useRoute()
const router = useRouter()
const employerStore = useEmployerStore()
const jobStore = useJobStore()

const form = ref({
  title: '',
  category_id: '',
  type: '',
  location: '',
  salary_min: '',
  salary_max: '',
  currency: 'EGP',
  description: '',
  requirements: '',
  experience_level: '',
})

onMounted(async () => {
  await jobStore.fetchCategories()
  const job = await jobStore.fetchJobBySlug(route.params.slug)
  if (job) {
    form.value = { ...job, category_id: job.category?.id }
  }
})

const handleUpdate = async () => {
  try {
    await employerStore.updateJob(route.params.id, form.value)
    router.push('/employer/dashboard')
  } catch (err) {
    alert('Failed to update job')
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 p-12">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-black mb-8 italic">
        Edit <span class="text-indigo-600">Position.</span>
      </h1>

      <form @submit.prevent="handleUpdate" class="space-y-6">
        <button
          class="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest"
        >
          {{ employerStore.loading ? 'Saving...' : 'Update Job' }}
        </button>
      </form>
    </div>
  </div>
</template>
