<template>
  <div
    class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 flex font-['Plus_Jakarta_Sans',sans-serif]"
  >
    <aside
      class="w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-8 hidden lg:flex flex-col sticky top-0 h-screen transition-all duration-300"
    >
      <div class="flex items-center gap-3 mb-12 group cursor-pointer px-2">
        <div
          class="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none transition-transform group-hover:rotate-6"
        >
          <i class="pi pi-briefcase text-white text-xl"></i>
        </div>
        <span
          class="font-black text-2xl tracking-tighter text-slate-900 dark:text-white italic uppercase leading-none"
        >
          Jobs<span class="text-indigo-600">.</span>App
        </span>
      </div>

      <nav class="flex-1 space-y-2">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 ml-4">
          Main Menu
        </p>

        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          class="flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 no-underline group relative overflow-hidden"
          active-class="bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none"
          :class="[
            isActive(item.path)
              ? ''
              : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600',
          ]"
        >
          <i
            :class="[
              item.icon,
              isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600',
            ]"
            class="text-lg transition-colors"
          ></i>
          <span class="relative z-10">{{ item.name }}</span>
        </router-link>
      </nav>

      <div class="mt-auto pt-8 border-t border-slate-50 dark:border-slate-800">
        <div
          class="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group"
        >
          <img
            src="https://ui-avatars.com/api/?name=Marco+Reda&background=6366f1&color=fff"
            class="w-10 h-10 rounded-xl shadow-sm border-2 border-transparent group-hover:border-indigo-500 transition-all"
          />
          <div class="flex-1 overflow-hidden">
            <p class="text-sm font-black text-slate-900 dark:text-white truncate">Marco Reda</p>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
              Developer
            </p>
          </div>
          <button
            class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <i class="pi pi-sign-out text-sm"></i>
          </button>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header
        class="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-10 sticky top-0 z-40"
      >
        <div class="lg:hidden font-black text-xl italic tracking-tighter">
          JOBS<span class="text-indigo-600">.</span>
        </div>
        <div class="hidden md:block text-sm font-bold text-slate-400">
          Hello, <span class="text-slate-900 dark:text-white font-black uppercase">Marco</span> —
          Welcome back!
        </div>

        <div class="flex items-center gap-4">
          <button
            class="relative w-10 h-10 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <i class="pi pi-bell text-sm"></i>
            <span
              class="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"
            ></span>
          </button>
          <button
            class="lg:hidden w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
          >
            <i class="pi pi-bars"></i>
          </button>
        </div>
      </header>

      <div class="p-10 flex-1 overflow-y-auto">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const isActive = (path) => route.path === path

const menuItems = [
  { name: 'Dashboard', path: '/', icon: 'pi pi-th-large' },
  { name: 'Jobs Browser', path: '/jobs', icon: 'pi pi-search' },
  { name: 'Applications', path: '/applications', icon: 'pi pi-send' },
  { name: 'My Profile', path: '/profile', icon: 'pi pi-user' },
]
</script>
