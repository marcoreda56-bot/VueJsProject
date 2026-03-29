<template>
  <div class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-['Outfit',sans-serif] pb-20">
    <!-- Header -->
    <div class="max-w-6xl mx-auto px-6 pt-12">
      <div class="flex items-center gap-4 mb-8 animate-[fadeIn_0.5s_ease-out]">
        <button
          @click="$router.back()"
          class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
        >
          <i class="pi pi-arrow-left"></i>
        </button>
        <div>
          <p class="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1">Application Details</p>
          <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic">
            Review <span class="text-indigo-600">Candidate</span>
          </h1>
        </div>
      </div>

      <div v-if="loading" class="text-center py-24 text-slate-400 font-bold italic text-lg animate-pulse">
        Loading application details...
      </div>

      <div v-else-if="details" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Sidebar: Candidate Card -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-[40px] rounded-full animate-pulse"></div>
            
            <div class="relative z-10 text-center">
              <div class="w-24 h-24 bg-indigo-50 dark:bg-indigo-500/10 rounded-[2rem] flex items-center justify-center text-indigo-600 text-4xl font-black italic mx-auto mb-6 border border-indigo-100 dark:border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                {{ (details.candidate.name || 'C').charAt(0).toUpperCase() }}
              </div>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{{ details.candidate.name }}</h2>
              <p class="text-indigo-500 font-black text-[10px] uppercase tracking-widest italic mb-6">
                {{ details.candidate.email }}
              </p>
              
              <div class="flex flex-col gap-3">
                <div class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <i class="pi pi-map-marker text-indigo-400"></i>
                  <span class="text-sm font-bold text-slate-600 dark:text-slate-400">{{ details.candidate.location || 'N/A' }}</span>
                </div>
                <div v-if="details.candidate.phone" class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <i class="pi pi-phone text-indigo-400"></i>
                  <span class="text-sm font-bold text-slate-600 dark:text-slate-400">{{ details.candidate.phone }}</span>
                </div>
              </div>
            </div>

            <!-- Profile Status -->
            <div class="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Application Status</span>
                <span :class="statusStyle(details.application.status)" class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border">
                  {{ details.application.status }}
                </span>
              </div>
            </div>

            <!-- Quick Actions -->
            <div v-if="details.application.status === 'pending'" class="grid grid-cols-2 gap-3 mt-8">
              <button 
                @click="updateStatus('accepted')"
                class="py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <i class="pi pi-check text-[9px]"></i> Accept
              </button>
              <button 
                @click="updateStatus('rejected')"
                class="py-4 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-600 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <i class="pi pi-times text-[9px]"></i> Reject
              </button>
            </div>
            <div v-else class="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                This application has already been <span :class="statusTextClass(details.application.status)">{{ details.application.status }}</span>.
              </p>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Cover Letter -->
          <section class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-sm animate-[fadeIn_0.6s_ease-out]">
            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <span class="w-6 h-[2px] bg-indigo-600"></span> Cover Letter
            </h3>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">
              "{{ details.application.cover_letter || 'No cover letter provided.' }}"
            </p>
          </section>

          <!-- Experience -->
          <section class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-sm animate-[fadeIn_0.7s_ease-out]">
            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
              <span class="w-6 h-[2px] bg-indigo-600"></span> Experience
            </h3>
            
            <div v-if="details.experience.length === 0" class="text-slate-300 italic text-sm py-4">
              No experience details provided.
            </div>
            
            <div v-else class="space-y-8 relative">
              <div class="absolute left-[20px] top-2 bottom-2 w-0.5 bg-slate-50 dark:bg-slate-800"></div>
              <div v-for="exp in details.experience" :key="exp.id" class="relative pl-12">
                <div class="absolute left-0 top-0 w-10 h-10 bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-xl flex items-center justify-center z-10">
                  <i class="pi pi-briefcase text-indigo-500 text-xs"></i>
                </div>
                <div>
                  <h4 class="text-lg font-black text-slate-900 dark:text-white tracking-tight">{{ exp.title }}</h4>
                  <div class="flex items-center gap-2 text-indigo-500 font-bold text-[11px] uppercase tracking-widest mt-1">
                    <span>{{ exp.company }}</span>
                    <span class="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span class="text-slate-400">{{ exp.location }}</span>
                  </div>
                  <p class="text-[11px] font-bold text-slate-400 mt-2 italic">
                    {{ formatDate(exp.start_date) }} — {{ exp.is_current ? 'Present' : formatDate(exp.end_date) }}
                  </p>
                  <p class="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
                    {{ exp.description }}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Education -->
          <section class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-sm animate-[fadeIn_0.8s_ease-out]">
            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
              <span class="w-6 h-[2px] bg-indigo-600"></span> Education
            </h3>
            
            <div v-if="details.education.length === 0" class="text-slate-300 italic text-sm py-4">
              No education details provided.
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                v-for="edu in details.education" 
                :key="edu.id"
                class="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 transition-all"
              >
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600">
                    <i class="pi pi-book"></i>
                  </div>
                  <h4 class="font-black text-slate-900 dark:text-white tracking-tight leading-none">{{ edu.degree }}</h4>
                </div>
                <p class="text-xs font-bold text-slate-500 mb-1">{{ edu.institution }}</p>
                <p class="text-[11px] font-black text-indigo-500 uppercase tracking-widest italic">{{ edu.field_of_study }}</p>
                <p class="text-[10px] font-bold text-slate-400 mt-4">{{ edu.start_year }} — {{ edu.end_year || 'Present' }}</p>
              </div>
            </div>
          </section>

          <!-- Skills -->
          <section class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-sm animate-[fadeIn_0.9s_ease-out]">
            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <span class="w-6 h-[2px] bg-indigo-600"></span> Candidate Skills
            </h3>
            <div class="flex flex-wrap gap-3">
              <div 
                v-for="skill in details.skills" 
                :key="skill.id"
                class="group px-6 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-3 hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-all"
              >
                <span class="text-sm font-black text-slate-700 dark:text-slate-300">{{ getSkillName(skill.skill_id) }}</span>
                <span class="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span class="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] italic">{{ skill.level }}</span>
              </div>
              <div v-if="details.skills.length === 0" class="text-slate-300 italic text-sm">No skills listed.</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployerStore } from '@/stores/employer.store'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const employerStore = useEmployerStore()

const loading = ref(true)
const details = ref(null)

onMounted(async () => {
  try {
    const data = await employerStore.fetchApplicationDetails(route.params.id)
    details.value = data
  } catch (err) {
    Swal.fire('Error', 'Could not load application details.', 'error')
    router.push({ name: 'employer.applications' })
  } finally {
    loading.value = false
    // Ensure skills are loaded for names mapping
    if (employerStore.skills.length === 0) {
      await employerStore.fetchSkills()
    }
  }
})

const getSkillName = (id) => {
  return employerStore.skills.find(s => String(s.id) === String(id))?.name || 'Skill'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

const statusStyle = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'accepted') return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10'
  if (s === 'rejected') return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10'
  return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10'
}

const statusTextClass = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'accepted') return 'text-emerald-500'
  if (s === 'rejected') return 'text-rose-500'
  return 'text-amber-500'
}

const updateStatus = async (status) => {
  try {
    await employerStore.updateApplicationStatus(details.value.application.id, status)
    details.value.application.status = status
    
    Swal.fire({
      title: status === 'accepted' ? 'Accepted!' : 'Rejected',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      customClass: { popup: 'rounded-[2rem] p-10' }
    })
  } catch (err) {
    Swal.fire('Error', 'Failed to update status.', 'error')
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
