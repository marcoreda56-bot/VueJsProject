<template>
  <aside
    class="w-full max-w-[320px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
  >
    <div class="flex items-center justify-between mb-10">
      <h2
        class="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2"
      >
        <i class="pi pi-sliders-h text-indigo-600"></i>
        Filters
      </h2>
      <button
        class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors"
      >
        Reset
      </button>
    </div>

    <div class="space-y-8">
      <div class="space-y-3">
        <label class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2"
          >Keyword</label
        >
        <div class="relative">
          <i class="pi pi-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
          <input
            type="text"
            placeholder="Search titles..."
            class="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600/20 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-semibold text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-300"
          />
        </div>
      </div>

      <div class="space-y-3">
        <label class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2"
          >Category</label
        >
        <div class="relative group">
          <select
            class="w-full appearance-none px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all font-semibold text-sm text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option disabled selected>Select Category</option>
            <option>Software Engineering</option>
            <option>Design & Creative</option>
            <option>Sales & Marketing</option>
          </select>
          <i
            class="pi pi-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs transition-transform group-focus-within:rotate-180"
          ></i>
        </div>
      </div>

      <div class="space-y-4">
        <label class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2"
          >Workplace</label
        >
        <div class="grid gap-2">
          <label
            v-for="type in ['Remote', 'On-site', 'Hybrid']"
            :key="type"
            class="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
          >
            <span
              class="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 transition-colors"
              >{{ type }}</span
            >
            <div class="relative flex items-center justify-center">
              <input
                type="checkbox"
                class="peer appearance-none w-6 h-6 border-2 border-slate-200 dark:border-slate-700 rounded-lg checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer"
              />
              <i
                class="pi pi-check absolute text-[10px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
              ></i>
            </div>
          </label>
        </div>
      </div>

      <button
        class="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <i class="pi pi-filter-slash text-[10px]"></i>
        Clear All Filters
      </button>
    </div>
  </aside>
</template>
<script setup></script>
