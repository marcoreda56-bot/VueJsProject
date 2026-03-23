<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div
      class="bg-white p-12 rounded-[2.5rem] shadow-xl text-center border border-gray-100 max-w-md w-full"
    >
      <div class="text-4xl mb-4">📝</div>
      <h2 class="text-2xl font-black text-gray-900 mb-2">Apply for Job</h2>
      <p class="text-gray-500 mb-6 font-medium">
        You are applying for job ID: {{ $route.params.id }}
      </p>
      <button @click="$router.back()" class="w-full py-4 bg-black text-white rounded-2xl font-bold">
        Go Back
      </button>
    </div>
  </div>
</template>
