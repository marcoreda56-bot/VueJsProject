<template>
  <div class="p-4 mx-auto" style="max-width: 1200px">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2">Browse by Category</h1>
      <p class="text-600 text-xl">Find the right role based on your specialization</p>
    </div>

    <div v-if="jobStore.loading" class="grid">
      <div v-for="i in 8" :key="i" class="col-12 md:col-4 lg:col-3 p-3">
        <Skeleton height="120px" borderRadius="12px"></Skeleton>
      </div>
    </div>

    <div v-else class="grid">
      <div v-for="cat in jobStore.categories" :key="cat.id" class="col-12 md:col-4 lg:col-3 p-2">
        <div
          class="category-item p-4 border-round-xl shadow-1 text-center cursor-pointer hover:shadow-4 transition-all bg-white border-1 border-50"
          @click="goToCategory(cat.id)"
        >
          <i :class="cat.icon || 'pi pi-folder'" class="text-4xl text-primary mb-3"></i>
          <h3 class="m-0 font-bold text-900">{{ cat.name }}</h3>
          <Badge :value="jobStore.jobCountByCategory(cat.id)" severity="info" class="mt-2"></Badge>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useJobsStore } from '../stores/jobs.js'
import { useRouter } from 'vue-router'
import Skeleton from 'primevue/skeleton'
import Badge from 'primevue/badge'

const jobStore = useJobsStore()
const router = useRouter()

onMounted(() => {
  jobStore.initialize()
})

const goToCategory = (id) => {
  // هنوجه المستخدم لصفحة الوظائف مع عمل فلترة تلقائية للتصنيف ده
  router.push({ name: 'jobs', query: { categoryId: id } })
}
</script>

<style scoped>
.category-item:hover {
  transform: translateY(-5px);
  border-color: var(--primary-color);
}
</style>
