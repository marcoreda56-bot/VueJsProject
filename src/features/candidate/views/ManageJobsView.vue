<template>
  <div
    class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 p-6 lg:p-10 font-['Plus_Jakarta_Sans',sans-serif] animate-[fadeIn_0.6s_ease-out]"
  >
    <header
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
    >
      <div>
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-2">
          Manage <span class="text-indigo-600">Jobs.</span>
        </h1>
        <p class="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-tight uppercase">
          Track, edit, and oversee your <span class="text-indigo-600 italic">active listings</span>.
        </p>
      </div>
      <router-link
        to="/employer/post-job"
        class="px-8 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3"
      >
        <i class="pi pi-plus"></i> Post New Role
      </router-link>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      <div
        v-for="stat in summary"
        :key="stat.label"
        class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm"
      >
        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
          {{ stat.label }}
        </p>
        <h3 class="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter">
          {{ stat.value }}
        </h3>
      </div>
    </div>

    <div
      class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] overflow-hidden shadow-sm"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/30">
              <th
                v-for="h in ['Job Identity', 'Applicants', 'Status', 'Date Posted', 'Actions']"
                :key="h"
                class="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"
              >
                {{ h }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
            <tr
              v-for="job in postedJobs"
              :key="job.id"
              class="group hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all"
            >
              <td class="p-6">
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 font-black text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all"
                  >
                    {{ job.title.charAt(0) }}
                  </div>
                  <div>
                    <p
                      class="text-slate-900 dark:text-white font-black tracking-tight leading-none mb-1 text-lg"
                    >
                      {{ job.title }}
                    </p>
                    <p class="text-slate-400 text-xs font-bold uppercase tracking-tighter">
                      {{ job.category }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="p-6">
                <div class="flex flex-col">
                  <span
                    class="text-slate-900 dark:text-white font-black italic text-xl leading-none"
                    >{{ job.applicants }}</span
                  >
                  <span class="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1"
                    >Total Applied</span
                  >
                </div>
              </td>

              <td class="p-6">
                <span
                  :class="
                    job.status === 'active'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  "
                  class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                >
                  {{ job.status }}
                </span>
              </td>

              <td class="p-6 text-slate-400 font-bold text-xs uppercase">{{ job.date }}</td>

              <td class="p-6">
                <div class="flex gap-2">
                  <button
                    class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center"
                    title="Edit Job"
                  >
                    <i class="pi pi-pencil text-xs"></i>
                  </button>
                  <button
                    class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center justify-center"
                    title="Close Job"
                  >
                    <i class="pi pi-power-off text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const summary = [
  { label: 'Active Jobs', value: '08' },
  { label: 'Total Applicants', value: '142' },
  { label: 'Unread Applications', value: '24' },
  { label: 'Interviewed', value: '12' },
]

const postedJobs = [
  {
    id: 1,
    title: 'Senior Vue.js Developer',
    category: 'Software Engineering',
    applicants: 45,
    status: 'active',
    date: 'Mar 15, 2026',
  },
  {
    id: 2,
    title: 'UX/UI Product Designer',
    category: 'Design',
    applicants: 32,
    status: 'active',
    date: 'Mar 10, 2026',
  },
  {
    id: 3,
    title: 'Backend Laravel Expert',
    category: 'Software Engineering',
    applicants: 65,
    status: 'closed',
    date: 'Feb 28, 2026',
  },
]
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
