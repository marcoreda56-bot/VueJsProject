<template>
  <div
    class="flex min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-['Outfit',sans-serif]"
  >
    <Transition name="fade">
      <div
        v-if="isMobileOpen"
        @click="isMobileOpen = false"
        class="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[70]"
      ></div>
    </Transition>

    <aside
      :class="[
        'fixed lg:sticky top-0 h-screen z-[80] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col shadow-2xl lg:shadow-none',
        isCollapsed ? 'w-24' : 'w-80',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <button
        @click="isCollapsed = !isCollapsed"
        class="cursor-pointer hidden lg:flex absolute -right-4 top-12 w-8 h-8 bg-indigo-600 text-white rounded-full items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all z-[90]"
      >
        <i
          :class="[
            'pi text-[10px] transition-transform duration-500',
            isCollapsed ? 'pi-chevron-right' : 'pi-chevron-left',
          ]"
        ></i>
      </button>

      <div :class="['p-10 mb-6 transition-all duration-500', isCollapsed ? 'px-6' : 'p-10']">
        <h2
          v-if="!isCollapsed"
          class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic animate-fadeIn"
        >
          Hire<span class="text-indigo-600">Masr.</span>
        </h2>
        <div
          v-else
          class="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black italic text-xl shadow-lg shadow-indigo-600/20 mx-auto"
        >
          H
        </div>
      </div>

      <nav class="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="flex items-center gap-4 px-5 py-4 rounded-[1.2rem] font-black text-[11px] uppercase tracking-[0.15em] transition-all group no-underline relative"
          active-class="bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 active-link"
          :class="[
            $route.path !== link.path
              ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              : '',
            isCollapsed ? 'justify-center' : '',
          ]"
        >
          <i :class="[link.icon, 'text-lg transition-transform group-hover:scale-110']"></i>
          <span v-if="!isCollapsed" class="animate-fadeIn whitespace-nowrap">{{ link.name }}</span>

          <div
            v-if="isCollapsed"
            class="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[100] whitespace-nowrap"
          >
            {{ link.name }}
          </div>
        </router-link>
      </nav>

      <div
        :class="[
          'p-6 border-t border-slate-50 dark:border-slate-800 transition-all',
          isCollapsed ? 'items-center' : '',
        ]"
      >
        <button
          @click="handleLogout"
          :class="[
            'flex items-center gap-4 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all w-full',
            isCollapsed ? 'justify-center' : 'px-5',
          ]"
        >
          <i class="pi pi-power-off text-lg"></i>
          <span v-if="!isCollapsed" class="animate-fadeIn">Logout</span>
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-y-auto relative">
      <button
        @click="isMobileOpen = true"
        class="lg:hidden fixed bottom-8 right-8 z-[60] w-14 h-14 bg-indigo-600 shadow-2xl rounded-2xl flex items-center justify-center text-white active:scale-95 transition-all"
      >
        <i class="pi pi-bars text-xl"></i>
      </button>

      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const isCollapsed = ref(false)
const isMobileOpen = ref(false)

const navLinks = [
  { name: 'Dashboard', path: '/candidate/dashboard', icon: 'pi pi-th-large' },
  { name: 'My Applications', path: '/candidate/applications', icon: 'pi pi-send' },
  { name: 'Profile Settings', path: '/candidate/profile', icon: 'pi pi-user' },
  { name: 'Find Jobs', path: '/candidate/find-jobs', icon: 'pi pi-search' },
]

const handleLogout = () => {
  auth.logout()
  router.push({ name: 'home' })
}
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 0;
}
</style>
