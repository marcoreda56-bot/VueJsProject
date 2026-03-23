<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gray-50">
    <h1 class="text-9xl font-bold text-[#EA580C]">404</h1>
    <h2 class="text-2xl font-semibold mt-4 text-[#1A0A2E]">Page Not Found</h2>
    <p class="text-gray-500 mt-2 mb-8">Oops! The page you are looking for doesn't exist.</p>

    <router-link
      to="/"
      class="px-6 py-3 bg-[#EA580C] text-white rounded-lg font-bold hover:bg-[#c2490a] transition-colors"
    >
      Back to Home
    </router-link>
  </div>
</template>
