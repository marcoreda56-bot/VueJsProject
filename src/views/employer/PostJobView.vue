<template>
  <div class="max-w-4xl mx-auto space-y-10 animate-fadeIn">
    <div>
      <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
        Create <span class="text-indigo-600">Job.</span>
      </h2>
      <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">
        Post a new position to your company
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- General Info -->
      <div
        class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6 md:col-span-2"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest"
              >Job Title</label
            >
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all"
              placeholder="e.g. Senior Vue Developer"
            />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest"
              >Category</label
            >
            <select
              v-model="form.category_id"
              required
              class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold"
            >
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest"
            >Description</label
          >
          <textarea
            v-model="form.description"
            rows="5"
            required
            class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold"
          ></textarea>
        </div>
      </div>

      <!-- Skills Section -->
      <div
        class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6"
      >
        <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest"
          >Required Skills</label
        >
        <div class="flex gap-2">
          <select
            v-model="selectedSkillId"
            class="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold"
          >
            <option v-for="s in availableSkills" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
          <button
            type="button"
            @click="addSkill"
            class="bg-indigo-600 text-white px-4 rounded-xl font-black text-xs uppercase tracking-widest"
          >
            Add
          </button>
        </div>
        <div class="flex flex-wrap gap-2 mt-4">
          <span
            v-for="(s, i) in form.skills"
            :key="i"
            class="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-2 uppercase"
          >
            {{ getSkillName(s.skill_id) }}
            <i
              @click="form.skills.splice(i, 1)"
              class="pi pi-times cursor-pointer hover:text-rose-500"
            ></i>
          </span>
        </div>
      </div>

      <!-- Salary & Meta -->
      <div
        class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-6"
      >
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest"
              >Min Salary</label
            >
            <input
              v-model="form.salary_min"
              type="number"
              class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold"
            />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest"
              >Max Salary</label
            >
            <input
              v-model="form.salary_max"
              type="number"
              class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold"
            />
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest"
            >Workplace Type</label
          >
          <select
            v-model="form.workplace_type"
            class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold"
          >
            <option value="remote">Remote</option>
            <option value="on_site">On-Site</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        :disabled="employerStore.loading"
        class="md:col-span-2 w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all disabled:bg-slate-300"
      >
        {{ employerStore.loading ? 'Processing...' : 'Publish Job Listing' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useEmployerStore } from '@/stores/EmployerStore'
import { publicApi } from '@/api/services/api'
import { useRouter } from 'vue-router'

const employerStore = useEmployerStore()
const router = useRouter()
const categories = ref([])
const availableSkills = ref([])
const selectedSkillId = ref('')

const form = ref({
  title: '',
  category_id: '',
  description: '',
  requirements: 'Requirements here...',
  type: 'full_time',
  workplace_type: 'remote',
  experience_level: 'mid',
  salary_min: null,
  salary_max: null,
  location: 'Egypt',
  city: 'Cairo',
  vacancies: 1,
  skills: [],
})

onMounted(async () => {
  categories.value = await publicApi.getCategories()
  availableSkills.value = await publicApi.getSkills()
})

const addSkill = () => {
  if (
    selectedSkillId.value &&
    !form.value.skills.find((s) => s.skill_id === selectedSkillId.value)
  ) {
    form.value.skills.push({ skill_id: selectedSkillId.value, is_required: true })
  }
}

const getSkillName = (id) => availableSkills.value.find((s) => s.id === id)?.name

const handleSubmit = async () => {
  try {
    await employerStore.postJob(form.value)
    router.push('/employer/manage-jobs')
  } catch (err) {
    alert('Error: ' + JSON.stringify(err))
  }
}
</script>
