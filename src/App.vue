<template>
  <div class="app-container min-h-screen bg-gray-50">
    <AppNavbar v-if="!$route.meta.hideNavbar" />

    <main class="container mx-auto pt-12 pb-8 px-4 md:px-6">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="text-center py-6 text-gray-500 border-t border-gray-200 mt-8">
      &copy; 2026 HireMasr Jobs. Built with Vue 3.
    </footer>
  </div>
</template>

<script setup>
import AppNavbar from './components/AppNavbar.vue'
</script>
