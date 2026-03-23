<template>
  <div
    class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 flex items-center justify-center p-6 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden"
  >
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[150px] rounded-full animate-pulse"
      ></div>
      <div
        class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full"
      ></div>
      <div
        class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] dark:opacity-[0.05]"
      ></div>
    </div>

    <div class="max-w-4xl w-full text-center relative z-10 animate-[fadeIn_1s_ease-out]">
      <div
        class="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl mb-12 shadow-2xl shadow-indigo-500/10 hover:-translate-y-1 transition-transform cursor-default"
      >
        <span class="relative flex h-3 w-3">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"
          ></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
        </span>
        <span
          class="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.4em] italic"
          >System Under Development</span
        >
      </div>

      <h1
        class="text-7xl md:text-9xl font-black text-slate-900 dark:text-white tracking-tighter italic leading-none mb-8"
      >
        Crafting <br />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400"
          >Excellence.</span
        >
      </h1>

      <p
        class="text-slate-500 dark:text-slate-400 font-bold text-xl max-w-xl mx-auto mb-16 leading-relaxed tracking-tight"
      >
        Marco is currently engineering a
        <span class="text-slate-900 dark:text-white underline decoration-indigo-500/30 decoration-4"
          >high-performance</span
        >
        experience. Something big is about to drop.
      </p>

      <div class="flex justify-center gap-4 md:gap-8 mb-16">
        <div
          v-for="unit in ['Days', 'Hours', 'Mins']"
          :key="unit"
          class="flex flex-col items-center"
        >
          <div
            class="w-20 h-20 md:w-28 md:h-28 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] flex items-center justify-center text-3xl md:text-4xl font-black text-indigo-600 italic shadow-sm"
          >
            00
          </div>
          <span class="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{{
            unit
          }}</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
        <button
          @click="$router.back()"
          class="px-12 py-5 bg-slate-900 dark:bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3"
        >
          <i class="pi pi-arrow-left"></i> Go Back
        </button>
        <p
          class="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.5em] hidden sm:block"
        >
          Stay Tuned
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h1 {
  -webkit-text-stroke: 1px rgba(0, 0, 0, 0.02);
}
.dark h1 {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.02);
}
</style>
