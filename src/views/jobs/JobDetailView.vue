<script setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobStore } from '@/stores/JobStore'
import { useAuthStore } from '@/stores/AuthStore'
import { useCandidateStore } from '@/stores/CandidateStore'

const route = useRoute()
const router = useRouter()
const jobStore = useJobStore()
const authStore = useAuthStore()
const candidateStore = useCandidateStore()

const job = computed(() => jobStore.currentJob)

onMounted(async () => {
  try {
    // جلب بيانات الوظيفة بناءً على الـ Slug من الرابط
    await jobStore.fetchJobBySlug(route.params.slug)
  } catch (err) {
    router.push({ name: 'not-found' })
  }
})

const handleApply = async () => {
  // 1. التحقق من تسجيل الدخول
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  // 2. التحقق من دور المستخدم (يجب أن يكون Candidate)
  if (authStore.userRole !== 'candidate') {
    alert('Only tech candidates can apply for elite positions.')
    return
  }

  // 3. إرسال طلب التوظيف
  try {
    // نرسل الـ UUID الخاص بالوظيفة
    await candidateStore.applyForJob(job.value.id)
    alert('Success! Your application has been sent to the employer. 🚀')
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to submit application.')
  }
}
</script>

<template>
  <!-- Loading State -->
  <div
    v-if="jobStore.loading"
    class="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-slate-950"
  >
    <div class="flex flex-col items-center gap-4">
      <div
        class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
        Loading Opportunity...
      </p>
    </div>
  </div>

  <div v-else-if="job" class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-['Outfit'] pb-20">
    <!-- Header: Hero Area -->
    <header
      class="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 pt-20 pb-12 px-6"
    >
      <div class="max-w-7xl mx-auto">
        <button
          @click="router.back()"
          class="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-8 group"
        >
          <i class="pi pi-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          <span class="text-xs font-black uppercase tracking-widest">Back to Search</span>
        </button>

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div class="flex items-center gap-6">
            <div
              class="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden shadow-sm"
            >
              <img
                :src="
                  job.employer?.logo ||
                  `https://ui-avatars.com/api/?name=${job.employer?.company_name}&background=6366f1&color=fff`
                "
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span
                  class="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg"
                >
                  {{ job.type }}
                </span>
                <span class="text-slate-400 text-xs font-bold" v-if="job.category"
                  >• {{ job.category.name }}</span
                >
              </div>
              <h1
                class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic"
              >
                {{ job.title }}
              </h1>
              <p class="text-indigo-600 font-black text-lg mt-1 tracking-tight">
                {{ job.employer?.company_name }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4 w-full md:w-auto">
            <button
              @click="handleApply"
              :disabled="candidateStore.loading"
              class="flex-1 md:flex-none px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {{ candidateStore.loading ? 'Applying...' : 'Apply Now' }}
            </button>
            <button
              class="w-16 h-16 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-indigo-600"
            >
              <i class="pi pi-bookmark text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Content Area -->
    <main class="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
      <div class="lg:col-span-2 space-y-12 animate-[fadeIn_0.5s_ease-out]">
        <section>
          <h3
            class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-3"
          >
            <span class="w-8 h-[2px] bg-indigo-600"></span> Job Description
          </h3>
          <div
            class="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed font-medium"
            v-html="job.description"
          ></div>
        </section>

        <section v-if="job.requirements">
          <h3
            class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-3"
          >
            <span class="w-8 h-[2px] bg-indigo-600"></span> Key Requirements
          </h3>
          <div
            class="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed font-medium"
            v-html="job.requirements"
          ></div>
        </section>
      </div>

      <!-- Right Sidebar: Fast Info -->
      <aside class="space-y-8 animate-[fadeIn_0.5s_ease-out_0.2s]">
        <div
          class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-500/5 space-y-8"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center"
            >
              <i class="pi pi-wallet text-emerald-600"></i>
            </div>
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Salary Range
              </p>
              <p class="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {{ job.salary_min }} - {{ job.salary_max }}
                <span class="text-xs opacity-50 uppercase">{{ job.currency }}</span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center"
            >
              <i class="pi pi-map-marker text-blue-600"></i>
            </div>
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Location
              </p>
              <p class="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {{ job.location || 'Remote' }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center"
            >
              <i class="pi pi-briefcase text-purple-600"></i>
            </div>
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Experience Level
              </p>
              <p class="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {{ job.experience_level || 'Mid-Senior' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Company Card -->
        <div
          class="p-8 rounded-[2.5rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20 text-center relative overflow-hidden group"
        >
          <div
            class="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
          ></div>
          <div class="relative z-10">
            <h4 class="text-xl font-black italic mb-4">About {{ job.employer?.company_name }}</h4>
            <p class="text-indigo-100 text-sm mb-6 leading-relaxed">
              {{ job.employer?.bio || 'Leading technology partner in Egypt.' }}
            </p>
            <button
              class="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
            >
              View Company Profile
            </button>
          </div>
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
:deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-top: 1rem;
  color: inherit;
}
:deep(li) {
  margin-bottom: 0.5rem;
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
