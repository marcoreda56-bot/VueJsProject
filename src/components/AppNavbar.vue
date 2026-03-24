<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const mobileMenu = ref(false)
const isDark = ref(false)
const searchQuery = ref('')

const isLoggedIn = computed(() => !!auth.token)
const currentUser = computed(() => auth.user)

const toggleMenu = () => {
  mobileMenu.value = !mobileMenu.value
}

const handleLogout = () => {
  auth.logout()
  mobileMenu.value = false
  router.push({ name: 'home' })
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const handleSearch = () => {
  const q = searchQuery.value.trim()
  router.push({ name: 'public.jobs', query: q ? { q } : {} })
  mobileMenu.value = false
}

onMounted(() => {
  isDark.value = localStorage.getItem('theme') === 'dark'
  document.documentElement.classList.toggle('dark', isDark.value)
})

watch(
  () => route.query.q,
  (q) => {
    searchQuery.value = typeof q === 'string' ? q : ''
  },
  { immediate: true },
)
</script>

<template>
  <nav
    class="fixed top-0 inset-x-0 z-50 px-0 sm:px-3 pt-0 sm:pt-2 font-['Plus_Jakarta_Sans',sans-serif]"
  >
    <div
      class="w-full backdrop-blur-md bg-white/85 dark:bg-slate-950/85 border-y sm:border sm:border-sky-100 dark:border-slate-800 sm:rounded-2xl px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-lg shadow-sky-100/40 dark:shadow-none"
    >
      <router-link to="/" class="flex items-center gap-2 no-underline group">
        <div
          class="bg-sky-600 rounded-xl p-2.5 group-hover:rotate-6 transition-transform shadow-lg shadow-sky-500/20"
        >
          <i class="pi pi-briefcase text-white text-base"></i>
        </div>
        <span class="text-2xl font-black tracking-tighter text-slate-900 dark:text-white italic"
          >Hire<span class="text-sky-600">Masr</span></span
        >
      </router-link>

      <div class="ml-auto flex items-center gap-2">
        <form
          @submit.prevent="handleSearch"
          class="hidden lg:flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900 px-4 py-2"
        >
          <i class="pi pi-search text-sm text-slate-400"></i>
          <input
            v-model.trim="searchQuery"
            type="text"
            placeholder="Search jobs..."
            class="w-44 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none"
          />
        </form>

        <div
          class="hidden md:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/60 p-1 rounded-full"
        >
          <router-link
            v-for="link in [
              { n: 'Home', p: '/' },
              { n: 'Jobs', p: '/jobs' },
              { n: 'About', p: '/about' },
            ]"
            :key="link.n"
            :to="link.p"
            class="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.14em] text-slate-500 hover:text-sky-700 dark:hover:text-sky-300 transition-all no-underline"
            active-class="!text-white bg-sky-600 shadow-lg shadow-sky-600/20"
          >
            {{ link.n }}
          </router-link>
        </div>

        <Button
          @click="toggleTheme"
          :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
          class="!w-10 !h-10 !rounded-full !border-none !text-slate-500"
          text
        />

        <div class="w-[1px] h-7 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>

        <template v-if="isLoggedIn">
          <div class="flex items-center gap-3">
            <Avatar
              :image="`https://ui-avatars.com/api/?name=${currentUser?.name}&background=0284c7&color=fff`"
              shape="circle"
              class="cursor-pointer ring-2 ring-transparent hover:ring-sky-500 transition-all !w-8 !h-8"
              @click="router.push(`/${currentUser?.role}/dashboard`)"
            />
            <Button
              @click="handleLogout"
              label="Logout"
              class="!bg-rose-50 dark:!bg-rose-500/10 !text-rose-600 !border-none !px-4 !py-2.5 !rounded-xl !text-xs !font-black !uppercase !tracking-[0.12em] hidden sm:block"
            />
          </div>
        </template>

        <template v-else>
          <div class="flex items-center gap-2">
            <router-link to="/auth/login"
              ><Button
                label="Login In"
                class="!text-slate-600 dark:!text-slate-300 !border-none !text-xs !font-black !uppercase"
                text
            /></router-link>
            <router-link to="/auth/register"
              ><Button
                label="Sign Up"
                class="!bg-sky-600 !text-white !border-none !px-5 !py-2.5 !rounded-xl !text-xs !font-black !uppercase shadow-lg shadow-sky-600/20 hover:!bg-sky-700"
            /></router-link>
          </div>
        </template>

        <Button
          icon="pi pi-bars"
          @click="toggleMenu"
          class="md:hidden !w-10 !h-10 !p-0 !text-slate-600 dark:!text-slate-300 !border-none"
          text
        />
      </div>
    </div>

    <div
      v-if="mobileMenu"
      class="md:hidden mt-3 mx-auto max-w-sm bg-white/95 dark:bg-slate-900/95 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-2xl p-4 flex flex-col gap-2"
    >
      <form @submit.prevent="handleSearch" class="px-3 pb-2">
        <div
          class="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
        >
          <i class="pi pi-search text-xs text-slate-400"></i>
          <input
            v-model.trim="searchQuery"
            type="text"
            placeholder="Search jobs..."
            class="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none"
          />
        </div>
      </form>

      <router-link
        v-for="link in [
          { n: 'Home', p: '/' },
          { n: 'Jobs', p: '/jobs' },
          { n: 'About', p: '/about' },
        ]"
        :key="link.n"
        :to="link.p"
        @click="toggleMenu"
        class="px-5 py-4 rounded-2xl text-slate-700 dark:text-slate-200 font-black text-[10px] uppercase tracking-widest no-underline"
      >
        {{ link.n }}
      </router-link>
      <button
        v-if="isLoggedIn"
        @click="handleLogout"
        class="w-full text-left px-5 py-4 text-rose-600 font-black text-[10px] uppercase tracking-widest"
      >
        Logout Session
      </button>
    </div>
  </nav>
</template>
