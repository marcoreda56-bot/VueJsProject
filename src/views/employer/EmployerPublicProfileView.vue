<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <!-- Hero with Employer Cover -->
    <div class="relative h-52 md:h-80 overflow-hidden">
      <img
        v-if="employer?.cover_image_url"
        :src="employer.cover_image_url"
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

    <div class="max-w-6xl mx-auto px-4 -mt-20 md:-mt-24 relative z-10 pb-20">
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>

      <div v-else-if="employer" class="space-y-8">
        <!-- Header Card -->
        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div class="p-6 md:p-10">
            <div class="flex flex-col md:flex-row gap-6 md:items-start">
              <!-- Employer Logo -->
              <div class="flex-shrink-0 -mt-2 md:mt-0">
                <div class="w-24 h-24 md:w-28 md:h-28 bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-xl border-4 border-white dark:border-slate-900 flex items-center justify-center overflow-hidden">
                  <img
                    :src="employer.logo_url || '/default-logo.png'"
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
                      {{ employer.company_name }}
                    </h1>
                    <p v-if="employer.industry" class="text-indigo-600 font-bold text-sm">{{ employer.industry }}</p>
                  </div>

                  <!-- Rating Badge -->
                  <div v-if="employer.average_rating > 0" class="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/10 px-5 py-3 rounded-2xl border border-amber-100 dark:border-amber-900/20 flex-shrink-0">
                    <i class="pi pi-star-fill text-amber-500 text-lg"></i>
                    <div>
                      <span class="text-2xl font-black text-amber-700 dark:text-amber-400">{{ employer.average_rating }}</span>
                      <span class="text-[10px] font-black text-amber-600 dark:text-amber-500 ml-1">/ 5</span>
                    </div>
                    <div class="text-[10px] text-amber-600 dark:text-amber-500 font-medium leading-tight">
                      {{ employer.total_reviews || 0 }}<br/>reviews
                    </div>
                  </div>
                </div>

                <!-- Meta Chips -->
                <div class="flex flex-wrap gap-2 mb-5">
                  <span v-if="employer.headquarters" class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                    <i class="pi pi-map-marker mr-1"></i>{{ employer.headquarters }}
                  </span>
                  <span v-if="employer.founded_year" class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                    <i class="pi pi-calendar mr-1"></i>Founded {{ employer.founded_year }}
                  </span>
                  <span v-if="employer.company_size" class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                    <i class="pi pi-users mr-1"></i>{{ employer.company_size }}
                  </span>
                  <span v-if="employer.is_verified" class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-900/20">
                    <i class="pi pi-verified mr-1"></i>Verified
                  </span>
                </div>

                <!-- Description -->
                <p v-if="employer.description" class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                  {{ employer.description }}
                </p>

                <!-- Action Buttons -->
                <div class="flex flex-wrap items-center gap-3">
                  <a
                    v-if="employer.website"
                    :href="employer.website"
                    target="_blank"
                    class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all"
                  >
                    <i class="pi pi-globe"></i> Visit Website
                  </a>
                  <button
                    v-if="authStore.isAuthenticated && authStore.userRole === 'candidate'"
                    @click="showReviewModal = true"
                    class="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                  >
                    <i class="pi pi-pencil"></i> Write a Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <!-- Main Content -->
          <div class="space-y-8">
            <!-- Active Jobs -->
            <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
              <div class="flex items-center justify-between mb-8">
                <h2 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Open Positions
                  <span v-if="jobs.length > 0" class="ml-2 text-sm font-bold text-slate-400">({{ jobs.length }})</span>
                </h2>
              </div>

              <div v-if="jobs.length === 0" class="text-center py-16">
                <div class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="pi pi-briefcase text-slate-300 text-2xl"></i>
                </div>
                <p class="text-slate-400 font-bold">No active job listings at the moment.</p>
              </div>

              <div v-else class="space-y-4">
                <router-link
                  v-for="job in jobs"
                  :key="job.id"
                  :to="`/jobs/${job.id}`"
                  class="block p-6 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                >
                  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex-1 min-w-0">
                      <h3 class="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors text-lg mb-2">
                        {{ job.title }}
                      </h3>

                      <!-- Badges -->
                      <div class="flex flex-wrap gap-2 mb-3">
                        <span :class="jobTypeClass(job.type)" class="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border">
                          {{ job.type?.replace('_', ' ') }}
                        </span>
                        <span :class="workplaceClass(job.workplace_type)" class="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border">
                          {{ job.workplace_type?.replace('_', ' ') }}
                        </span>
                        <span :class="experienceClass(job.experience_level)" class="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border">
                          {{ job.experience_level }}
                        </span>
                        <span v-if="job.category" class="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                          {{ job.category?.name }}
                        </span>
                      </div>

                      <!-- Skills -->
                      <div v-if="job.skills?.length" class="flex flex-wrap gap-1.5 mb-3">
                        <span
                          v-for="skill in job.skills.slice(0, 4)"
                          :key="skill.skill_id || skill.id"
                          class="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 rounded-md"
                        >
                          {{ skill.skill?.name || skill.name }}
                        </span>
                        <span v-if="job.skills.length > 4" class="text-[10px] font-bold px-2 py-0.5 text-slate-400">
                          +{{ job.skills.length - 4 }}
                        </span>
                      </div>

                      <!-- Meta -->
                      <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <span class="flex items-center gap-1">
                          <i class="pi pi-map-marker text-slate-300"></i>
                          {{ job.city || job.location || 'Remote' }}
                        </span>
                        <span class="flex items-center gap-1">
                          <i class="pi pi-calendar text-slate-300"></i>
                          {{ timeAgo(job.created_at) }}
                        </span>
                        <span class="flex items-center gap-1">
                          <i class="pi pi-users text-slate-300"></i>
                          {{ job.applications_count || 0 }} applicant{{ job.applications_count === 1 ? '' : 's' }}
                        </span>
                      </div>
                    </div>

                    <!-- Salary + Apply CTA -->
                    <div class="flex flex-col items-end gap-3 flex-shrink-0">
                      <p class="text-sm font-black text-slate-900 dark:text-white whitespace-nowrap">
                        {{ formatSalary(job) }}
                      </p>
                      <span class="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-indigo-600 text-white rounded-xl group-hover:bg-indigo-700 transition-colors">
                        View Job <i class="pi pi-arrow-right ml-1 text-[10px]"></i>
                      </span>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>

            <!-- Reviews -->
            <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
              <div class="flex items-center justify-between mb-8">
                <h2 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Reviews
                  <span v-if="reviews.length > 0" class="ml-2 text-sm font-bold text-slate-400">({{ reviews.length }})</span>
                </h2>
                <div v-if="employer.average_rating > 0" class="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/10 px-4 py-2 rounded-xl border border-amber-100 dark:border-amber-900/20">
                  <i class="pi pi-star-fill text-amber-500"></i>
                  <span class="text-lg font-black text-amber-700 dark:text-amber-400">{{ employer.average_rating }}</span>
                </div>
              </div>

              <div v-if="reviews.length === 0" class="text-center py-16">
                <div class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="pi pi-comment text-slate-300 text-2xl"></i>
                </div>
                <p class="text-slate-400 font-bold mb-2">No reviews yet.</p>
                <p class="text-xs text-slate-400">Be the first to share your experience!</p>
              </div>

              <div v-else class="space-y-6">
                <div
                  v-for="review in reviews"
                  :key="review.id"
                  class="p-6 border border-slate-100 dark:border-slate-800 rounded-2xl"
                >
                  <div class="flex items-start justify-between mb-4">
                    <div>
                      <h4 class="font-bold text-slate-900 dark:text-white">{{ review.title }}</h4>
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span v-if="!review.is_anonymous" class="font-bold">{{ review.candidate_name }}</span>
                        <span v-else class="italic">Anonymous</span>
                        <span class="mx-2">&bull;</span>
                        <span>{{ review.job_title_at_time || 'Former Employee' }}</span>
                        <span v-if="review.employment_type" class="mx-2">&bull;</span>
                        <span v-if="review.employment_type">{{ review.employment_type.replace('_', ' ') }}</span>
                      </p>
                    </div>
                    <div class="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/10 px-3 py-1 rounded-full">
                      <i class="pi pi-star-fill text-amber-500 text-xs"></i>
                      <span class="text-xs font-black text-amber-600">{{ review.rating_overall }}</span>
                    </div>
                  </div>

                  <!-- Rating Breakdown -->
                  <div v-if="hasRatingBreakdown(review)" class="flex flex-wrap gap-3 mb-4">
                    <span v-if="review.rating_work_life_balance" class="text-[10px] font-bold px-2 py-1 bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400 rounded-md">
                      Work-Life {{ review.rating_work_life_balance }}
                      <i class="pi pi-star-fill text-[8px] ml-0.5"></i>
                    </span>
                    <span v-if="review.rating_salary" class="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-md">
                      Salary {{ review.rating_salary }}
                      <i class="pi pi-star-fill text-[8px] ml-0.5"></i>
                    </span>
                    <span v-if="review.rating_culture" class="text-[10px] font-bold px-2 py-1 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 rounded-md">
                      Culture {{ review.rating_culture }}
                      <i class="pi pi-star-fill text-[8px] ml-0.5"></i>
                    </span>
                    <span v-if="review.rating_management" class="text-[10px] font-bold px-2 py-1 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 rounded-md">
                      Management {{ review.rating_management }}
                      <i class="pi pi-star-fill text-[8px] ml-0.5"></i>
                    </span>
                    <span v-if="review.rating_career_growth" class="text-[10px] font-bold px-2 py-1 bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 rounded-md">
                      Growth {{ review.rating_career_growth }}
                      <i class="pi pi-star-fill text-[8px] ml-0.5"></i>
                    </span>
                  </div>

                  <div v-if="review.pros" class="mb-2">
                    <span class="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Pros</span>
                    <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">{{ review.pros }}</p>
                  </div>
                  <div v-if="review.cons" class="mb-2">
                    <span class="text-[10px] font-black text-rose-600 uppercase tracking-wider">Cons</span>
                    <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">{{ review.cons }}</p>
                  </div>
                  <div v-if="review.advice" class="mb-2">
                    <span class="text-[10px] font-black text-indigo-600 uppercase tracking-wider">Advice</span>
                    <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">{{ review.advice }}</p>
                  </div>
                  <p class="text-xs text-slate-400 mt-3">{{ formatDate(review.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Company Info -->
            <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">Company Info</h3>
              <div class="space-y-5">
                <InfoRow
                  v-if="employer.industry"
                  icon="pi pi-briefcase"
                  color="text-indigo-600"
                  bg="bg-indigo-50 dark:bg-indigo-900/10"
                  label="Industry"
                  :value="employer.industry"
                />
                <InfoRow
                  v-if="employer.company_size"
                  icon="pi pi-users"
                  color="text-blue-600"
                  bg="bg-blue-50 dark:bg-blue-900/10"
                  label="Company Size"
                  :value="employer.company_size"
                />
                <InfoRow
                  v-if="employer.headquarters"
                  icon="pi pi-map-marker"
                  color="text-emerald-600"
                  bg="bg-emerald-50 dark:bg-emerald-900/10"
                  label="Headquarters"
                  :value="employer.headquarters"
                />
                <InfoRow
                  v-if="employer.founded_year"
                  icon="pi pi-calendar"
                  color="text-amber-600"
                  bg="bg-amber-50 dark:bg-amber-900/10"
                  label="Founded"
                  :value="String(employer.founded_year)"
                />
                <InfoRow
                  v-if="employer.website"
                  icon="pi pi-globe"
                  color="text-sky-600"
                  bg="bg-sky-50 dark:bg-sky-900/10"
                  label="Website"
                  :value="employer.website"
                  :isLink="true"
                />
                <InfoRow
                  v-if="employer.city || employer.country"
                  icon="pi pi-building"
                  color="text-rose-600"
                  bg="bg-rose-50 dark:bg-rose-900/10"
                  label="Location"
                  :value="[employer.city, employer.country].filter(Boolean).join(', ')"
                />
              </div>
            </div>

            <!-- Share -->
            <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Share</h3>
              <button
                @click="copyLink"
                class="w-full py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
              >
                <i class="pi pi-link"></i> {{ linkCopied ? 'Copied!' : 'Copy Link' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <div class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="pi pi-exclamation-circle text-slate-300 text-2xl"></i>
        </div>
        <p class="text-slate-400 font-bold">Employer not found.</p>
      </div>
    </div>

    <!-- Review Modal -->
    <div
      v-if="showReviewModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      @click.self="showReviewModal = false"
    >
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600">
            <i class="pi pi-pencil text-lg"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 dark:text-white">Write a Review</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">for <span class="font-bold text-indigo-600">{{ employer?.company_name }}</span></p>
          </div>
        </div>

        <div class="space-y-5">
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Review Title *</label>
            <input
              v-model="reviewForm.title"
              class="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Great place to grow your career"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Overall Rating *</label>
              <select v-model.number="reviewForm.rating_overall" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none">
                <option v-for="n in 5" :key="n" :value="n">{{ n }} — {{ n === 1 ? 'Poor' : n === 2 ? 'Fair' : n === 3 ? 'Good' : n === 4 ? 'Very Good' : 'Excellent' }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Job Title at Company</label>
              <input
                v-model="reviewForm.job_title_at_time"
                class="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Software Engineer"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Employment Type</label>
              <select v-model="reviewForm.employment_type" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div class="flex flex-col justify-center gap-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="reviewForm.is_current_employee" class="accent-indigo-600 w-5 h-5" />
                <span class="text-xs font-bold text-slate-500 dark:text-slate-400">Current Employee</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="reviewForm.is_anonymous" class="accent-indigo-600 w-5 h-5" />
                <span class="text-xs font-bold text-slate-500 dark:text-slate-400">Anonymous</span>
              </label>
            </div>
          </div>

          <!-- Optional Ratings -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Rating Breakdown (optional)</label>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
              <div v-for="key in ['rating_work_life_balance', 'rating_salary', 'rating_culture', 'rating_management', 'rating_career_growth']" :key="key">
                <label class="block text-[9px] font-black text-slate-400 uppercase mb-1">{{ key.replace('rating_', '').replace('_', ' ') }}</label>
                <select v-model.number="reviewForm[key]" class="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option :value="null">—</option>
                  <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pros</label>
            <textarea v-model="reviewForm.pros" rows="3" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm dark:text-white resize-none focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="What do you like about this company?"></textarea>
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cons</label>
            <textarea v-model="reviewForm.cons" rows="3" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm dark:text-white resize-none focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="What could be improved?"></textarea>
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Advice to Management</label>
            <textarea v-model="reviewForm.advice" rows="3" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm dark:text-white resize-none focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Any advice for the leadership team?"></textarea>
          </div>
        </div>

        <div class="flex gap-3 mt-8">
          <button @click="showReviewModal = false" class="flex-1 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-colors">
            Cancel
          </button>
          <button
            @click="submitReview"
            :disabled="submittingReview || !reviewForm.title || !reviewForm.rating_overall"
            class="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:bg-slate-300 dark:disabled:bg-slate-700 shadow-lg shadow-indigo-500/10"
          >
            {{ submittingReview ? 'Submitting...' : 'Submit Review' }}
          </button>
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
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'
import { publicApi, candidateApi } from '@/api/services/api'

const route = useRoute()
const authStore = useAuthStore()

const employer = ref(null)
const jobs = ref([])
const reviews = ref([])
const loading = ref(false)
const showReviewModal = ref(false)
const submittingReview = ref(false)
const linkCopied = ref(false)
const toast = ref({ show: false, message: '', icon: '' })

const reviewForm = reactive({
  employer_id: '',
  job_title_at_time: '',
  employment_type: 'full_time',
  is_current_employee: false,
  is_anonymous: false,
  rating_overall: 5,
  rating_work_life_balance: null,
  rating_salary: null,
  rating_culture: null,
  rating_management: null,
  rating_career_growth: null,
  title: '',
  pros: '',
  cons: '',
  advice: '',
})

const resetReviewForm = () => {
  Object.assign(reviewForm, {
    employer_id: employer.value?.id || '',
    job_title_at_time: '',
    employment_type: 'full_time',
    is_current_employee: false,
    is_anonymous: false,
    rating_overall: 5,
    rating_work_life_balance: null,
    rating_salary: null,
    rating_culture: null,
    rating_management: null,
    rating_career_growth: null,
    title: '',
    pros: '',
    cons: '',
    advice: '',
  })
}

onMounted(async () => {
  loading.value = true
  try {
    const slug = route.params.slug
    const data = await publicApi.getEmployerBySlug(slug)
    employer.value = data
    jobs.value = data.active_jobs || []
    reviews.value = data.recent_reviews || data.active_jobs?.recent_reviews || []
    resetReviewForm()
  } catch (err) {
    console.error('Failed to load employer', err)
    showToast(err.response?.data?.message || 'Failed to load employer profile', 'pi pi-exclamation-circle')
  } finally {
    loading.value = false
  }
})

const submitReview = async () => {
  if (!reviewForm.title || !reviewForm.rating_overall) {
    showToast('Please provide a title and overall rating', 'pi pi-exclamation-circle')
    return
  }
  submittingReview.value = true
  try {
    await candidateApi.submitReview(reviewForm)
    showReviewModal.value = false
    resetReviewForm()
    // Refresh employer data to show new review
    const data = await publicApi.getEmployerBySlug(route.params.slug)
    employer.value = data
    jobs.value = data.active_jobs || []
    reviews.value = data.recent_reviews || []
    showToast('Review submitted successfully! It will be visible after admin approval.', 'pi pi-check-circle')
  } catch (err) {
    showToast(err.response?.data?.message || 'Failed to submit review', 'pi pi-exclamation-circle')
  } finally {
    submittingReview.value = false
  }
}

const hasRatingBreakdown = (review) => {
  return review.rating_work_life_balance || review.rating_salary || review.rating_culture || review.rating_management || review.rating_career_growth
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
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const InfoRow = {
  props: ['icon', 'color', 'bg', 'label', 'value', 'isLink'],
  template: `
    <div class="flex items-center gap-4">
      <div :class="['w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', bg]">
        <i :class="[icon, color, 'text-sm']"></i>
      </div>
      <div class="min-w-0">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ label }}</p>
        <a v-if="isLink" :href="value" target="_blank" class="text-sm font-bold text-indigo-600 hover:underline truncate block">{{ value }}</a>
        <p v-else class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ value || 'Not specified' }}</p>
      </div>
    </div>
  `,
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
