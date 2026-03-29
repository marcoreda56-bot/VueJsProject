<template>
  <footer class="relative overflow-hidden bg-slate-950 dark:bg-indigo-950/20 pt-32 pb-16 font-['Plus_Jakarta_Sans',sans-serif] border-t border-slate-900 dark:border-slate-800">
    <!-- Decorative Orbs -->
    <div class="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="max-w-[1800px] mx-auto px-8 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
        <!-- Brand Section -->
        <div class="space-y-8">
          <router-link to="/" class="flex items-center gap-2 no-underline group inline-flex">
            <div class="bg-indigo-600 rounded-2xl p-3 group-hover:rotate-6 transition-all shadow-xl shadow-indigo-500/30">
              <i class="pi pi-briefcase text-white text-lg"></i>
            </div>
            <span class="text-3xl font-black tracking-tighter text-white italic">
              Hire<span class="text-indigo-400">Masr</span>
            </span>
          </router-link>
          <p class="text-slate-400 font-medium leading-relaxed max-w-xs text-lg">
            Connecting Egypt's tech elite with world-class opportunities. The most trusted platform for top-tier careers.
          </p>
          <div class="flex gap-4">
            <a href="#" v-for="icon in socialIcons" :key="icon" class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/10">
              <i :class="`pi pi-${icon}`"></i>
            </a>
          </div>
        </div>

        <!-- Links Columns -->
        <div>
          <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-10">Candidates</h4>
          <ul class="space-y-5 p-0 list-none">
            <li v-for="link in candidateLinks" :key="link.n">
              <router-link :to="link.p" class="text-base font-bold text-slate-400 hover:text-white transition-colors no-underline flex items-center gap-2 group">
                <span class="w-1 h-1 bg-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                {{ link.n }}
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-10">Employers</h4>
          <ul class="space-y-5 p-0 list-none">
            <li v-for="link in employerLinks" :key="link.n">
              <router-link :to="link.p" class="text-base font-bold text-slate-400 hover:text-white transition-colors no-underline flex items-center gap-2 group">
                <span class="w-1 h-1 bg-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                {{ link.n }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-10">Stay Updated</h4>
          <p class="text-base text-slate-400 mb-8 font-medium">Get early access to tech openings.</p>
          <div class="relative group p-1 bg-white/5 rounded-[2rem] border border-white/10 group-focus-within:border-indigo-500/50 transition-all">
            <input 
              type="email" 
              placeholder="Your professional email" 
              class="w-full bg-transparent border-none rounded-full py-4 pl-6 pr-14 text-sm text-white outline-none placeholder:text-slate-600"
            />
            <button class="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-indigo-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all">
              <i class="pi pi-arrow-right text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <p class="text-xs font-bold text-slate-500 tracking-wide">
          &copy; 2026 HireMasr Jobs. Built for the <span class="text-indigo-400">Elite</span>. All rights reserved. 🇪🇬
        </p>
        <div class="flex gap-10">
          <a v-for="item in legalLinks" :key="item" href="#" class="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-400 no-underline transition-colors">{{ item }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const socialIcons = ['twitter', 'linkedin', 'github', 'facebook']
const legalLinks = ['Privacy', 'Terms', 'Legal']

const candidateLinks = [
  { n: 'Browse Jobs', p: '/jobs' },
  { n: 'My Applications', p: '/candidate/applications' },
  { n: 'Career Advice', p: '/about' },
  { n: 'Salary Guide', p: '/jobs' },
]

const employerLinks = [
  { n: 'Post a Position', p: '/employer/post-job' },
  { n: 'Talent Search', p: '/employer/dashboard' },
  { n: 'Company Profile', p: '/employer/dashboard' },
  { n: 'Pricing Plans', p: '/about' },
]
</script>
