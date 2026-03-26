<template>
  <div
    class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 py-20 px-6 lg:px-12 font-['Plus_Jakarta_Sans',sans-serif]"
  >
    <div class="max-w-6xl mx-auto text-center mb-24 animate-[fadeIn_0.8s_ease-out]">
      <div
        class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-full mb-6 border border-indigo-100 dark:border-indigo-500/20"
      >
        <span
          class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em]"
          >Our Mission</span
        >
      </div>
      <h1
        class="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter italic leading-none mb-8"
      >
        We bridge the<br />
        <span class="text-indigo-600">talent gap.</span>
      </h1>
      <p
        class="text-slate-500 dark:text-slate-400 font-bold text-xl max-w-2xl mx-auto leading-relaxed"
      >
        HireMasr is not just a job board; it's a
        <span class="text-slate-900 dark:text-white underline decoration-indigo-500/30 decoration-4"
          >tech ecosystem</span
        >
        designed to connect Egypt's brightest minds with global opportunities.
      </p>
    </div>

    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 text-center group hover:-translate-y-2 transition-all duration-500 shadow-sm"
      >
        <div
          class="text-5xl font-black text-indigo-600 italic mb-2 tracking-tighter group-hover:scale-110 transition-transform"
        >
          {{ stat.value }}
        </div>
        <p class="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
          {{ stat.label }}
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div class="space-y-8 px-4">
        <h2 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic">
          Built by developers,<br />
          <span class="text-indigo-600">for the industry.</span>
        </h2>

        <div class="space-y-6">
          <div v-for="value in values" :key="value.title" class="flex gap-6 group">
            <div
              class="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shrink-0"
            >
              <i :class="value.icon" class="text-xl"></i>
            </div>
            <div>
              <h4
                class="text-lg font-black text-slate-900 dark:text-white italic tracking-tight mb-1"
              >
                {{ value.title }}
              </h4>
              <p class="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
                {{ value.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="relative hidden lg:block">
        <div
          class="w-full aspect-square bg-slate-900 dark:bg-indigo-600/5 rounded-[4rem] relative overflow-hidden group"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent"></div>
          <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-black text-white/5 italic select-none"
          >
            HM
          </div>
          <div
            class="absolute bottom-12 left-12 right-12 bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-3xl animate-pulse"
          >
            <div class="w-12 h-2 bg-white/20 rounded-full mb-3"></div>
            <div class="w-24 h-2 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const stats = [
  { value: '15k+', label: 'Active Candidates' },
  { value: '450+', label: 'Top Tier Companies' },
  { value: '89%', label: 'Match Success Rate' },
]

const values = [
  {
    icon: 'pi pi-bolt',
    title: 'Precision Matching',
    desc: 'Our algorithms ensure you only see jobs that match your exact technical stack and career goals.',
  },
  {
    icon: 'pi pi-shield',
    title: 'Verified Employers',
    desc: 'Every company on HireMasr goes through a vetting process to ensure legitimate, high-quality roles.',
  },
  {
    icon: 'pi pi-globe',
    title: 'Remote First',
    desc: 'Connecting Egyptian talent with global opportunities across multiple timezones and regions.',
  },
]
</script>

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
</style>
