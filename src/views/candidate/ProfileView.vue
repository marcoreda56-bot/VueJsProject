<template>
  <div
    v-if="candidateStore.profile"
    class="max-w-6xl mx-auto space-y-8 pb-20 p-4 animate-in fade-in duration-700"
  >
    <!-- 1. Profile Header Section -->
    <section
      class="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden"
    >
      <div
        class="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16"
      ></div>

      <div class="flex flex-col md:flex-row gap-8 items-start relative z-10">
        <!-- Avatar with upload overlay -->
        <div class="relative group flex-shrink-0">
          <img
           :src="userAvatar"
            class="w-36 h-36 rounded-[32px] object-cover border-4 border-white dark:border-slate-800 shadow-2xl transition-transform group-hover:scale-105 duration-500"
          />
          <button
            @click="$refs.avatarInput.click()"
            class="absolute inset-0 bg-black/40 rounded-[32px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <i class="pi pi-camera text-white text-2xl"></i>
          </button>
          <input
            ref="avatarInput"
            type="file"
            class="hidden"
            accept="image/*"
            @change="handleAvatarUpload"
          />
          <div
            v-if="avatarUploading"
            class="absolute inset-0 bg-black/50 rounded-[32px] flex items-center justify-center"
          >
            <i class="pi pi-spin pi-spinner text-white text-xl"></i>
          </div>
          <button
            v-if="authStore.user?.avatar_url"
            @click="deleteAvatar"
            class="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 transition-colors z-20"
            title="Remove avatar"
          >
            <i class="pi pi-trash text-xs"></i>
          </button>
          <div
            v-if="candidateStore.profile?.is_open_to_work"
            class="absolute -bottom-2 -right-2 bg-green-500 px-3 py-1 border-4 border-white dark:border-slate-900 rounded-full text-[8px] font-black text-white uppercase tracking-tighter"
          >
            Open To Work
          </div>
        </div>

        <div class="flex-1 space-y-4">
          <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h2 class="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {{ fullName }}
              </h2>
              <div class="flex items-center gap-2 mt-1">
                <p class="text-indigo-600 font-bold text-lg italic">
                  {{ candidateStore.profile?.headline || 'Professional Headline' }}
                </p>
                <span
                  class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black rounded-full uppercase italic border border-slate-200 dark:border-slate-700"
                >
                  {{ candidateStore.profile?.education_level?.replace('_', ' ') || 'Degree' }}
                </span>
              </div>
            </div>
            <button
              @click="openProfileModal"
              class="group flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
            >
              <i class="pi pi-user-edit text-xs group-hover:rotate-12 transition-transform"></i>
              Complete Profile
            </button>
          </div>

          <p
            class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-3xl font-medium"
          >
            {{ candidateStore.profile?.bio || 'Introduce yourself to potential employers...' }}
          </p>

          <!-- Social Links & Metrics -->
          <div class="flex flex-wrap items-center gap-6 pt-4">
            <div class="flex gap-3 border-r border-slate-100 dark:border-slate-800 pr-6">
              <a
                v-if="candidateStore.profile?.linkedin_url"
                :href="candidateStore.profile.linkedin_url"
                target="_blank"
                class="social-btn hover:text-blue-600"
                ><i class="pi pi-linkedin"></i
              ></a>
              <a
                v-if="candidateStore.profile?.github_url"
                :href="candidateStore.profile.github_url"
                target="_blank"
                class="social-btn hover:text-slate-900 dark:hover:text-white"
                ><i class="pi pi-github"></i
              ></a>
              <a
                v-if="candidateStore.profile?.portfolio_url"
                :href="candidateStore.profile.portfolio_url"
                target="_blank"
                class="social-btn hover:text-indigo-600"
                ><i class="pi pi-globe"></i
              ></a>
            </div>

            <div class="flex flex-wrap gap-4">
              <div
                class="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest"
              >
                <i class="pi pi-map-marker text-indigo-500"></i>
                {{ candidateStore.profile?.location || 'Egypt' }}
              </div>
              <div
                class="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest"
              >
                <i class="pi pi-briefcase text-indigo-500"></i>
                {{ candidateStore.profile?.experience_years || 0 }} Yrs Exp
              </div>
              <div
                class="flex items-center gap-2 text-[11px] font-black text-indigo-500 uppercase tracking-widest"
              >
                <i class="pi pi-chart-bar"></i> Score:
                {{ candidateStore.profile?.profile_completion_score }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- 2. Left Sidebar: Skills, Education, Resumes -->
      <div class="lg:col-span-4 space-y-8">
        <!-- Job Preferences Card -->
        <section
          class="bg-white dark:bg-slate-900 rounded-[35px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative"
        >
          <div class="absolute top-0 right-0 p-4 opacity-10">
            <i class="pi pi-heart-fill text-6xl text-indigo-500"></i>
          </div>
          <h3
            class="font-black text-slate-900 dark:text-white mb-6 italic text-xs uppercase tracking-widest"
          >
            Preferences
          </h3>
          <div class="space-y-4 relative z-10">
            <div
              class="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800"
            >
              <span class="text-[10px] font-bold text-slate-400 uppercase">Preferred Type</span>
              <span class="text-[10px] font-black text-indigo-600 uppercase">{{
                candidateStore.profile?.preferred_job_type?.replace('_', ' ') || 'Any'
              }}</span>
            </div>
            <div
              class="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800"
            >
              <span class="text-[10px] font-bold text-slate-400 uppercase">Desired Salary</span>
              <span class="text-[10px] font-black text-slate-700 dark:text-white uppercase">
                {{ candidateStore.profile?.expected_salary_min?.toLocaleString() || '0' }} -
                {{ candidateStore.profile?.expected_salary_max?.toLocaleString() || 'N/A' }}
                {{ candidateStore.profile?.currency }}
              </span>
            </div>
          </div>
        </section>

        <!-- Skills Card -->
        <section
          class="bg-white dark:bg-slate-900 rounded-[35px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <div class="flex justify-between items-center mb-8">
            <h3
              class="font-black text-slate-900 dark:text-white italic text-xs uppercase tracking-widest"
            >
              Skills
            </h3>
            <button
              @click="openSkillModal"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"
            >
              <i class="pi pi-plus text-[10px]"></i>
            </button>
          </div>
          <div v-if="!candidateStore.profile?.skills?.length" class="text-center py-4">
            <p class="text-xs text-slate-400 font-bold">No skills added yet.</p>
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <div
              v-for="skill in candidateStore.profile.skills"
              :key="skill.skill_id"
              class="px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col gap-1"
            >
              <span
                class="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-tighter"
                >{{ skill.name }}</span
              >
              <span
                :class="getProficiencyClass(skill.proficiency_level)"
                class="text-[7px] font-bold uppercase px-1 rounded-sm w-fit"
                >{{ skill.proficiency_level }}</span
              >
            </div>
          </div>
        </section>

        <!-- Education Card -->
        <section
          class="bg-white dark:bg-slate-900 rounded-[35px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <div class="flex justify-between items-center mb-8">
            <h3
              class="font-black text-slate-900 dark:text-white italic text-xs uppercase tracking-widest"
            >
              Education
            </h3>
            <button
              @click="openEducationModal"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"
            >
              <i class="pi pi-plus text-[10px]"></i>
            </button>
          </div>
          <div v-if="!candidateStore.profile?.education?.length" class="text-center py-4">
            <p class="text-xs text-slate-400 font-bold">No education records yet.</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="edu in candidateStore.profile.education"
              :key="edu.id"
              class="group p-4 border border-slate-50 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {{ edu.degree }}
                  </h4>
                  <p class="text-[10px] font-bold text-indigo-600 mt-1">{{ edu.institution }}</p>
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    {{ edu.start_year }} — {{ edu.is_current ? 'Present' : edu.end_year }}
                  </p>
                  <p v-if="edu.field_of_study" class="text-[9px] text-slate-500 mt-1">
                    {{ edu.field_of_study }}
                  </p>
                </div>
                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="editEducation(edu)"
                    class="text-slate-400 hover:text-indigo-600"
                  >
                    <i class="pi pi-pencil text-xs"></i>
                  </button>
                  <button
                    @click="deleteEducationItem(edu.id)"
                    class="text-slate-400 hover:text-rose-500"
                  >
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Resumes Card -->
        <section
          class="bg-white dark:bg-slate-900 rounded-[35px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <h3
            class="font-black text-slate-900 dark:text-white mb-8 italic text-xs uppercase tracking-widest"
          >
            Resumes
          </h3>
          <div v-if="!resumes.length" class="text-center py-4">
            <p class="text-xs text-slate-400 font-bold mb-4">No resumes uploaded yet.</p>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="resume in resumes"
              :key="resume.id"
              class="group p-4 border border-slate-50 dark:border-slate-800 rounded-2xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all"
            >
              <button
                @click="viewResumeFile(resume.file?.id)"
                class="flex items-center gap-3 overflow-hidden min-w-0 text-left cursor-pointer"
              >
                <i class="pi pi-file-pdf text-rose-500 text-xl flex-shrink-0"></i>
                <div class="min-w-0">
                  <p
                    class="text-[10px] font-black text-slate-800 dark:text-white truncate uppercase"
                  >
                    {{ resume.title }}
                  </p>
                  <span
                    v-if="resume.is_default"
                    class="text-[8px] font-black text-indigo-600 uppercase"
                    >Default CV</span
                  >
                  <span v-else class="text-[8px] font-black text-slate-400 uppercase">CV</span>
                </div>
              </button>
              <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  v-if="!resume.is_default"
                  @click="setDefaultResume(resume.id)"
                  class="text-slate-400 hover:text-indigo-600"
                  title="Set as default"
                >
                  <i class="pi pi-check"></i>
                </button>
                <button @click="deleteResume(resume.id)" class="text-slate-400 hover:text-rose-500" title="Delete">
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </div>
          </div>
          <label
            class="w-full flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[24px] cursor-pointer hover:bg-slate-50 transition-all mt-4"
          >
            <i class="pi pi-cloud-upload text-slate-300 mb-2"></i>
            <span class="text-[9px] font-black text-slate-400 uppercase">Upload PDF</span>
            <input type="file" class="hidden" @change="handleResumeUpload" accept=".pdf" />
          </label>
        </section>
      </div>

      <!-- 3. Right Column: Experience Journey -->
      <div class="lg:col-span-8 space-y-8">
        <section
          class="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <div class="flex justify-between items-center mb-10">
            <h3
              class="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter"
            >
              Experience
            </h3>
            <button
              @click="openExperienceModal"
              class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest hover:shadow-lg transition-all"
            >
              <i class="pi pi-plus text-[10px]"></i> Add Record
            </button>
          </div>

          <div v-if="!candidateStore.profile?.experience?.length" class="text-center py-12">
            <p class="text-slate-400 font-bold text-sm">No work experience added yet.</p>
          </div>
          <div v-else class="space-y-12">
            <div
              v-for="exp in candidateStore.profile.experience"
              :key="exp.id"
              class="relative pl-12 group"
            >
              <div
                class="absolute left-0 top-0 w-0.5 h-full bg-slate-50 dark:bg-slate-800 group-last:h-0"
              ></div>
              <div
                class="absolute -left-1.5 top-0 w-3.5 h-3.5 bg-white dark:bg-slate-950 border-4 border-indigo-600 rounded-full z-10"
              ></div>

              <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h4
                    class="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight"
                  >
                    {{ exp.title }}
                  </h4>
                  <p class="text-sm font-bold text-indigo-600">
                    {{ exp.company_name }} <span class="text-slate-300 mx-2">|</span>
                    {{ exp.employment_type?.replace('_', ' ') }}
                  </p>
                  <p class="text-[10px] font-black text-slate-400 uppercase mt-2 tracking-widest">
                    {{ formatDate(exp.start_date) }} —
                    {{ exp.is_current ? 'Present' : formatDate(exp.end_date) }}
                  </p>
                </div>
                <div class="flex gap-3">
                  <button
                    @click="editExperience(exp)"
                    class="text-slate-300 hover:text-indigo-500 transition-colors"
                  >
                    <i class="pi pi-pencil text-sm"></i>
                  </button>
                  <button
                    @click="deleteExperience(exp.id)"
                    class="text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <i class="pi pi-trash text-sm"></i>
                  </button>
                </div>
              </div>
              <p
                v-if="exp.description"
                class="mt-6 text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[24px]"
              >
                {{ exp.description }}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- 4. Unified Modal System -->
    <div
      v-if="activeModal"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300"
    >
      <div
        class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col"
      >
        <div class="p-10 pb-0 flex justify-between items-center flex-shrink-0">
          <h3
            class="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white"
          >
            {{ modalTitle }}
          </h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-900 transition-colors">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="p-10 space-y-6 overflow-y-auto custom-scrollbar">
          <!-- Global Error State -->
          <div
            v-if="Object.keys(vErrors).length"
            class="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center gap-3"
          >
            <i class="pi pi-exclamation-circle text-rose-500"></i>
            <p class="text-[10px] font-black text-rose-500 uppercase tracking-widest">
              Validation failed. Check fields below.
            </p>
          </div>

          <!-- Profile & Socials Form -->
          <template v-if="activeModal === 'profile'">
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="input-label">Headline</label>
                  <input
                    v-model="form.headline"
                    :class="{ 'border-rose-400': vErrors.headline }"
                    class="form-input"
                    placeholder="e.g. Senior Software Engineer"
                  />
                  <span v-if="vErrors.headline" class="error-text">{{ vErrors.headline[0] }}</span>
                </div>
                <div class="space-y-1">
                  <label class="input-label">Education Level</label>
                  <select v-model="form.education_level" class="form-input">
                    <option value="high_school">High School</option>
                    <option value="bachelor">Bachelor's Degree</option>
                    <option value="master">Master's Degree</option>
                    <option value="phd">PHD</option>
                  </select>
                </div>
              </div>

              <div class="space-y-1">
                <label class="input-label">Professional Bio</label>
                <textarea
                  v-model="form.bio"
                  rows="4"
                  class="form-input resize-none"
                  placeholder="Briefly describe your career..."
                ></textarea>
              </div>

              <!-- Socials Section -->
              <div class="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[24px] space-y-4">
                <h4 class="text-[10px] font-black uppercase text-indigo-600 italic">
                  Professional Links
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="space-y-1">
                    <label class="input-label !text-blue-500">LinkedIn</label>
                    <input
                      v-model="form.linkedin_url"
                      class="form-input"
                      placeholder="https://..."
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="input-label !text-slate-600">GitHub</label>
                    <input v-model="form.github_url" class="form-input" placeholder="https://..." />
                  </div>
                  <div class="space-y-1">
                    <label class="input-label !text-purple-500">Portfolio</label>
                    <input
                      v-model="form.portfolio_url"
                      class="form-input"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              <!-- Preferences Section -->
              <div class="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-[24px] space-y-4">
                <h4 class="text-[10px] font-black uppercase text-indigo-600 italic">
                  Job Preferences
                </h4>
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="input-label">Preferred Job Type</label>
                    <select v-model="form.preferred_job_type" class="form-input">
                      <option value="full_time">Full Time</option>
                      <option value="part_time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="freelance">Freelance</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  <div class="space-y-1">
                    <label class="input-label">Availability</label>
                    <select v-model="form.is_open_to_work" class="form-input">
                      <option :value="true">Open to Work</option>
                      <option :value="false">Not Available</option>
                    </select>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="input-label">Min Salary ({{ form.currency }})</label>
                    <input
                      v-model.number="form.expected_salary_min"
                      type="number"
                      class="form-input"
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="input-label">Max Salary</label>
                    <input
                      v-model.number="form.expected_salary_max"
                      type="number"
                      class="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Skills Form -->
          <template v-if="activeModal === 'skills'">
            <div class="relative">
              <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
              <input
                @input="searchSkills"
                placeholder="Search and add skills..."
                class="form-input pl-12"
              />
              <div
                v-if="skillResults.length"
                class="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-2 border border-slate-100 dark:border-slate-700 max-h-60 overflow-y-auto"
              >
                <div
                  v-for="s in skillResults"
                  :key="s.id"
                  @click="selectSkill(s)"
                  class="p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl cursor-pointer text-xs font-black uppercase"
                >
                  {{ s.name }}
                </div>
              </div>
            </div>
            <div v-if="!selectedSkills.length" class="text-center py-8">
              <p class="text-xs text-slate-400 font-bold">Search and select skills above.</p>
            </div>
            <div v-else class="flex flex-col gap-3 mt-6">
              <div
                v-for="(s, i) in selectedSkills"
                :key="s.skill_id"
                class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl"
              >
                <span class="text-xs font-black text-slate-800 dark:text-white uppercase">{{
                  s.name
                }}</span>
                <div class="flex items-center gap-4">
                  <select
                    v-model="s.proficiency_level"
                    class="bg-white dark:bg-slate-700 text-[9px] font-black p-2 rounded-lg border-none uppercase"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                  <button @click="selectedSkills.splice(i, 1)" class="text-rose-500">
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- Experience Form -->
          <template v-if="activeModal === 'experience'">
            <div class="space-y-4">
              <input
                v-model="form.title"
                :class="{ 'border-rose-400': vErrors.title }"
                placeholder="Job Title (e.g. Backend Developer)"
                class="form-input"
              />
              <span v-if="vErrors.title" class="error-text">{{ vErrors.title[0] }}</span>

              <input
                v-model="form.company_name"
                :class="{ 'border-rose-400': vErrors.company_name }"
                placeholder="Company Name"
                class="form-input"
              />
              <span v-if="vErrors.company_name" class="error-text">{{ vErrors.company_name[0] }}</span>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <input
                    v-model="form.start_date"
                    type="date"
                    :class="{ 'border-rose-400': vErrors.start_date || dateError }"
                    class="form-input"
                  />
                  <span v-if="vErrors.start_date" class="error-text">{{ vErrors.start_date[0] }}</span>
                </div>
                <div>
                  <input
                    v-model="form.end_date"
                    type="date"
                    :disabled="form.is_current"
                    :class="{ 'border-rose-400': vErrors.end_date || dateError }"
                    class="form-input"
                  />
                  <span v-if="vErrors.end_date" class="error-text">{{ vErrors.end_date[0] }}</span>
                  <span v-else-if="dateError" class="error-text">{{ dateError }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2 px-2">
                <input type="checkbox" v-model="form.is_current" @change="dateError = ''" id="c" class="accent-indigo-600 w-4 h-4" />
                <label for="c" class="text-[10px] font-black uppercase text-slate-500"
                  >I currently work here</label
                >
              </div>
              <textarea
                v-model="form.description"
                rows="4"
                placeholder="Responsibilities and achievements..."
                class="form-input resize-none"
              ></textarea>
            </div>
          </template>

          <!-- Education Form -->
          <template v-if="activeModal === 'education'">
            <div class="space-y-4">
              <input
                v-model="form.degree"
                :class="{ 'border-rose-400': vErrors.degree }"
                placeholder="Degree (e.g. Bachelor of Science)"
                class="form-input"
              />
              <span v-if="vErrors.degree" class="error-text">{{ vErrors.degree[0] }}</span>

              <input
                v-model="form.institution"
                :class="{ 'border-rose-400': vErrors.institution }"
                placeholder="Institution Name"
                class="form-input"
              />
              <span v-if="vErrors.institution" class="error-text">{{ vErrors.institution[0] }}</span>

              <input
                v-model="form.field_of_study"
                placeholder="Field of Study"
                class="form-input"
              />
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <input
                    v-model.number="form.start_year"
                    type="number"
                    placeholder="Start Year"
                    :class="{ 'border-rose-400': vErrors.start_year || yearError }"
                    class="form-input"
                  />
                  <span v-if="vErrors.start_year" class="error-text">{{ vErrors.start_year[0] }}</span>
                </div>
                <div>
                  <input
                    v-model.number="form.end_year"
                    type="number"
                    placeholder="End Year"
                    :disabled="form.is_current"
                    :class="{ 'border-rose-400': vErrors.end_year || yearError }"
                    class="form-input"
                  />
                  <span v-if="vErrors.end_year" class="error-text">{{ vErrors.end_year[0] }}</span>
                  <span v-else-if="yearError" class="error-text">{{ yearError }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2 px-2">
                <input type="checkbox" v-model="form.is_current" @change="yearError = ''" id="eduCurrent" class="accent-indigo-600 w-4 h-4" />
                <label for="eduCurrent" class="text-[10px] font-black uppercase text-slate-500"
                  >Currently studying here</label
                >
              </div>
              <input
                v-model="form.grade"
                placeholder="Grade / GPA (optional)"
                class="form-input"
              />
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Description, achievements, activities..."
                class="form-input resize-none"
              ></textarea>
            </div>
          </template>
        </div>

        <div class="p-10 pt-0 flex gap-4 flex-shrink-0">
          <button
            @click="closeModal"
            class="flex-1 py-4 font-black text-slate-400 uppercase text-[11px] tracking-[0.2em] hover:text-slate-900 transition-colors"
          >
            Discard
          </button>
          <button
            @click="saveData"
            :disabled="isSaving"
            class="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 active:scale-95 uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-2 transition-all"
          >
            <i v-if="isSaving" class="pi pi-spin pi-spinner text-xs"></i>
            {{ isSaving ? 'Syncing...' : 'Save Profile' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex flex-col items-center justify-center h-[80vh] gap-4">
    <div
      class="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"
    ></div>
    <p class="font-black text-indigo-600 uppercase text-[10px] tracking-[0.5em] animate-pulse">
      Syncing HireMasr Data...
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { useCandidateStore } from '@/stores/CandidateStore'
import { useAuthStore } from '@/stores/AuthStore'
import api, { getFileUrl, downloadFileBlob } from '@/api/services/api'

const candidateStore = useCandidateStore()
const authStore = useAuthStore()

const activeModal = ref(null)
const modalTitle = ref('')
const isSaving = ref(false)
const avatarUploading = ref(false)
const vErrors = ref({})
const dateError = ref('')
const yearError = ref('')
const form = reactive({})
const resumes = ref([])
const skillResults = ref([])
const selectedSkills = ref([])
const editingEducationId = ref(null)

const fullName = computed(() => {
  const first = authStore.user?.first_name || ''
  const last = authStore.user?.last_name || ''
  return `${first} ${last}`.trim() || 'Candidate'
})

const userAvatar = computed(() => {
  return (
    authStore.user?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName.value)}&background=6366f1&color=fff&bold=true`
  )
})

onMounted(async () => {
  await candidateStore.fetchProfile()
  await fetchResumes()
})

const fetchResumes = async () => {
  try {
    const res = await api.get('/candidate/resumes')
    // Response interceptor unwraps: { success: true, data: [...] } -> [...]
    resumes.value = Array.isArray(res) ? res : res.data || []
  } catch (err) {
    console.error('Failed to fetch resumes', err)
    resumes.value = []
  }
}

const handleAvatarUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  avatarUploading.value = true
  const fd = new FormData()
  fd.append('avatar', file)

  try {
    const updatedUser = await api.patch('/auth/me', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    // Response interceptor unwraps to UserResource
    if (updatedUser && updatedUser.avatar_url) {
      authStore.user = { ...authStore.user, ...updatedUser }
      localStorage.setItem('user', JSON.stringify(authStore.user))
    }
  } catch (err) {
    console.error('Avatar upload failed', err.response?.data)
    alert(err.response?.data?.message || 'Failed to upload avatar')
  } finally {
    avatarUploading.value = false
    e.target.value = ''
  }
}

const deleteAvatar = async () => {
  if (!confirm('Remove your profile picture?')) return
  avatarUploading.value = true
  try {
    const updatedUser = await api.patch('/auth/me', { remove_avatar: true })
    if (updatedUser) {
      authStore.user = { ...authStore.user, ...updatedUser }
      localStorage.setItem('user', JSON.stringify(authStore.user))
    }
  } catch (err) {
    console.error('Avatar deletion failed', err.response?.data)
    alert(err.response?.data?.message || 'Failed to remove avatar')
  } finally {
    avatarUploading.value = false
  }
}

const openProfileModal = () => {
  modalTitle.value = 'Identity & Preferences'
  activeModal.value = 'profile'
  vErrors.value = {}
  Object.assign(form, {
    headline: candidateStore.profile.headline || '',
    bio: candidateStore.profile.bio || '',
    location: candidateStore.profile.location || '',
    city: candidateStore.profile.city || '',
    experience_years: candidateStore.profile.experience_years || '',
    education_level: candidateStore.profile.education_level || 'bachelor',
    linkedin_url: candidateStore.profile.linkedin_url || '',
    github_url: candidateStore.profile.github_url || '',
    portfolio_url: candidateStore.profile.portfolio_url || '',
    preferred_job_type: candidateStore.profile.preferred_job_type || 'full_time',
    is_open_to_work: candidateStore.profile.is_open_to_work ?? true,
    expected_salary_min: candidateStore.profile.expected_salary_min || '',
    expected_salary_max: candidateStore.profile.expected_salary_max || '',
    currency: candidateStore.profile.currency || 'EGP',
  })
}

const openSkillModal = () => {
  modalTitle.value = 'Skills Sync'
  activeModal.value = 'skills'
  skillResults.value = []
  selectedSkills.value = (candidateStore.profile?.skills || []).map((s) => ({
    skill_id: s.skill_id,
    name: s.name,
    proficiency_level: s.proficiency_level || 'intermediate',
    years_experience: s.years_experience || 1,
  }))
}

const openExperienceModal = () => {
  modalTitle.value = 'Add Career Step'
  activeModal.value = 'experience'
  vErrors.value = {}
  dateError.value = ''
  Object.assign(form, {
    id: null,
    title: '',
    company_name: '',
    employment_type: 'full_time',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
  })
}

const openEducationModal = () => {
  modalTitle.value = 'Add Education'
  activeModal.value = 'education'
  editingEducationId.value = null
  vErrors.value = {}
  yearError.value = ''
  Object.assign(form, {
    degree: '',
    institution: '',
    field_of_study: '',
    start_year: '',
    end_year: '',
    is_current: false,
    grade: '',
    description: '',
  })
}

const editEducation = (edu) => {
  modalTitle.value = 'Edit Education'
  activeModal.value = 'education'
  editingEducationId.value = edu.id
  vErrors.value = {}
  yearError.value = ''
  Object.assign(form, {
    degree: edu.degree,
    institution: edu.institution,
    field_of_study: edu.field_of_study || '',
    start_year: edu.start_year,
    end_year: edu.end_year || '',
    is_current: edu.is_current,
    grade: edu.grade || '',
    description: edu.description || '',
  })
}

const deleteEducationItem = async (id) => {
  if (confirm('Delete this education record?')) {
    await candidateStore.deleteEducation(id)
  }
}

const closeModal = () => {
  activeModal.value = null
  vErrors.value = {}
  skillResults.value = []
}

const searchSkills = async (e) => {
  const q = e.target.value
  if (q.length < 2) {
    skillResults.value = []
    return
  }
  try {
    const res = await api.get(`/skills/autocomplete?q=${encodeURIComponent(q)}`)
    // Interceptor unwraps: { success: true, data: [...] } -> [...]
    skillResults.value = Array.isArray(res) ? res : res.data || []
  } catch (err) {
    console.error('Skill search failed', err)
    skillResults.value = []
  }
}

const selectSkill = (skill) => {
  if (!selectedSkills.value.find((s) => s.skill_id === skill.id)) {
    selectedSkills.value.push({
      skill_id: skill.id,
      name: skill.name,
      proficiency_level: 'intermediate',
      years_experience: 1,
    })
  }
  skillResults.value = []
}

const saveData = async () => {
  vErrors.value = {}
  dateError.value = ''
  yearError.value = ''
  isSaving.value = true
  try {
    if (activeModal.value === 'profile') {
      await candidateStore.updateProfile(form)
    } else if (activeModal.value === 'skills') {
      await api.post('/candidate/skills', {
        skills: selectedSkills.value.map((s) => ({
          skill_id: s.skill_id,
          proficiency_level: s.proficiency_level,
          years_experience: s.years_experience || 1,
        })),
      })
    } else if (activeModal.value === 'experience') {
      const data = { ...form }
      if (!data.is_current && data.start_date && data.end_date && new Date(data.start_date) > new Date(data.end_date)) {
        dateError.value = 'Start date cannot be after end date'
        isSaving.value = false
        return
      }
      if (data.is_current) delete data.end_date
      delete data.id
      if (form.id) {
        await api.put(`/candidate/experience/${form.id}`, data)
      } else {
        await api.post('/candidate/experience', data)
      }
    } else if (activeModal.value === 'education') {
      const data = { ...form }
      if (!data.is_current && data.start_year && data.end_year && Number(data.start_year) > Number(data.end_year)) {
        yearError.value = 'Start year cannot be after end year'
        isSaving.value = false
        return
      }
      if (data.is_current) delete data.end_year
      if (editingEducationId.value) {
        await api.put(`/candidate/education/${editingEducationId.value}`, data)
      } else {
        await api.post('/candidate/education', data)
      }
    }
    await candidateStore.fetchProfile()
    if (activeModal.value !== 'skills') {
      closeModal()
    } else {
      // For skills modal, keep it open but refresh selected skills from profile
      selectedSkills.value = (candidateStore.profile?.skills || []).map((s) => ({
        skill_id: s.skill_id,
        name: s.name,
        proficiency_level: s.proficiency_level || 'intermediate',
        years_experience: s.years_experience || 1,
      }))
      skillResults.value = []
    }
  } catch (e) {
    if (e.response?.status === 422) vErrors.value = e.response.data.errors
    console.error('Save failed', e)
  } finally {
    isSaving.value = false
  }
}

const handleResumeUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const fd = new FormData()
  fd.append('file', file)
  fd.append('title', file.name.replace(/\.[^/.]+$/, '').toUpperCase())
  fd.append('is_default', resumes.value.length === 0 ? '1' : '0')

  try {
    isSaving.value = true
    await api.post('/candidate/resumes', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    await fetchResumes()
    await candidateStore.fetchProfile()
  } catch (err) {
    console.error('Upload failed', err.response?.data)
    if (err.response?.status === 422) {
      vErrors.value = err.response.data.errors
    }
    alert(err.response?.data?.message || 'Failed to upload resume')
  } finally {
    isSaving.value = false
    e.target.value = ''
  }
}

const viewResumeFile = async (fileId) => {
  if (!fileId) return
  try {
    const blobUrl = await downloadFileBlob(fileId)
    window.open(blobUrl, '_blank')
  } catch (err) {
    console.error('Failed to open resume', err)
    alert('Failed to open resume. Please try again.')
  }
}

const setDefaultResume = async (id) => {
  try {
    await api.patch(`/candidate/resumes/${id}/default`)
    await fetchResumes()
  } catch (err) {
    console.error('Failed to set default', err)
    alert('Failed to set default resume')
  }
}

const deleteResume = async (id) => {
  if (confirm('Delete this resume? This cannot be undone.')) {
    try {
      await api.delete(`/candidate/resumes/${id}`)
      await fetchResumes()
      await candidateStore.fetchProfile()
    } catch (err) {
      console.error('Delete failed', err)
      alert('Failed to delete resume')
    }
  }
}

const editExperience = (exp) => {
  modalTitle.value = 'Edit Experience'
  activeModal.value = 'experience'
  vErrors.value = {}
  dateError.value = ''
  Object.assign(form, {
    id: exp.id,
    title: exp.title,
    company_name: exp.company_name,
    employment_type: exp.employment_type || 'full_time',
    start_date: exp.start_date,
    end_date: exp.end_date || '',
    is_current: exp.is_current,
    description: exp.description || '',
  })
}

const deleteExperience = async (id) => {
  if (confirm('Delete this experience record?')) {
    try {
      await api.delete(`/candidate/experience/${id}`)
      await candidateStore.fetchProfile()
    } catch (err) {
      console.error('Delete failed', err)
      alert('Failed to delete experience')
    }
  }
}

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '...'

const getProficiencyClass = (lvl) => {
  const m = {
    beginner: 'bg-slate-100 text-slate-500',
    intermediate: 'bg-indigo-50 text-indigo-600',
    advanced: 'bg-purple-50 text-purple-600',
    expert: 'bg-amber-50 text-amber-600',
  }
  return m[lvl] || m.intermediate
}
</script>

<style scoped>
@reference "../../assets/main.css";

.form-input {
  @apply w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all font-bold text-xs outline-none dark:bg-slate-800 dark:text-white;
}

.input-label {
  @apply text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block;
}

.error-text {
  @apply text-[9px] text-rose-500 font-bold ml-2;
}

.social-btn {
  @apply w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 transition-all hover:scale-110 shadow-sm;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-slate-50 dark:bg-slate-800;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-slate-200 dark:bg-slate-700 rounded-full;
}
</style>
