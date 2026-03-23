<template>
  <div class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
    <header class="sticky top-0 z-50 px-6 py-4">
      <div
        class="max-w-7xl mx-auto backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800 rounded-2xl px-6 py-3 flex justify-between items-center shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all"
      >
        <div class="flex items-center gap-3 group cursor-pointer">
          <div
            class="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none transition-transform group-hover:scale-110"
          >
            <i class="pi pi-user text-white text-sm"></i>
          </div>
          <h1
            class="font-black text-xl tracking-tighter text-slate-900 dark:text-white italic uppercase"
          >
            Portal<span class="text-indigo-600">.</span>
          </h1>
        </div>

        <div class="flex items-center gap-4">
          <div class="hidden sm:flex flex-col items-end mr-2">
            <span
              class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none"
              >Candidate</span
            >
            <span class="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight"
              >Marco Reda</span
            >
          </div>

          <div class="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1"></div>

          <button
            class="flex items-center gap-2 px-4 py-2 text-sm font-black text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all uppercase tracking-wider group"
          >
            <span>Logout</span>
            <i class="pi pi-sign-out text-xs group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-8 px-6 animate-[fadeIn_0.5s_ease-out]">
      <router-view v-slot="{ Component }">
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform translate-y-4 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform translate-y-4 opacity-0"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
