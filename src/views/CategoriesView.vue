<template>
  <div class="p-4 mx-auto min-h-screen" style="max-width: 1200px">
    <div class="text-center py-6 mb-8 section-fade-in">
      <h1 class="text-5xl font-800 mb-3 tracking-tighter">
        Explore <span class="text-primary">Categories</span>
      </h1>
      <p class="text-600 font-medium text-lg">Browse jobs by your technical expertise</p>
    </div>

    <div class="grid">
      <div v-if="loading" v-for="i in 8" :key="i" class="col-12 md:col-4 lg:col-3 p-3 text-center">
        <Skeleton height="180px" borderRadius="24px" />
      </div>

      <div v-else v-for="cat in categories" :key="cat.id" class="col-12 md:col-4 lg:col-3 p-3">
        <div
          @click="goToCategory(cat.id)"
          class="category-card p-5 border-round-3xl glass-card text-center transition-all cursor-pointer hover:shadow-8 h-full flex flex-column align-items-center justify-content-center"
        >
          <div class="icon-wrapper mb-4 shadow-3">
            <i :class="cat.icon || 'pi pi-tag'" class="text-4xl text-primary"></i>
          </div>
          <h3 class="m-0 text-xl font-800 tracking-tight">{{ cat.name }}</h3>
          <p class="text-500 font-bold mt-3 text-sm px-3 py-1 bg-primary-reverse border-round-pill">
            View Opportunities
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { categoriesApi } from '../api/api'
import Skeleton from 'primevue/skeleton'

const router = useRouter()
const categories = ref([])
const loading = ref(true)

const fetchAllCategories = async () => {
  try {
    const res = await categoriesApi.getAll()
    categories.value = res.data
  } catch (err) {
    console.error('Failed to load categories:', err)
  } finally {
    loading.value = false
  }
}

const goToCategory = (id) => {
  router.push(`/categories/${id}`)
}

onMounted(() => {
  fetchAllCategories()
})
</script>

<style scoped>
.icon-wrapper {
  width: 80px;
  height: 80px;
  background: var(--bg-color);
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-10px);
  border-color: var(--primary) !important;
}

.category-card:hover .icon-wrapper {
  background: var(--primary);
  transform: rotate(-5deg);
}

.category-card:hover .icon-wrapper i {
  color: white !important;
}

.section-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
