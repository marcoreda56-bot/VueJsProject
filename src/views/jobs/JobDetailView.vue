<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <!-- Hero with Employer Cover -->
    <div class="relative h-48 md:h-72 overflow-hidden">
      <img
        v-if="job?.employer?.cover_image_url"
        :src="job.employer.cover_image_url"
        class="w-full h-full object-cover"
        alt="Company cover"
      />
      <div
        v-else
        class="w-full h-full bg-gradient-to-br from-indigo-900 via-slate-800 to-emerald-900"
      ></div>
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>

      <!-- Back Button (mobile) -->
      <button
        @click="$router.back()"
        class="absolute top-4 left-4 md:hidden z-10 w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all"
      >
        <i class="pi pi-arrow-left text-sm"></i>
      </button>
    </div>

    <div class="max-w-6xl mx-auto px-4 -mt-16 md:-mt-20 relative z-10 pb-20">
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>

      <div v-else-if="job" class="space-y-8">
        <!-- Header Card -->
        <div class="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div class="p-6 md:p-10">
            <div class="flex flex-col md:flex-row gap-6 md:items-start">
              <!-- Employer Logo -->
              <div class="flex-shrink-0 -mt-2 md:mt-0">
                <div class="w-20 h-20 md:w-24 md:h-24 bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-xl border-4 border-white dark:border-slate-900 flex items-center justify-center overflow-hidden">
                  <img
                    :src="job.employer?.logo_url || '/default-logo.png'"
                    class="w-full h-full object-contain p-2"
                    alt="Company logo"
                  />
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <!-- Title Row -->
                <div class="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div class="min-w-0">
                    <h1 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight mb-2">
                      {{ job.title }}
                    </h1>
                    <div class="flex flex-wrap items-center gap-2 text-sm">
                      <router-link
                        v-if="job.employer?.slug"
                        :to="`/employers/${job.employer.slug}`"
                        class="font-bold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        {{ job.employer?.company_name }}
                        <span v-if="job.employer?.is_verified" class="text-emerald-500">
                          <i class="pi pi-verified text-xs"></i>
                        </span>
                      </router-link>
                      <span v-else class="font-bold text-slate-700 dark:text-slate-300">
                        {{ job.employer?.company_name }}
                      </span>
                      <span class="text-slate-300">•</span>
                      <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <i class="pi pi-map-marker text-xs"></i>
                        {{ job.city || job.location || 'Remote' }}
                      </span>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex items-center gap-3 flex-shrink-0">
                    <button
                      v-if="authStore.isAuthenticated && authStore.userRole === 'candidate'"
                      @click="toggleSave"
                      class="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                      :class="isSaved ? 'bg-rose-50 text-rose-500 dark:bg-rose-900/20 border-rose-200' : 'bg-white dark:bg-slate-800 text-slate-400'"
                      :title="isSaved ? 'Remove from saved' : 'Save job'"
                    >
                      <i :class="isSaved ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'"></i>
                    </button>
                  </div>
                </div>

                <!-- Badges Row -->
                <div class="flex flex-wrap gap-2 mb-5">
                  <span :class="jobTypeClass(job.type)" class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border">
                    <i class="pi pi-clock mr-1"></i>{{ job.type?.replace('_', ' ') }}
                  </span>
                  <span :class="workplaceClass(job.workplace_type)" class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border">
                    <i class="pi pi-globe mr-1"></i>{{ job.workplace_type?.replace('_', ' ') }}
                  </span>
                  <span :class="experienceClass(job.experience_level)" class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border">
                    {{ job.experience_level }}
                  </span>
                  <span v-if="job.vacancies > 1" class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {{ job.vacancies }} openings
                  </span>
                </div>

                <!-- Meta Row -->
                <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span class="flex items-center gap-1.5">
                    <i class="pi pi-calendar text-slate-300"></i>
                    Posted {{ timeAgo(job.created_at) }}
                  </span>
                  <span class="flex items-center gap-1.5">
                    <i class="pi pi-eye text-slate-300"></i>
                    {{ (job.views_count || 0).toLocaleString() }} views
                  </span>
                  <span class="flex items-center gap-1.5">
                    <i class="pi pi-users text-slate-300"></i>
                    {{ job.applications_count || 0 }} applicant{{ job.applications_count === 1 ? '' : 's' }}
                  </span>
                  <span v-if="job.expires_at" class="flex items-center gap-1.5">
                    <i class="pi pi-hourglass text-slate-300"></i>
                    Closes {{ formatDate(job.expires_at) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Apply CTA Bar -->
            <div class="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p class="text-sm font-black text-slate-900 dark:text-white">
                  {{ formatSalary(job) }}
                </p>
                <p v-if="!job.is_salary_visible" class="text-[10px] text-slate-400 font-medium mt-0.5">Salary not disclosed publicly</p>
              </div>

              <!-- Apply States -->
              <div class="flex items-center gap-3 w-full sm:w-auto">
                <!-- Already Applied -->
                <template v-if="applyState === 'applied'">
                  <div class="flex items-center gap-3 px-6 py-3.5 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-2xl">
                    <i class="pi pi-check-circle text-emerald-600 text-lg"></i>
                    <div>
                      <p class="text-sm font-black text-emerald-700 dark:text-emerald-400">Already Applied</p>
                      <p class="text-[10px] text-emerald-600 dark:text-emerald-500 font-medium">Your application has been submitted</p>
                    </div>
                  </div>
                  <router-link
                    v-if="applicationId"
                    :to="`/candidate/applications/${applicationId}`"
                    class="px-5 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all"
                  >
                    Track
                  </router-link>
                </template>

                <!-- Apply Button -->
                <button
                  v-else-if="applyState === 'apply'"
                  @click="handleApplyClick"
                  class="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                >
                  Apply Now
                </button>

                <!-- Guest Login -->
                <router-link
                  v-else-if="applyState === 'guest'"
                  :to="`/login?redirect=${$route.fullPath}`"
                  class="w-full sm:w-auto px-10 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-700 transition-all active:scale-95 text-center"
                >
                  Log in to Apply
                </router-link>

                <!-- Inactive -->
                <span
                  v-else-if="applyState === 'inactive'"
                  class="px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest"
                >
                  No longer accepting applications
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          <!-- Main Content -->
          <div class="space-y-8">
            <!-- Description -->
            <section class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
              <h2 class="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <span class="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600">
                  <i class="pi pi-file-edit text-sm"></i>
                </span>
                About the Role
              </h2>
              <div class="prose prose-slate max-w-none text-slate-600 dark:text-slate-300 leading-relaxed" v-html="job.description"></div>
            </section>

            <!-- Requirements -->
            <section v-if="job.requirements" class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
              <h2 class="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <span class="w-8 h-8 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-600">
                  <i class="pi pi-list-check text-sm"></i>
                </span>
                Requirements
              </h2>
              <div class="prose prose-slate max-w-none text-slate-600 dark:text-slate-300 leading-relaxed" v-html="job.requirements"></div>
            </section>

            <!-- Responsibilities -->
            <section v-if="job.responsibilities" class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
              <h2 class="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <span class="w-8 h-8 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-600">
                  <i class="pi pi-briefcase text-sm"></i>
                </span>
                Responsibilities
              </h2>
              <div class="prose prose-slate max-w-none text-slate-600 dark:text-slate-300 leading-relaxed" v-html="job.responsibilities"></div>
            </section>

            <!-- Benefits -->
            <section v-if="job.benefits" class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
              <h2 class="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <span class="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600">
                  <i class="pi pi-gift text-sm"></i>
                </span>
                Benefits
              </h2>
              <div class="prose prose-slate max-w-none text-slate-600 dark:text-slate-300 leading-relaxed" v-html="job.benefits"></div>
            </section>

            <!-- Skills -->
            <section v-if="job.skills?.length" class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
              <h2 class="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <span class="w-8 h-8 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600">
                  <i class="pi pi-star text-sm"></i>
                </span>
                Required Skills
              </h2>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in job.skills"
                  :key="skill.id || skill.skill_id"
                  class="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm border border-slate-100 dark:border-slate-700 flex items-center gap-2"
                >
                  {{ skill.skill?.name || skill.name }}
                  <span v-if="skill.is_required" class="text-[10px] font-black text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-1.5 py-0.5 rounded-md">Required</span>
                </span>
              </div>
            </section>

            <!-- How to Apply -->
            <section class="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-[2rem] p-8 md:p-10 border border-indigo-100 dark:border-indigo-900/20">
              <h2 class="text-xl font-black text-slate-900 dark:text-white mb-6">How to Apply</h2>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="flex flex-col items-center text-center p-4">
                  <div class="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 mb-3">
                    <i class="pi pi-user-edit text-lg"></i>
                  </div>
                  <p class="text-sm font-bold text-slate-900 dark:text-white mb-1">1. Prepare</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">Update your profile and upload your resume</p>
                </div>
                <div class="flex flex-col items-center text-center p-4">
                  <div class="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 mb-3">
                    <i class="pi pi-send text-lg"></i>
                  </div>
                  <p class="text-sm font-bold text-slate-900 dark:text-white mb-1">2. Apply</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">Submit your application with a cover letter</p>
                </div>
                <div class="flex flex-col items-center text-center p-4">
                  <div class="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 mb-3">
                    <i class="pi pi-bell text-lg"></i>
                  </div>
                  <p class="text-sm font-bold text-slate-900 dark:text-white mb-1">3. Get Updates</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">Track your application status in real-time</p>
                </div>
              </div>
            </section>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Job Summary -->
            <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">Job Summary</h3>
              <div class="space-y-5">
                <SummaryRow icon="pi pi-money-bill" color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-900/10" label="Salary" :value="formatSalary(job)" />
                <SummaryRow icon="pi pi-briefcase" color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/10" label="Job Type" :value="job.type?.replace('_', ' ')" />
                <SummaryRow icon="pi pi-globe" color="text-sky-600" bg="bg-sky-50 dark:bg-sky-900/10" label="Workplace" :value="job.workplace_type?.replace('_', ' ')" />
                <SummaryRow icon="pi pi-chart-line" color="text-amber-600" bg="bg-amber-50 dark:bg-amber-900/10" label="Experience" :value="job.experience_level" />
                <SummaryRow icon="pi pi-graduation-cap" color="text-purple-600" bg="bg-purple-50 dark:bg-purple-900/10" label="Education" :value="job.education_level?.replace('_', ' ') || 'Any'" />
                <SummaryRow icon="pi pi-users" color="text-indigo-600" bg="bg-indigo-50 dark:bg-indigo-900/10" label="Vacancies" :value="String(job.vacancies || 1)" />
                <SummaryRow icon="pi pi-calendar" color="text-rose-600" bg="bg-rose-50 dark:bg-rose-900/10" label="Posted" :value="formatDate(job.created_at)" />
              </div>
            </div>

            <!-- Employer Card -->
            <div v-if="job.employer" class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">About the Company</h3>
              <div class="flex items-center gap-4 mb-5">
                <div class="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700">
                  <img :src="job.employer.logo_url || '/default-logo.png'" class="w-full h-full object-contain p-1.5" />
                </div>
                <div>
                  <p class="font-bold text-slate-900 dark:text-white text-sm">{{ job.employer.company_name }}</p>
                  <p v-if="job.employer.industry" class="text-xs text-slate-500 dark:text-slate-400">{{ job.employer.industry }}</p>
                </div>
              </div>
              <div class="space-y-3 mb-6">
                <p v-if="job.employer.company_size" class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <i class="pi pi-users text-slate-300"></i> {{ job.employer.company_size }} employees
                </p>
                <p v-if="job.employer.headquarters" class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <i class="pi pi-map-marker text-slate-300"></i> {{ job.employer.headquarters }}
                </p>
                <p v-if="job.employer.founded_year" class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <i class="pi pi-calendar text-slate-300"></i> Founded {{ job.employer.founded_year }}
                </p>
              </div>
              <div class="flex items-center gap-3">
                <router-link
                  v-if="job.employer.slug"
                  :to="`/employers/${job.employer.slug}`"
                  class="flex-1 text-center py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-all"
                >
                  View Profile
                </router-link>
                <a
                  v-if="job.employer.website"
                  :href="job.employer.website"
                  target="_blank"
                  class="flex-1 text-center py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100 dark:border-slate-700"
                >
                  <i class="pi pi-globe mr-1"></i> Website
                </a>
              </div>
            </div>

            <!-- Rating -->
            <div v-if="job.employer?.average_rating > 0" class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-black text-slate-900 dark:text-white mb-1">Employee Rating</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">Based on {{ job.employer.total_reviews || 0 }} reviews</p>
                </div>
                <div class="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/10 px-4 py-2 rounded-xl border border-amber-100 dark:border-amber-900/20">
                  <i class="pi pi-star-fill text-amber-500"></i>
                  <span class="text-xl font-black text-amber-700 dark:text-amber-400">{{ job.employer.average_rating }}</span>
                </div>
              </div>
            </div>

            <!-- Share -->
            <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Share this Job</h3>
              <div class="flex gap-3">
                <button @click="copyLink" class="flex-1 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                  <i class="pi pi-link"></i> {{ linkCopied ? 'Copied!' : 'Copy Link' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Floating Apply Bar -->
    <div
      v-if="job && !showApplyModal && applyState === 'apply'"
      class="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-4 z-40"
    >
      <button
        @click="handleApplyClick"
        class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
      >
        Apply Now
      </button>
    </div>

    <!-- Apply Modal -->
    <div
      v-if="showApplyModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      @click.self="showApplyModal = false"
    >
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600">
            <i class="pi pi-send text-lg"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 dark:text-white">Submit Application</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">for {{ job.title }}</p>
          </div>
        </div>

        <!-- No Resume State -->
        <div v-if="resumes.length === 0" class="text-center py-8">
          <div class="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-file text-amber-500 text-2xl"></i>
          </div>
          <h3 class="text-lg font-black text-slate-900 dark:text-white mb-2">No Resume Found</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
            Upload at least one resume to your profile before applying.
          </p>
          <router-link
            to="/candidate/profile"
            class="inline-block px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all"
            @click="showApplyModal = false"
          >
            Go to Profile
          </router-link>
        </div>

        <!-- Apply Form -->
        <div v-else class="space-y-6">
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Select Resume</label>
            <select
              v-model="selectedResume"
              class="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white text-sm font-bold"
            >
              <option value="" disabled>Choose a resume...</option>
              <option v-for="res in resumes" :key="res.id" :value="res.id">
                {{ res.title }} {{ res.is_default ? '(Default)' : '' }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cover Letter <span class="font-normal normal-case">(optional)</span></label>
            <textarea
              v-model="coverLetter"
              rows="5"
              class="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white resize-none text-sm"
              placeholder="Tell the employer why you're a great fit for this role..."
            ></textarea>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              @click="showApplyModal = false"
              class="flex-1 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="submitApplication"
              :disabled="submitting || !selectedResume"
              class="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:bg-slate-300 dark:disabled:bg-slate-700 shadow-lg shadow-indigo-500/10"
            >
              {{ submitting ? 'Submitting...' : 'Confirm Application' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="toast.show"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-2 animate-fade-in-up"
    >
      <i :class="toast.icon"></i>
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobStore } from '@/stores/JobStore'
import { useAuthStore } from '@/stores/AuthStore'
import { candidateApi } from '@/api/services/api'

const route = useRoute()
const router = useRouter()
const jobStore = useJobStore()
const authStore = useAuthStore()

const job = ref(null)
const loading = ref(true)
const showApplyModal = ref(false)
const resumes = ref([])
const selectedResume = ref('')
const coverLetter = ref('')
const submitting = ref(false)
const isSaved = ref(false)
const applicationId = ref(null)
const linkCopied = ref(false)
const toast = ref({ show: false, message: '', icon: '' })

const applyState = computed(() => {
  if (!job.value) return 'inactive'
  const activeStatuses = ['active', 'pending_review']
  if (!activeStatuses.includes(job.value.status)) return 'inactive'
  if (job.value.expires_at && new Date(job.value.expires_at) < new Date()) return 'inactive'
  if (!authStore.isAuthenticated) return 'guest'
  if (authStore.userRole !== 'candidate') return 'inactive'
  if (job.value.has_applied) return 'applied'
  return 'apply'
})

const SummaryRow = {
  props: ['icon', 'color', 'bg', 'label', 'value'],
  template: `
    <div class="flex items-center gap-4">
      <div :class="['w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', bg]">
        <i :class="[icon, color, 'text-sm']"></i>
      </div>
      <div>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ label }}</p>
        <p class="text-sm font-bold text-slate-900 dark:text-white">{{ value || 'Not specified' }}</p>
      </div>
    </div>
  `,
}

onMounted(async () => {
  const jobId = route.params.id
  loading.value = true
  try {
    const data = await jobStore.fetchJobById(jobId)
    if (data) {
      job.value = data
      if (authStore.isAuthenticated && authStore.userRole === 'candidate') {
        checkSavedStatus(jobId)
        checkApplicationStatus(jobId)
      }
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
})

const checkSavedStatus = async (jobId) => {
  try {
    const saved = await candidateApi.getSavedJobs()
    isSaved.value = saved.some((s) => s.job_id === jobId || s.job?.id === jobId)
  } catch (err) {
    console.error('Failed to check saved status', err)
  }
}

const checkApplicationStatus = async (jobId) => {
  try {
    const apps = await candidateApi.getApplications()
    const app = apps.find((a) => a.job_id === jobId || a.job?.id === jobId)
    if (app) {
      applicationId.value = app.id
    }
  } catch (err) {
    console.error('Failed to check application status', err)
  }
}

const toggleSave = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  try {
    if (isSaved.value) {
      await candidateApi.unsaveJob(job.value.id)
      isSaved.value = false
      showToast('Job removed from saved', 'pi pi-check')
    } else {
      await candidateApi.saveJob(job.value.id)
      isSaved.value = true
      showToast('Job saved successfully', 'pi pi-bookmark-fill')
    }
  } catch (err) {
    showToast(err.response?.data?.message || 'Failed to update saved status', 'pi pi-exclamation-circle')
  }
}

const handleApplyClick = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  showApplyModal.value = true
  coverLetter.value = ''
  try {
    const resData = await candidateApi.getResumes()
    resumes.value = resData
    const defaultResume = resData.find((r) => r.is_default)
    if (defaultResume) selectedResume.value = defaultResume.id
  } catch (err) {
    console.error('Failed to load resumes', err)
  }
}

const submitApplication = async () => {
  if (!selectedResume.value) {
    showToast('Please select a resume first', 'pi pi-exclamation-circle')
    return
  }

  submitting.value = true
  try {
    await candidateApi.applyForJob({
      job_id: job.value.id,
      resume_id: selectedResume.value,
      cover_letter: coverLetter.value,
    })
    job.value.has_applied = true
    showToast('Application submitted successfully!', 'pi pi-check-circle')
    showApplyModal.value = false
    // Refresh application ID
    checkApplicationStatus(job.value.id)
  } catch (err) {
    showToast(err.response?.data?.message || 'Failed to submit application', 'pi pi-exclamation-circle')
  } finally {
    submitting.value = false
  }
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    linkCopied.value = true
    setTimeout(() => (linkCopied.value = false), 2000)
    showToast('Link copied to clipboard', 'pi pi-link')
  } catch {
    showToast('Failed to copy link', 'pi pi-exclamation-circle')
  }
}

const showToast = (message, icon) => {
  toast.value = { show: true, message, icon }
  setTimeout(() => (toast.value.show = false), 3000)
}

const jobTypeClass = (type) => {
  const map = {
    full_time: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-900/20',
    part_time: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-900/20',
    contract: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/10 dark:text-purple-400 dark:border-purple-900/20',
    freelance: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/10 dark:text-indigo-400 dark:border-indigo-900/20',
    internship: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-900/20',
  }
  return map[type] || 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
}

const workplaceClass = (type) => {
  const map = {
    remote: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-900/10 dark:text-sky-400 dark:border-sky-900/20',
    on_site: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/10 dark:text-rose-400 dark:border-rose-900/20',
    hybrid: 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-900/10 dark:text-violet-400 dark:border-violet-900/20',
  }
  return map[type] || 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
}

const experienceClass = (level) => {
  const map = {
    junior: 'bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-900/10 dark:text-teal-400 dark:border-teal-900/20',
    mid: 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/10 dark:text-orange-400 dark:border-orange-900/20',
    senior: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20',
    lead: 'bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-900/10 dark:text-pink-400 dark:border-pink-900/20',
    executive: 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/10 dark:text-yellow-400 dark:border-yellow-900/20',
  }
  return map[level] || 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
}

const formatSalary = (job) => {
  if (!job.is_salary_visible || (!job.salary_min && !job.salary_max)) return 'Not disclosed'
  const currency = job.currency || 'EGP'
  if (!job.salary_max) return `${Number(job.salary_min).toLocaleString()} ${currency}+`
  if (!job.salary_min) return `Up to ${Number(job.salary_max).toLocaleString()} ${currency}`
  return `${Number(job.salary_min).toLocaleString()} - ${Number(job.salary_max).toLocaleString()} ${currency}`
}

const timeAgo = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays < 1) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return `${Math.floor(diffDays / 30)}mo ago`
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
</style>
