<template>
  <div class="font-['Plus_Jakarta_Sans',sans-serif]">
    <div
      class="rounded-[2rem] bg-gradient-to-br from-sky-600 via-sky-700 to-cyan-700 px-6 py-12 sm:p-12 text-white mb-10"
    >
      <p class="text-xs uppercase tracking-[0.18em] font-black text-sky-100">About HireMasr</p>
      <h1 class="mt-4 text-4xl sm:text-5xl font-black tracking-tight max-w-2xl">We connect great talent with serious employers.</h1>
      <p class="mt-4 text-sky-100 max-w-2xl leading-relaxed">
        HireMasr is a modern hiring platform focused on quality, speed, and trust across Egypt's tech ecosystem.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-sm"
      >
        <div class="text-4xl font-black text-sky-700 dark:text-sky-300 mb-2 tracking-tight">{{ stat.value }}</div>
        <p class="text-slate-500 font-black uppercase tracking-[0.16em] text-[10px]">
          {{ stat.label }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div class="space-y-5">
        <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Built for people, not just resumes.
        </h2>
        <div class="space-y-4">
          <div v-for="value in values" :key="value.title" class="flex gap-4">
            <div class="w-11 h-11 bg-sky-50 dark:bg-sky-900/20 rounded-xl flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
              <i :class="value.icon" class="text-lg"></i>
            </div>
            <div>
              <h4 class="text-base font-black text-slate-900 dark:text-white">{{ value.title }}</h4>
              <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{{ value.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8">
        <h3 class="text-xl font-black text-slate-900 dark:text-white">What we focus on</h3>
        <ul class="mt-4 space-y-3 text-slate-600 dark:text-slate-300">
          <li class="flex gap-2"><i class="pi pi-check text-sky-600 mt-1"></i> Clear, trustworthy job information.</li>
          <li class="flex gap-2"><i class="pi pi-check text-sky-600 mt-1"></i> Better quality matches between candidates and teams.</li>
          <li class="flex gap-2"><i class="pi pi-check text-sky-600 mt-1"></i> Fast and friendly application experience.</li>
        </ul>
        <div class="mt-6 rounded-2xl bg-sky-50 dark:bg-sky-900/20 p-4 border border-sky-100 dark:border-sky-800/40">
          <p class="text-sm text-slate-700 dark:text-slate-200">
            We are continuously improving the product based on candidate and employer feedback.
          </p>
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
