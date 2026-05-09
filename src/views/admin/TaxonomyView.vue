<template>
  <div class="space-y-12 font-['Outfit'] pb-20">
    <section class="space-y-8">
      <header class="flex justify-between items-end">
        <div>
          <h2 class="text-3xl font-black italic">
            Categories <span class="text-indigo-600">Control.</span>
          </h2>
          <p class="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">
            User Story 2: Core Taxonomy
          </p>
        </div>
        <button
          @click="openCategoryModal()"
          class="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all"
        >
          Create New Category
        </button>
      </header>

      <div
        v-if="adminStore.categories.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="cat in adminStore.categories"
          :key="cat.id"
          class="group p-6 bg-white border border-slate-100 rounded-[2.5rem] hover:shadow-2xl transition-all duration-500"
        >
          <div class="flex justify-between items-start mb-6">
            <div class="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <i :class="['pi', cat.icon || 'pi-tag', 'text-xl text-indigo-600']"></i>
            </div>
            <div class="flex gap-2">
              <button
                @click="openCategoryModal(cat)"
                class="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 transition-colors"
              >
                <i class="pi pi-pencil text-xs"></i>
              </button>
              <button
                @click="handleDeleteCategory(cat)"
                class="w-10 h-10 rounded-xl bg-red-50 text-red-400 hover:text-red-600 transition-colors"
              >
                <i class="pi pi-trash text-xs"></i>
              </button>
            </div>
          </div>
          <h3 class="text-xl font-black text-slate-900 tracking-tighter">{{ cat.name }}</h3>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            {{ cat.slug }}
          </p>
        </div>
      </div>
    </section>

    <section class="space-y-8">
      <header class="flex justify-between items-end">
        <div>
          <h2 class="text-3xl font-black italic">
            Skills <span class="text-indigo-600">Inventory.</span>
          </h2>
          <p class="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">
            Manage individual skill tags
          </p>
        </div>
        <button
          @click="openSkillModal()"
          class="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all"
        >
          Add New Skill
        </button>
      </header>

      <div class="bg-white rounded-[3rem] border border-slate-100 p-10">
        <div v-if="adminStore.skills.length > 0" class="flex flex-wrap gap-3">
          <div
            v-for="skill in adminStore.skills"
            :key="skill.id"
            class="px-6 py-3 bg-slate-50 rounded-2xl flex items-center gap-4 group hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100"
          >
            <div>
              <p class="font-bold text-sm text-slate-700">{{ skill.name }}</p>
              <p class="text-[9px] text-indigo-600 font-black uppercase tracking-tighter">
                {{
                  adminStore.categories.find((c) => c.id === skill.category_id)?.name || 'General'
                }}
              </p>
            </div>
            <button
              @click="handleDeleteSkill(skill)"
              class="text-red-300 hover:text-red-600 transition-colors"
            >
              <i class="pi pi-times-circle"></i>
            </button>
          </div>
        </div>
        <div v-else class="text-center py-10 text-slate-400 italic font-bold">
          No skills added yet.
        </div>
      </div>
    </section>

    <Transition name="modal">
      <div
        v-if="modals.category"
        class="fixed inset-0 z-[100] flex items-center justify-center p-6"
      >
        <div
          class="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          @click="modals.category = false"
        ></div>
        <div class="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10">
          <h3 class="text-2xl font-black italic mb-8">
            {{ isEditing ? 'Update' : 'Create' }} <span class="text-indigo-600">Category.</span>
          </h3>
          <div class="space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2"
                >Category Name</label
              >
              <input
                v-model="catForm.name"
                type="text"
                class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div class="space-y-4">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2"
                >Select Icon</label
              >
              <div class="grid grid-cols-5 gap-3">
                <button
                  v-for="icon in availableIcons"
                  :key="icon"
                  @click="catForm.icon = icon"
                  :class="
                    catForm.icon === icon
                      ? 'bg-indigo-600 text-white scale-110'
                      : 'bg-slate-50 text-slate-400'
                  "
                  class="h-12 rounded-xl flex items-center justify-center transition-all"
                >
                  <i :class="['pi', icon]"></i>
                </button>
              </div>
            </div>
            <button
              @click="handleCategorySubmit"
              :disabled="loading"
              class="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20"
            >
              {{ loading ? 'Processing...' : 'Save Category' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal">
      <div v-if="modals.skill" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div
          class="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          @click="modals.skill = false"
        ></div>
        <div class="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10">
          <h3 class="text-2xl font-black italic mb-8">
            Add New <span class="text-indigo-600">Skill.</span>
          </h3>
          <div class="space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2"
                >Skill Name</label
              >
              <input
                v-model="skillForm.name"
                type="text"
                placeholder="e.g. Laravel"
                class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2"
                >Parent Category</label
              >
              <select
                v-model="skillForm.category_id"
                class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600"
              >
                <option v-for="cat in adminStore.categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <button
              @click="handleSkillSubmit"
              :disabled="loading"
              class="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl"
            >
              {{ loading ? 'Saving...' : 'Add to Inventory' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAdminStore } from '@/stores/AdminStore'
import Swal from 'sweetalert2'

const adminStore = useAdminStore()
const loading = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const modals = reactive({ category: false, skill: false })
const availableIcons = [
  'pi-code',
  'pi-database',
  'pi-palette',
  'pi-chart-bar',
  'pi-shield',
  'pi-mobile',
  'pi-server',
  'pi-cog',
  'pi-globe',
  'pi-briefcase',
]

const catForm = reactive({ name: '', icon: 'pi-code' })
const skillForm = reactive({ name: '', category_id: '' })

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
})

onMounted(async () => {
  if (adminStore.fetchSkills) await adminStore.fetchSkills()
})

const openCategoryModal = (cat = null) => {
  if (cat) {
    isEditing.value = true
    editingId.value = cat.id
    catForm.name = cat.name
    catForm.icon = cat.icon || 'pi-code'
  } else {
    isEditing.value = false
    catForm.name = ''
    catForm.icon = 'pi-code'
  }
  modals.category = true
}

const handleCategorySubmit = async () => {
  if (!catForm.name) {
    Toast.fire({ icon: 'warning', title: 'Please enter a name' })
    return
  }
  loading.value = true
  try {
    if (isEditing.value) {
      await adminStore.updateCategory(editingId.value, { ...catForm })
      Toast.fire({ icon: 'success', title: 'Category updated!' })
    } else {
      await adminStore.addCategory({ ...catForm })
      Toast.fire({ icon: 'success', title: 'Category created!' })
    }
    modals.category = false
  } catch (e) {
    Swal.fire('Error', 'Could not save category', 'error')
  } finally {
    loading.value = false
  }
}

const handleDeleteCategory = async (cat) => {
  const result = await Swal.fire({
    title: `Delete ${cat.name}?`,
    text: 'This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Yes, delete it!',
  })

  if (result.isConfirmed) {
    try {
      await adminStore.deleteCategory(cat.id)
      Toast.fire({ icon: 'success', title: 'Deleted successfully' })
    } catch (e) {
      Swal.fire('Error', 'Could not delete category', 'error')
    }
  }
}

const openSkillModal = () => {
  skillForm.name = ''
  skillForm.category_id = adminStore.categories[0]?.id || ''
  modals.skill = true
}

const handleSkillSubmit = async () => {
  if (!skillForm.name || !skillForm.category_id) {
    Toast.fire({ icon: 'warning', title: 'Fill all fields' })
    return
  }
  loading.value = true
  try {
    await adminStore.addSkill({ ...skillForm })
    Toast.fire({ icon: 'success', title: 'Skill added to inventory' })
    modals.skill = false
  } catch (e) {
    Swal.fire('Error', 'Skill creation failed', 'error')
  } finally {
    loading.value = false
  }
}

const handleDeleteSkill = async (skill) => {
  const result = await Swal.fire({
    title: 'Remove Skill?',
    text: `Are you sure you want to remove ${skill.name}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#cbd5e1',
    confirmButtonText: 'Remove',
  })

  if (result.isConfirmed) {
    try {
      await adminStore.deleteSkill(skill.id)
      Toast.fire({ icon: 'success', title: 'Skill removed' })
    } catch (e) {
      Swal.fire('Error', 'Deletion failed', 'error')
    }
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

:deep(.swal2-popup) {
  border-radius: 2rem !important;
  font-family: 'Outfit', sans-serif !important;
}
</style>
