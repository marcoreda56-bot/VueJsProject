<template>
  <div
    class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 flex items-center justify-center p-6 font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden relative"
  >
    <div class="absolute top-0 left-0 w-full h-full opacity-50 dark:opacity-20 pointer-events-none">
      <div
        class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"
      ></div>
      <div
        class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"
      ></div>
    </div>

    <div class="max-w-2xl w-full text-center relative z-10 animate-[fadeIn_0.8s_ease-out]">
      <div class="relative inline-block mb-12">
        <h1
          class="text-[12rem] md:text-[15rem] font-black text-slate-900 dark:text-white leading-none tracking-tighter italic select-none opacity-5"
        >
          404
        </h1>
        <div class="absolute inset-0 flex items-center justify-center">
          <div
            class="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center rotate-12 shadow-2xl shadow-indigo-500/40 animate-bounce"
          >
            <i class="pi pi-search text-4xl text-white -rotate-12"></i>
          </div>
        </div>
      </div>

      <h2
        class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-4"
      >
        Lost in <span class="text-indigo-600">Space?</span>
      </h2>
      <p
        class="text-slate-500 dark:text-slate-400 font-bold text-lg mb-10 max-w-md mx-auto leading-relaxed"
      >
        The page you are looking for has been
        <span class="text-slate-900 dark:text-white underline decoration-indigo-500/30"
          >moved or deleted</span
        >. Let's get you back on track.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <router-link
          to="/"
          class="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3"
        >
          <i class="pi pi-home"></i> Back to Home
        </router-link>

        <button
          @click="$router.back()"
          class="px-10 py-5 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-slate-100 dark:border-slate-800 hover:border-indigo-600 hover:text-indigo-600 transition-all"
        >
          Go Back
        </button>
      </div>

      <div class="mt-16 pt-8 border-t border-slate-100 dark:border-slate-900">
        <p
          class="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.5em]"
        >
          Error Code: 0x404_PAGE_NOT_FOUND
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom bounce for the icon to be more "subtle" and premium */
.animate-bounce {
  animation: bounce 3s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(-5%) rotate(12deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0) rotate(12deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>
