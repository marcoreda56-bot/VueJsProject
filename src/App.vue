<template>
  <div
    class="app-container min-h-screen bg-gradient-to-b from-sky-50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900"
  >
    <AppNavbar />

    <main class="w-full px-4 sm:px-6 lg:px-8 pt-28 pb-10">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="mt-10 border-t border-slate-800 bg-slate-950 text-slate-300">
      <div class="w-full px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 gap-8 md:grid-cols-4">
        <div class="md:col-span-2">
          <h3 class="text-xl font-black tracking-tight text-white">
            Hire<span class="text-sky-400">Masr</span>
          </h3>
          <p class="mt-3 max-w-md text-sm text-slate-400 leading-relaxed">
            Your modern hiring platform for Egypt. Find quality opportunities and connect with
            trusted employers.
          </p>
        </div>

        <div>
          <h4 class="text-xs font-black uppercase tracking-[0.16em] text-white">
            Quick Links
          </h4>
          <div class="mt-3 flex flex-col gap-2 text-sm">
            <router-link to="/" class="text-slate-400 hover:text-sky-300 no-underline">Home</router-link>
            <router-link to="/jobs" class="text-slate-400 hover:text-sky-300 no-underline">Jobs</router-link>
            <router-link to="/about" class="text-slate-400 hover:text-sky-300 no-underline">About</router-link>
          </div>
        </div>

        <div>
          <h4 class="text-xs font-black uppercase tracking-[0.16em] text-white">
            Contact
          </h4>
          <div class="mt-3 flex flex-col gap-2 text-sm text-slate-400">
            <p>support@hiremasr.com</p>
            <p>Sun - Thu, 9:00 AM - 5:00 PM</p>
          </div>
        </div>
      </div>

      <div
        class="w-full px-4 sm:px-6 lg:px-8 py-4 border-t border-slate-800 text-xs text-slate-400 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      >
        <p>&copy; 2026 SouqMasr Jobs. All rights reserved.</p>
        <p class="uppercase tracking-[0.15em]">Jobs for Egypt's modern teams</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import AppNavbar from './components/AppNavbar.vue'
</script>
