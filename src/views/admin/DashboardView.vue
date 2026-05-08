<template>
  <div class="space-y-10 font-['Outfit']">
    <header>
      <h2 class="text-3xl font-black italic text-slate-900 dark:text-white">
        System <span class="text-indigo-600">Overview.</span>
      </h2>
    </header>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="(val, label) in adminStore.stats"
        :key="label"
        class="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-500/5"
      >
        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
          {{ label.replace(/([A-Z])/g, ' $1') }}
        </p>
        <p class="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter">
          {{ val }}
        </p>
      </div>
    </div>

    <!-- Quick Actions or Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div
        class="lg:col-span-2 bg-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden group"
      >
        <div class="relative z-10">
          <h3 class="text-3xl font-black italic mb-4 tracking-tighter">
            Ready to manage<br />the platform, Marco?
          </h3>
          <p class="text-indigo-100 font-medium mb-8 max-w-md italic">
            All system controls are active. You can moderate jobs, manage categories, and monitor
            users from one place.
          </p>
          <router-link
            to="/admin/management/taxonomy"
            class="inline-block px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
          >
            Start Taxonomy Control
          </router-link>
        </div>
        <i
          class="pi pi-shield absolute -bottom-10 -right-10 text-[15rem] opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-700"
        ></i>
      </div>

      <div
        class="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800"
      >
        <h3 class="font-black italic text-xl mb-6">Quick Link</h3>
        <div class="space-y-4">
          <router-link
            v-for="link in ['Users', 'Jobs']"
            :key="link"
            :to="`/admin/management/${link.toLowerCase()}`"
            class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group hover:bg-indigo-600 transition-all"
          >
            <span class="font-bold group-hover:text-white transition-colors"
              >Manage {{ link }}</span
            >
            <i class="pi pi-arrow-right group-hover:text-white transition-colors"></i>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAdminStore } from '@/stores/AdminStore'
const adminStore = useAdminStore()
</script>
