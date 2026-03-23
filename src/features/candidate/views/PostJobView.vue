<template>
  <div
    class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 py-12 px-6 lg:px-12 font-['Plus_Jakarta_Sans',sans-serif]"
  >
    <div class="max-w-4xl mx-auto">
      <header class="mb-12 animate-[fadeIn_0.5s_ease-out]">
        <h1 class="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-3">
          Hire the <span class="text-indigo-600">Best.</span>
        </h1>
        <p class="text-slate-500 dark:text-slate-400 font-bold text-lg uppercase tracking-tight">
          Fill in the details to find your next
          <span class="text-indigo-600 italic">top-tier</span> talent.
        </p>
      </header>

      <div
        class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-sm relative overflow-hidden"
      >
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full"
        ></div>

        <form @submit.prevent="handleSubmit" class="space-y-10 relative z-10">
          <div class="space-y-6">
            <h3
              class="text-xl font-black text-slate-900 dark:text-white tracking-tighter italic flex items-center gap-3"
            >
              <span
                class="w-8 h-8 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center not-italic"
                >01</span
              >
              General Information
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col gap-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                  >Job Title</label
                >
                <input
                  v-model="form.title"
                  type="text"
                  placeholder="e.g. Senior Full-Stack Developer"
                  class="custom-input"
                  required
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                  >Category</label
                >
                <Select
                  v-model="form.category"
                  :options="categories"
                  placeholder="Select Field"
                  class="custom-select"
                />
              </div>
            </div>
          </div>

          <div class="space-y-6 pt-6 border-t border-slate-50 dark:border-slate-800">
            <h3
              class="text-xl font-black text-slate-900 dark:text-white tracking-tighter italic flex items-center gap-3"
            >
              <span
                class="w-8 h-8 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center not-italic"
                >02</span
              >
              Job Details
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="flex flex-col gap-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                  >Location</label
                >
                <input
                  v-model="form.location"
                  type="text"
                  placeholder="Cairo, Remote, etc."
                  class="custom-input"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                  >Type</label
                >
                <Select
                  v-model="form.type"
                  :options="jobTypes"
                  placeholder="Full Time"
                  class="custom-select"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                  >Salary Range</label
                >
                <input
                  v-model="form.salary"
                  type="text"
                  placeholder="e.g. 20k - 30k"
                  class="custom-input"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                >Description</label
              >
              <textarea
                v-model="form.description"
                rows="5"
                placeholder="Describe the role, responsibilities, and requirements..."
                class="custom-input resize-none"
              ></textarea>
            </div>
          </div>

          <div class="pt-10">
            <button
              type="submit"
              class="w-full py-6 bg-slate-900 dark:bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4"
            >
              <i class="pi pi-cloud-upload"></i> Publish Job Listing
            </button>
            <p
              class="text-center text-[10px] font-bold text-slate-400 mt-6 uppercase tracking-widest"
            >
              By publishing, you agree to HireMasr's terms of service.
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Select from 'primevue/select'

const form = ref({
  title: '',
  category: null,
  location: '',
  type: null,
  salary: '',
  description: '',
})

const categories = ['Software Engineering', 'Design', 'Marketing', 'Sales', 'Product Management']
const jobTypes = ['Full Time', 'Part Time', 'Remote', 'Freelance']

const handleSubmit = () => {
  console.log('Job Posted:', form.value)
  // Logic to send data to your Laravel API
}
</script>

<style scoped>
.custom-input {
  @apply w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl outline-none transition-all font-bold text-sm text-slate-900 dark:text-white placeholder:text-slate-300;
}

.custom-select {
  @apply !bg-slate-50 dark:!bg-slate-800/50 !border-none !rounded-2xl !p-2 !shadow-none !text-sm font-bold;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
