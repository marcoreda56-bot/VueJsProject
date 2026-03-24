<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isLogin = computed(() => route.name === 'login')
</script>

<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 sm:p-6">
    <div
      class="mx-auto min-h-[calc(100vh-2rem)] max-w-7xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
    >
      <aside class="hidden lg:flex relative p-12 bg-gradient-to-br from-sky-700 via-sky-700 to-cyan-700 text-white">
        <div class="absolute -top-12 -left-8 w-56 h-56 rounded-full bg-white/15 blur-3xl"></div>
        <div class="absolute -bottom-16 -right-10 w-72 h-72 rounded-full bg-cyan-200/20 blur-3xl"></div>
        <div class="relative z-10 flex flex-col justify-between h-full">
          <div>
            <p class="uppercase tracking-[0.2em] text-xs text-sky-100 font-bold">HireMasr Platform</p>
            <h1 class="mt-5 text-5xl font-black leading-tight">Welcome back to modern hiring.</h1>
            <p class="mt-6 max-w-md text-sky-100">
              Candidate or employer, your account gives you one clean workflow from discovery to action.
            </p>
          </div>
          <div class="rounded-2xl bg-white/10 border border-white/20 p-5 backdrop-blur-sm">
            <p class="text-sm text-sky-100">Fast sign-in. Clear profiles. Better job matching.</p>
          </div>
        </div>
      </aside>

      <section class="flex items-center justify-center p-6 sm:p-10 bg-slate-50 dark:bg-slate-950">
        <div class="w-full max-w-[480px]">
          <div class="mb-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 grid grid-cols-2 gap-1">
            <router-link
              :to="{ name: 'login' }"
              class="text-center py-2.5 rounded-lg text-xs font-black uppercase tracking-[0.16em] no-underline"
              :class="
                isLogin
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300'
              "
            >
              Sign In
            </router-link>
            <router-link
              :to="{ name: 'register', query: route.query }"
              class="text-center py-2.5 rounded-lg text-xs font-black uppercase tracking-[0.16em] no-underline"
              :class="
                !isLogin
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300'
              "
            >
              Create Account
            </router-link>
          </div>

          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
