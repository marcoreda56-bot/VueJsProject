<template>
  <div class="max-w-4xl mx-auto space-y-10">
    <div class="flex items-center gap-6 animate-slideUp">
      <button
        @click="$router.back()"
        class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"
      >
        <i class="pi pi-arrow-left"></i>
      </button>
      <div>
        <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
          New <span class="text-indigo-600">Opportunity.</span>
        </h2>
        <p class="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
          Fill in the details to find your next talent
        </p>
      </div>
    </div>

    <form
      @submit.prevent="handlePublish"
      class="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-10"
    >
      <!-- Title & Category -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div class="space-y-4">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4"
            >Job Title</label
          >
          <input
            v-model="formData.title"
            type="text"
            placeholder="e.g. Senior Backend Engineer"
            class="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-600/20 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all"
            required
          />
        </div>
        <div class="space-y-4">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4"
            >Category</label
          >
          <select
            v-model="formData.category_id"
            class="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-600/20 rounded-2xl px-6 py-4 text-sm font-bold outline-none appearance-none cursor-pointer"
            required
          >
            <option value="" disabled>Choose Category</option>
            <option v-for="cat in jobStore.categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Job Description -->
      <div class="space-y-4">
        <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4"
          >Detailed Description</label
        >
        <textarea
          v-model="formData.description"
          rows="8"
          placeholder="What are the key responsibilities..."
          class="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-600/20 rounded-[2rem] px-6 py-4 text-sm font-bold outline-none transition-all resize-none"
        ></textarea>
      </div>

      <!-- Footer Actions -->
      <div
        class="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800"
      >
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Status: <span class="text-indigo-600">Draft</span>
        </p>
        <button
          type="submit"
          :disabled="jobStore.loading"
          class="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-3"
        >
          <i v-if="jobStore.loading" class="pi pi-spin pi-spinner"></i>
          {{ jobStore.loading ? 'Publishing...' : 'Post Job Now' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useJobStore } from '@/stores/JobStore'
import { useRouter } from 'vue-router'

const jobStore = useJobStore()
const router = useRouter()

const formData = reactive({
  title: '',
  category_id: '',
  description: '',
  type: 'full-time', // Default value
})

onMounted(() => jobStore.fetchCategories())

const handlePublish = async () => {
  try {
    await jobStore.createJob(formData)
    router.push({ name: 'employer-manage-jobs' })
  } catch (err) {
    alert(err.message || 'Something went wrong')
  }
}
</script>
