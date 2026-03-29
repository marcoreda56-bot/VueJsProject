<template>
  <div class="relative w-full font-['Outfit',sans-serif]">
    <label
      v-if="label"
      class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2"
    >
      {{ label }} <span v-if="required" class="text-rose-500">*</span>
    </label>

    <div
      @click="handleContainerClick"
      class="relative flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl transition-all min-h-[56px] cursor-text"
      :class="[
        { 'opacity-60 cursor-not-allowed': disabled },
        {
          'ring-2 ring-indigo-500 border-indigo-500 bg-white dark:bg-slate-900 shadow-lg shadow-indigo-500/5':
            isOpen,
        },
      ]"
    >
      <span
        v-for="skillId in modelValue"
        :key="skillId"
        class="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm animate-[fadeIn_0.2s_ease-out]"
      >
        {{ getSkillName(skillId) }}
        <button
          v-if="!disabled"
          type="button"
          @click.stop="removeSkill(skillId)"
          class="hover:text-indigo-200 transition-colors cursor-pointer"
        >
          <i class="pi pi-times text-[9px]"></i>
        </button>
      </span>

      <div class="flex-1 flex items-center min-w-[120px]">
        <input
          v-if="!disabled"
          ref="inputRef"
          v-model="searchQuery"
          type="text"
          :placeholder="modelValue.length === 0 ? placeholder : ''"
          @focus="isOpen = true"
          @keydown.delete="handleBackspace"
          @keydown.down.prevent="navigateResults(1)"
          @keydown.up.prevent="navigateResults(-1)"
          @keydown.enter.prevent="selectHighlighted"
          @keydown.esc="isOpen = false"
          class="w-full bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-300 cursor-text"
        />
      </div>

      <div class="flex items-center px-1 text-slate-400 cursor-pointer">
        <i
          :class="[
            'pi text-[10px] transition-transform duration-300',
            isOpen ? 'pi-chevron-up rotate-180' : 'pi-chevron-down',
          ]"
        ></i>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="absolute z-[100] w-full mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl max-h-64 overflow-y-auto overflow-x-hidden p-2"
      >
        <div v-if="filteredSkills.length > 0">
          <button
            v-for="(skill, index) in filteredSkills"
            :key="skill.id"
            type="button"
            @click.stop="addSkill(skill.id)"
            @mouseenter="highlightedIndex = index"
            :class="[
              'w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer',
              highlightedIndex === index
                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800',
            ]"
          >
            {{ skill.name }}
            <i
              v-if="modelValue.includes(skill.id)"
              class="pi pi-check text-[10px] text-indigo-600"
            ></i>
          </button>
        </div>
        <div v-else class="p-4 text-center">
          <p class="text-sm text-slate-400 italic">
            {{ skills.length === 0 ? 'Loading skills...' : 'No matching skills found.' }}
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  skills: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Search and add skills...',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const searchQuery = ref('')
const isOpen = ref(false)
const inputRef = ref(null)
const dropdownRef = ref(null)
const highlightedIndex = ref(0)

const handleClickOutside = (event) => {
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target) &&
    inputRef.value &&
    !inputRef.value.contains(event.target)
  ) {
    isOpen.value = false
  }
}

const handleContainerClick = () => {
  if (props.disabled) return
  isOpen.value = true
  inputRef.value?.focus()
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

const filteredSkills = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query && !isOpen.value) return []

  return props.skills.filter(
    (s) => s.name.toLowerCase().includes(query) && !props.modelValue.includes(s.id),
  )
})

watch(searchQuery, () => {
  highlightedIndex.value = 0
})

const getSkillName = (id) => {
  return props.skills.find((s) => String(s.id) === String(id))?.name || id
}

const addSkill = (id) => {
  const newValue = [...props.modelValue, id]
  emit('update:modelValue', newValue)
  searchQuery.value = ''
  highlightedIndex.value = 0
  inputRef.value?.focus()
}

const removeSkill = (id) => {
  const newValue = props.modelValue.filter((idx) => idx !== id)
  emit('update:modelValue', newValue)
}

const handleBackspace = () => {
  if (searchQuery.value === '' && props.modelValue.length > 0) {
    removeSkill(props.modelValue[props.modelValue.length - 1])
  }
}

const navigateResults = (direction) => {
  if (!isOpen.value) {
    isOpen.value = true
    return
  }
  const count = filteredSkills.value.length
  if (count === 0) return
  highlightedIndex.value = (highlightedIndex.value + direction + count) % count
}

const selectHighlighted = () => {
  if (filteredSkills.value[highlightedIndex.value]) {
    addSkill(filteredSkills.value[highlightedIndex.value].id)
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark ::-webkit-scrollbar-thumb {
  background: #1e293b;
}

/* Global Pointer for Buttons */
button {
  cursor: pointer;
}
</style>
