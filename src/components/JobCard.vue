<template>
  <div
    class="job-card p-4 border-round-xl shadow-1 hover:shadow-4 transition-all transition-duration-300"
  >
    <div class="flex justify-content-between mb-3">
      <div class="flex align-items-center gap-3">
        <Avatar
          :image="
            job.employer?.logo ||
            'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'
          "
          size="large"
          shape="circle"
          class="bg-white shadow-1 p-1"
        />
        <div>
          <h3 class="m-0 text-xl font-bold text-800">{{ job.title }}</h3>
          <span class="text-primary font-medium">{{ job.employer?.company_name }}</span>
        </div>
      </div>
      <Tag :value="job.type" :severity="getJobTypeSeverity(job.type)" />
    </div>

    <div class="flex flex-wrap gap-3 text-600 mb-4">
      <span class="flex align-items-center gap-1"
        ><i class="pi pi-map-marker"></i> {{ job.location }}</span
      >
      <span class="flex align-items-center gap-1"
        ><i class="pi pi-briefcase"></i> {{ job.experience_level }}</span
      >
      <span v-if="job.is_salary_visible" class="flex align-items-center gap-1 font-bold text-700">
        <i class="pi pi-money-bill"></i> {{ job.salary_min }} - {{ job.salary_max }}
        {{ job.currency }}
      </span>
    </div>

    <div class="flex justify-content-between align-items-center border-top-1 border-100 pt-3">
      <small class="text-500">Expires: {{ new Date(job.expires_at).toLocaleDateString() }}</small>
      <Button
        label="View & Apply"
        icon="pi pi-external-link"
        size="small"
        outlined
        @click="$router.push(`/jobs/${job.id}`)"
      />
    </div>
  </div>
</template>

<script setup>
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import Button from 'primevue/button'

defineProps(['job'])

const getJobTypeSeverity = (type) => {
  switch (type) {
    case 'full_time':
      return 'success'
    case 'remote':
      return 'info'
    case 'internship':
      return 'warning'
    default:
      return null
  }
}
</script>

<style scoped>
.job-card {
  background: white;
  border: 1px solid #eee;
}
</style>
