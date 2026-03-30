<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm">
      <div 
        ref="modalRef"
        class="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col relative"
      >
        <!-- Close Button -->
        <button 
          @click="$emit('close')"
          class="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all z-20"
        >
          <i class="pi pi-times"></i>
        </button>

        <!-- Modal Body (Scrollable) -->
        <div class="flex-1 overflow-y-auto p-10 md:p-14 custom-scrollbar">
          <div class="relative">
            <div class="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/5 blur-[100px] rounded-full"></div>

            <!-- Header Info -->
            <div class="flex flex-col md:flex-row justify-between items-start gap-8 mb-12 relative z-10">
              <div class="flex items-center gap-8">
                <div class="w-20 h-20 bg-slate-900 dark:bg-slate-800 rounded-[1.8rem] flex items-center justify-center text-white text-3xl font-black italic shadow-2xl shadow-indigo-500/10">
                  {{ job.title?.charAt(0) || 'J' }}
                </div>
                <div>
                  <h2 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-2 leading-none">
                    {{ job.title }}
                  </h2>
                  <div class="flex items-center gap-3">
                    <p class="text-rose-500 font-black text-[10px] uppercase tracking-[0.2em] bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-lg">
                      {{ job.status }}
                    </p>
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                    <p class="text-slate-400 font-bold text-[11px] uppercase tracking-widest flex items-center gap-2">
                       <i class="pi pi-map-marker text-[10px]"></i> {{ job.location || 'Remote' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 relative z-10">
              <div class="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Work Type</p>
                <p class="font-bold text-slate-700 dark:text-white text-sm capitalize">{{ job.work_type }}</p>
              </div>
              <div class="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Experience</p>
                <p class="font-bold text-slate-700 dark:text-white text-sm capitalize">{{ job.experience_level || 'Not Specified' }}</p>
              </div>
              <div class="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Salary Range</p>
                <p class="font-bold text-indigo-600 text-sm italic">{{ job.salary_min?.toLocaleString() }} - {{ job.salary_max?.toLocaleString() }}</p>
              </div>
              <div class="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Posted Date</p>
                <p class="font-bold text-slate-700 dark:text-white text-sm">{{ formatDate(job.created_at) }}</p>
              </div>
            </div>

            <!-- Description -->
            <div class="space-y-12 relative z-10">
              <section>
                <h3 class="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] mb-6 flex items-center gap-3">
                  <span class="w-8 h-[2px] bg-indigo-500"></span> Role Description
                </h3>
                <p class="text-slate-600 dark:text-slate-400 leading-[1.8] font-medium text-lg italic whitespace-pre-line">
                  {{ job.description }}
                </p>
              </section>

              <section>
                <h3 class="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] mb-6 flex items-center gap-3">
                  <span class="w-8 h-[2px] bg-indigo-500"></span> Requirements
                </h3>
                <div class="bg-indigo-50/30 dark:bg-indigo-500/5 p-8 rounded-[2.5rem] font-bold text-sm text-slate-600 dark:text-slate-400 leading-loose border border-indigo-100/50 dark:border-indigo-500/10">
                  <p class="whitespace-pre-line">{{ job.requirements }}</p>
                </div>
              </section>

              <section v-if="job.benefits">
                <h3 class="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] mb-6 flex items-center gap-3">
                  <span class="w-8 h-[2px] bg-indigo-500"></span> Perks & Benefits
                </h3>
                <p class="text-slate-600 dark:text-slate-400 leading-relaxed font-medium whitespace-pre-line">
                  {{ job.benefits }}
                </p>
              </section>

              <section v-if="job.technologies?.length">
                <h3 class="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] mb-6 flex items-center gap-3">
                  <span class="w-8 h-[2px] bg-indigo-500"></span> Tech Stack
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="tech in job.technologies" 
                    :key="tech"
                    class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-black text-slate-600 dark:text-slate-300 shadow-sm capitalize"
                  >
                    {{ tech }}
                  </span>
                </div>
              </section>
            </div>
          </div>
        </div>

        <!-- Sticky Footer Actions -->
        <div class="p-8 border-t border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 transition-all">
          <button 
            @click="$emit('close')"
            class="px-8 py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
          >
            Close
          </button>
          <button 
            @click="$emit('edit', job.id)"
            class="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-500 transition-all flex items-center gap-3"
          >
            <i class="pi pi-pencil"></i> Edit Job
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  job: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'edit'])

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Close on ESC
const handleEsc = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => window.addEventListener('keydown', handleEsc))
onUnmounted(() => window.removeEventListener('keydown', handleEsc))
</script>

<script>
// For some reason defineEmits is not working well in some script setup setups without explicit definition
export default {
  inheritAttrs: false
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
.modal-enter-active .bg-white, .modal-leave-active .bg-white {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}
.modal-enter-from .bg-white, .modal-leave-to .bg-white {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f1f5f9;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
}
</style>
