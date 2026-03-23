<template>
  <div class="candidate-layout min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="font-bold text-[#EA580C]">Candidate Portal</h1>
        <button class="text-sm text-gray-600">Logout</button>
      </div>
    </header>

    <main class="container mx-auto py-8 px-4">
      <router-view />
    </main>
  </div>
</template>
