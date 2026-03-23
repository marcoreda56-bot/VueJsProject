<template>
  <div
    class="min-h-[90vh] flex items-center justify-center bg-[#FAFAFA] dark:bg-slate-950 p-6 font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden relative"
  >
    <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full"></div>

    <div
      class="relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.04)] border border-white dark:border-slate-800 max-w-xl w-full text-center animate-[fadeIn_0.6s_ease-out]"
    >
      <div
        class="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-[2rem] mb-8 shadow-2xl shadow-indigo-200 dark:shadow-none animate-bounce-slow"
      >
        <i class="pi pi-paper-plane text-white text-3xl"></i>
      </div>

      <h2 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-3 italic">
        Send Application<span class="text-indigo-600">.</span>
      </h2>
      <p
        class="text-slate-500 dark:text-slate-400 mb-10 font-bold text-sm uppercase tracking-[0.15em]"
      >
        Reference ID:
        <span class="text-indigo-600 dark:text-indigo-400">#{{ $route.params.id }}</span>
      </p>

      <div class="space-y-4 mb-10">
        <div
          class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 group hover:border-indigo-400 transition-colors cursor-pointer"
        >
          <i
            class="pi pi-cloud-upload text-2xl text-slate-300 group-hover:text-indigo-500 transition-colors mb-2"
          ></i>
          <p class="text-xs font-black text-slate-400 uppercase tracking-widest">
            Upload your CV (PDF)
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <button
          class="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-500/20 active:scale-[0.98] transition-all"
        >
          Submit Application
        </button>

        <button
          @click="$router.back()"
          class="w-full py-5 bg-transparent text-slate-400 dark:text-slate-500 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-2 group"
        >
          <i
            class="pi pi-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform"
          ></i>
          Nevermind, Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-bounce-slow {
  animation: bounce 3s infinite;
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(-5%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>
