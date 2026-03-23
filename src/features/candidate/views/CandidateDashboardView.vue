<template>
  <div
    class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 p-6 lg:p-10 font-['Plus_Jakarta_Sans',sans-serif] animate-[fadeIn_0.6s_ease-out]"
  >
    <header
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
    >
      <div>
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-2">
          Welcome back<span class="text-indigo-600">,</span> Marco
        </h1>
        <p class="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-tight uppercase">
          Everything is looking <span class="text-emerald-500 italic">sharp</span> today.
        </p>
      </div>
      <router-link
        to="/jobs"
        class="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center gap-3"
      >
        <i class="pi pi-briefcase"></i> Browse New Jobs
      </router-link>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <div
        v-for="stat in dashStats"
        :key="stat.label"
        class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group"
      >
        <div
          class="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"
        ></div>
        <div class="relative z-10">
          <div
            class="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all"
          >
            <i :class="stat.icon" class="text-xl"></i>
          </div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
            {{ stat.label }}
          </p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic">
            {{ stat.value }}
          </h3>
        </div>
      </div>
    </div>

    <div
      class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] overflow-hidden shadow-sm"
    >
      <div
        class="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center"
      >
        <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tighter italic">
          Recent Applications
        </h3>
        <button
          class="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
        >
          View All
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/30">
              <th
                v-for="h in ['Job Role', 'Status', 'Date', '']"
                :key="h"
                class="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >
                {{ h }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
            <tr
              v-for="app in dummyApplications"
              :key="app.id"
              class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
            >
              <td class="p-6">
                <div class="flex items-center gap-4">
                  <div
                    class="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center text-indigo-600 font-black text-xs"
                  >
                    {{ app.company.charAt(0) }}
                  </div>
                  <div>
                    <p
                      class="text-slate-900 dark:text-white font-black tracking-tight leading-none mb-1"
                    >
                      {{ app.role }}
                    </p>
                    <p class="text-slate-400 text-xs font-bold">{{ app.company }}</p>
                  </div>
                </div>
              </td>
              <td class="p-6">
                <span
                  :class="statusColor(app.status)"
                  class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                >
                  {{ app.status }}
                </span>
              </td>
              <td class="p-6 text-slate-400 font-bold text-xs">{{ app.date }}</td>
              <td class="p-6 text-right">
                <button
                  class="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-indigo-600 transition-all"
                >
                  <i class="pi pi-chevron-right"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const dashStats = [
  { label: 'Applied Jobs', value: '12', icon: 'pi pi-send' },
  { label: 'Shortlisted', value: '03', icon: 'pi pi-star' },
  { label: 'Profile Views', value: '154', icon: 'pi pi-eye' },
]

const dummyApplications = [
  {
    id: 1,
    role: 'Full Stack Engineer',
    company: 'TechFlow Systems',
    status: 'pending',
    date: 'Oct 24, 2026',
  },
  {
    id: 2,
    role: 'Frontend Developer',
    company: 'DesignCo',
    status: 'shortlisted',
    date: 'Oct 22, 2026',
  },
  {
    id: 3,
    role: 'Laravel Specialist',
    company: 'Souq Solutions',
    status: 'rejected',
    date: 'Oct 18, 2026',
  },
]

const statusColor = (status) => {
  switch (status) {
    case 'shortlisted':
      return 'bg-emerald-50 text-emerald-600 border-emerald-100'
    case 'pending':
      return 'bg-amber-50 text-amber-600 border-amber-100'
    case 'rejected':
      return 'bg-rose-50 text-rose-600 border-rose-100'
    default:
      return 'bg-slate-50 text-slate-600 border-slate-100'
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
