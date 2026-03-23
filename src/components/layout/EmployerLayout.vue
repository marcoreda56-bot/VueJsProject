<template>
  <div class="min-h-screen bg-[#FBFBFB] flex">
    <div class="w-64 bg-white border-r border-gray-100 p-6 hidden md:block">
      <div class="font-black text-xl mb-10">JOBS.APP</div>
      <nav class="space-y-4 font-bold text-gray-400">
        <p class="text-black">Menu</p>
      </nav>
    </div>
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>
