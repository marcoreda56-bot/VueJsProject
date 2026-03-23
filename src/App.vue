<template>
  <div class="app-container min-h-screen bg-gray-50">
    <AppNavbar />

    <main class="container mx-auto py-6">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="text-center py-6 text-500 border-top-1 border-100 mt-8">
      &copy; 2026 SouqMasr Jobs. Built with Vue 3 & PrimeVue.
    </footer>
  </div>
</template>

<script setup>
import AppNavbar from './components/AppNavbar.vue'
</script>

<style>
/* انيميشن بسيط للانتقال بين الصفحات */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

body {
  margin: 0;
  font-family: var(--font-family);
  background-color: #f8f9fa;
}
</style>
