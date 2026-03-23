<template>
  <div
    class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 p-10 font-['Plus_Jakarta_Sans',sans-serif]"
  >
    <div class="max-w-7xl mx-auto mb-10">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
            <span
              class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em]"
              >System Live</span
            >
          </div>
          <h1 class="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic">
            Admin<span class="text-indigo-600">.</span>Control
          </h1>
        </div>

        <div
          class="inline-flex items-center gap-4 bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/30 px-6 py-4 rounded-[2rem] shadow-[0_10px_30px_rgba(239,68,68,0.05)]"
        >
          <div
            class="w-10 h-10 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center"
          >
            <i class="pi pi-shield text-red-500 text-lg"></i>
          </div>
          <div>
            <p
              class="text-[10px] font-black text-red-400 uppercase tracking-widest leading-none mb-1"
            >
              Security Status
            </p>
            <p class="text-sm font-bold text-red-600 dark:text-red-400">
              Restricted Access Enabled
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="stat in ['System Load', 'Active Users', 'Database Status']"
        :key="stat"
        class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-xl hover:shadow-indigo-500/5 transition-all group cursor-default"
      >
        <p
          class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 group-hover:text-indigo-600 transition-colors"
        >
          {{ stat }}
        </p>
        <div class="flex items-end gap-2">
          <span
            class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none"
          >
            {{ stat === 'System Load' ? '2.4%' : stat === 'Active Users' ? '1,284' : 'Optimal' }}
          </span>
          <i
            class="pi pi-chart-line text-slate-200 dark:text-slate-800 text-xl group-hover:text-indigo-500/20 transition-colors"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>
