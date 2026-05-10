# HireMasr — Candidate Functionalities
**For:** Vue 3 frontend agent/developer
**Role:** candidate
**Scope:** Everything a candidate can see and do on the platform

---

## Overview

A candidate registers on the platform, builds their profile, browses jobs, applies, tracks their applications, manages interviews, saves jobs they like, and leaves company reviews. Every screen listed here is candidate-only unless marked as public.

---

## 1. Authentication

### 1.1 Register
- Form fields: First Name, Last Name, Email, Password, Password Confirmation
- Role is fixed to `candidate` on this registration path (no dropdown)
- On success: candidate is logged in immediately, token stored, redirected to complete profile
- On register: backend auto-creates an empty candidate profile record

**Endpoint:** `POST /api/v1/auth/register`
**Payload:** `{ first_name, last_name, email, password, password_confirmation, role: "candidate" }`
**Response:** `{ access_token, user: { id, first_name, last_name, email, role, avatar_url } }`

### 1.2 Login
- Form fields: Email, Password
- On success: token stored, user redirected based on role to `/candidate/dashboard`

**Endpoint:** `POST /api/v1/auth/login`
**Response:** `{ access_token, user: { id, first_name, last_name, role, avatar_url, profile: { ...candidate fields } } }`

### 1.3 Logout
- Clears token and store, redirects to `/`

**Endpoint:** `POST /api/v1/auth/logout`

### 1.4 Forgot / Reset Password
- Forgot: input email, backend sends reset link
- Reset: form with token (from email link), new password, confirm password

**Endpoints:** `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password`

### 1.5 Update Account Info
- Candidate can change first name, last name, phone, avatar image
- Avatar upload is multipart

**Endpoint:** `PATCH /api/v1/auth/me`

---

## 2. Candidate Profile

The profile is the core identity of a candidate on the platform. It is split into sections. A profile completion score (0–100) is shown and updated as sections are filled.

### 2.1 View Full Profile
Returns everything: core info, education list, experience list, skills list, resumes list.

**Endpoint:** `GET /api/v1/candidate/profile`
**Response shape:**
```json
{
  "id": "uuid",
  "headline": "Senior Frontend Developer | Vue.js",
  "bio": "...",
  "location": "Cairo, Egypt",
  "city": "Cairo",
  "experience_years": 5,
  "education_level": "bachelor",
  "linkedin_url": "...",
  "github_url": "...",
  "portfolio_url": "...",
  "is_open_to_work": true,
  "preferred_job_type": "full_time",
  "preferred_locations": ["Cairo", "Remote"],
  "expected_salary_min": 25000,
  "expected_salary_max": 40000,
  "currency": "EGP",
  "profile_completion_score": 75,
  "education": [],
  "experience": [],
  "skills": [{ "skill_id": "uuid", "name": "Vue.js", "proficiency_level": "expert", "years_experience": 5 }],
  "resumes": [{ "id": "uuid", "title": "General CV", "is_default": true, "file": { "url": "...", "size_bytes": 124000 } }]
}
```

### 2.2 Update Core Profile
Single PUT that updates all basic fields at once.

**Endpoint:** `PUT /api/v1/candidate/profile`
**Editable fields:** headline, bio, location, city, experience_years, education_level, linkedin_url, github_url, portfolio_url, website_url, is_open_to_work, preferred_job_type, preferred_locations, expected_salary_min, expected_salary_max

### 2.3 Education — Add / Edit / Delete
Each entry: degree, institution, field_of_study, start_year, end_year (nullable if current), grade, description, is_current.

**Endpoints:**
- `POST /api/v1/candidate/education` — add
- `PUT /api/v1/candidate/education/:id` — edit (ownership verified)
- `DELETE /api/v1/candidate/education/:id` — delete

### 2.4 Work Experience — Add / Edit / Delete
Each entry: title, company_name, location, employment_type, start_date, end_date (nullable if current), is_current, description.

**Endpoints:**
- `POST /api/v1/candidate/experience` — add
- `PUT /api/v1/candidate/experience/:id` — edit
- `DELETE /api/v1/candidate/experience/:id` — delete

### 2.5 Skills — Batch Sync
Skills are replaced in full on every sync. The UI sends the entire selected skill set. Skills must be chosen from the existing taxonomy — candidates cannot create new skills.

**Endpoint:** `POST /api/v1/candidate/skills`
**Payload:** `{ skills: [{ skill_id: "uuid", proficiency_level: "expert", years_experience: 5 }] }`

Skills are fetched for the selector from:
- `GET /api/v1/skills` — full list
- `GET /api/v1/skills/autocomplete?q=vue` — search while typing

### 2.6 Resumes — Upload / List / Set Default / Delete

**List resumes:** `GET /api/v1/candidate/resumes`

**Upload resume:** `POST /api/v1/candidate/resumes` (multipart)
- Fields: title (string), file (PDF/DOC/DOCX, max 5MB), is_default (boolean)
- If this is the first resume, it is auto-set as default
- If `is_default = true`, all other resumes lose their default flag

**Update title:** `PUT /api/v1/candidate/resumes/:id`

**Set as default:** `PATCH /api/v1/candidate/resumes/:id/default`

**Delete resume:** `DELETE /api/v1/candidate/resumes/:id`

### Profile Completion Score
Displayed as a progress bar. Calculated by backend on every profile update.

| Section | Points |
|---|---|
| Headline filled | 10 |
| Bio filled | 10 |
| Location filled | 5 |
| At least one social/portfolio link | 10 |
| At least one experience entry | 20 |
| At least one education entry | 15 |
| At least one skill | 15 |
| At least one resume | 10 |
| Expected salary filled | 5 |
| **Total possible** | **100** |

---

## 3. Job Discovery (Public — no auth required)

Candidates (and anyone else) can browse and search jobs without logging in.

### 3.1 Browse Jobs
Paginated list of all active jobs. Supports filtering and sorting.

**Endpoint:** `GET /api/v1/jobs`
**Query parameters:**
- `search` — full-text search across title, description, requirements
- `category` — category slug
- `type` — full_time, part_time, contract, freelance, internship
- `workplace` — remote, on_site, hybrid
- `experience` — junior, mid, senior, lead, executive
- `location` — city name (partial match)
- `salary_min`, `salary_max`
- `skills[]` — array of skill UUIDs (jobs matching any of these)
- `sort` — created_at:desc (default), salary_max:desc, applications_count:asc
- `page`, `per_page` (max 50)

**Each job in list includes:** title, slug, employer (name, logo, is_verified), category, type, workplace_type, experience_level, salary (if visible), location, skills (name + is_required), applications_count, created_at

### 3.2 Job Detail
Full job information including description, requirements, responsibilities, benefits, employer profile summary, and full skill list.

**Endpoint:** `GET /api/v1/jobs/:slug`
- If job is not active (closed, draft, pending_review, expired) → 404 for public
- Viewing increments `views_count`
- If `is_salary_visible = false` → salary fields are null in response

### 3.3 Browse Employers (Public)
Paginated list of employers with their verification status, rating, and review count.

**Endpoint:** `GET /api/v1/employers`

### 3.4 Employer Public Profile
Company page showing: company info, active job listings (up to 6), and recent approved reviews (up to 3).

**Endpoint:** `GET /api/v1/employers/:slug`

### 3.5 Employer Reviews (Public)
Paginated approved reviews for a company.

**Endpoint:** `GET /api/v1/employers/:slug/reviews`

---

## 4. Saved Jobs (Auth required)

Candidates can bookmark jobs with an optional personal note.

### 4.1 List Saved Jobs
**Endpoint:** `GET /api/v1/candidate/saved-jobs`
Returns each saved job with the live job data (title, employer, salary, location) and the saved_at timestamp and notes.

### 4.2 Save a Job
**Endpoint:** `POST /api/v1/candidate/saved-jobs`
**Payload:** `{ job_id: "uuid", notes: "Apply before Friday" }`
- Duplicate save returns 409

### 4.3 Unsave a Job
**Endpoint:** `DELETE /api/v1/candidate/saved-jobs/:job_id`

**UI notes:**
- Job detail page has a heart/bookmark icon that toggles save state
- Saved jobs list is accessible from the candidate dashboard or a dedicated page

---

## 5. Job Applications

### 5.1 Apply for a Job
**Endpoint:** `POST /api/v1/candidate/applications`
**Payload:** `{ job_id, cover_letter (optional), resume_id (optional — uses default if omitted) }`

**Guards before showing Apply button:**
- Job must be active and not expired
- Candidate must not have already applied (show "Applied" state instead)
- Candidate must have at least one resume — if none, show "Upload a resume first" prompt

**On success:** Returns full application detail (same shape as application detail endpoint). Frontend navigates to or renders the application detail.

**Error cases:**
- 409 — already applied
- 404 — job not active
- 422 — no resume found

### 5.2 List My Applications
Paginated list of all applications with status, job snapshot, employer snapshot, and interview count.

**Endpoint:** `GET /api/v1/candidate/applications`
**Query params:** `status` (optional filter), `page`, `per_page`

**Each item includes:**
- `id`, `current_status`, `job_removed_at`, `applied_at`, `updated_at`, `withdrawn_at`
- `cover_letter`, `resume_url`, `interviews_count`
- `job_snapshot` (full — title, employer name, salary, location, type)
- `employer_snapshot` (full — company name, logo, is_verified)

**Status badge colors:**
- applied → blue
- reviewed → purple
- shortlisted → indigo
- interviewed → yellow
- offered → orange
- hired → green
- rejected → red
- withdrawn → gray
- job_removed → gray muted

### 5.3 View Application Detail
Full detail of one application including the history log and all interviews (including cancelled ones).

**Endpoint:** `GET /api/v1/candidate/applications/:id`
**Returns:** All fields from list plus:
- `withdrawn_reason`
- `candidate_snapshot`
- `history` array — full timeline ordered oldest to newest
- `interviews` array — all interviews including soft-deleted ones

**History entry shape:**
```json
{
  "id": "uuid",
  "stage": "shortlisted",
  "label": "Employer shortlisted this candidate",
  "actor_name": "Mostafa Ali",
  "actor_role": "employer",
  "notes": "Strong Vue.js background",
  "created_at": "2026-05-04T11:00:00Z"
}
```

**Interview card rendering:**
- `status = scheduled`, `deleted_at = null` → show date, time, location, link
- `deleted_at` not null → show in muted style with cancellation reason:
  - `job_removed` → "Cancelled because the employer removed the job listing"
  - `employer_cancelled` → "Cancelled by the employer"
  - `candidate_cancelled` → "Cancelled because you withdrew your application"
- `status = completed` → green "Completed" chip
- `status = no_show` → red "No show" chip

**Job removed alert:** When `job_removed_at` is not null, show a full-width banner: "This job was removed by the employer on {date}. Your application record is preserved."

### 5.4 Withdraw Application
**Endpoint:** `PATCH /api/v1/candidate/applications/:id/withdraw`
**Payload:** `{ reason: "optional free text" }`

**Show withdraw button only when `current_status` is:** applied, reviewed, shortlisted, interviewed, offered

**Hide withdraw button when:** hired, rejected, withdrawn, job_removed

**Withdrawal flow:**
1. Candidate clicks "Withdraw Application"
2. Modal appears: "Are you sure? This cannot be undone."
3. Optional reason textarea
4. On confirm: call withdraw endpoint
5. On success: stay on page, status badge changes to "Withdrawn", button disappears, new entry appears in history timeline
6. Any scheduled interviews become cancelled with `cancellation_reason = candidate_cancelled`

**Error responses:**
- 403 hired → "You cannot withdraw from an application that has been accepted."
- 403 rejected → "This application has already been closed by the employer."
- 403 job_removed → "This application is no longer active because the job was removed."
- 409 withdrawn → "You have already withdrawn this application."

---

## 6. Company Reviews

### 6.1 Submit a Review
Candidates can leave one review per employer. Reviews go through admin moderation before appearing publicly.

**Endpoint:** `POST /api/v1/candidate/reviews`
**Fields:**
- `employer_id` — required
- `job_title_at_time` — optional, their role at the company
- `employment_type` — optional (full_time, part_time, contract, freelance, internship)
- `is_current_employee` — boolean
- `is_anonymous` — boolean, hides name on public page
- `rating_overall` — required, 1–5
- `rating_work_life_balance`, `rating_salary`, `rating_culture`, `rating_management`, `rating_career_growth` — optional, 1–5
- `title` — required
- `pros` — optional text
- `cons` — optional text
- `advice` — optional text

### 6.2 List My Reviews
**Endpoint:** `GET /api/v1/candidate/reviews`
Shows all reviews submitted by the candidate, including their moderation status.

### 6.3 Edit Review
Only allowed if review is not yet approved.

**Endpoint:** `PUT /api/v1/candidate/reviews/:id`

### 6.4 Delete Review
Only allowed if review is not yet approved.

**Endpoint:** `DELETE /api/v1/candidate/reviews/:id`

---

## 7. Notifications

Candidates receive in-app notifications for:
- Application status changed (e.g. moved to shortlisted)
- Interview scheduled by employer
- Review approved by admin
- Saved job expiring soon

### 7.1 List Notifications
**Endpoint:** `GET /api/v1/notifications`
Returns paginated notifications with `is_read`, `title`, `message`, `action_url`, `created_at`, and `data` payload.

### 7.2 Unread Count
**Endpoint:** `GET /api/v1/notifications/unread-count`
Used for the notification bell badge in the header. Poll this every 30–60 seconds or on navigation.

### 7.3 Mark as Read
**Endpoint:** `PATCH /api/v1/notifications/:id/read`

### 7.4 Mark All as Read
**Endpoint:** `PATCH /api/v1/notifications/read-all`

---

## 8. Screens Summary

| Screen | Route | Endpoint(s) |
|---|---|---|
| Register | `/auth/register` | POST /auth/register |
| Login | `/auth/login` | POST /auth/login |
| Forgot Password | `/auth/forgot-password` | POST /auth/forgot-password |
| Reset Password | `/auth/reset-password` | POST /auth/reset-password |
| Dashboard | `/candidate/dashboard` | GET /notifications/unread-count |
| My Profile | `/candidate/profile` | GET+PUT /candidate/profile |
| Edit Education | `/candidate/profile` (modal/section) | POST/PUT/DELETE /candidate/education |
| Edit Experience | `/candidate/profile` (modal/section) | POST/PUT/DELETE /candidate/experience |
| Edit Skills | `/candidate/profile` (modal/section) | POST /candidate/skills + GET /skills |
| Manage Resumes | `/candidate/profile` or `/candidate/resumes` | GET+POST+PUT+PATCH+DELETE /candidate/resumes |
| Browse Jobs | `/jobs` | GET /jobs |
| Job Detail | `/jobs/:slug` | GET /jobs/:slug |
| Browse Employers | `/employers` | GET /employers |
| Employer Profile | `/employers/:slug` | GET /employers/:slug |
| Saved Jobs | `/candidate/saved-jobs` | GET+POST+DELETE /candidate/saved-jobs |
| My Applications | `/candidate/applications` | GET /candidate/applications |
| Application Detail | `/candidate/applications/:id` | GET /candidate/applications/:id |
| Notifications | `/candidate/notifications` | GET+PATCH /notifications |

---

## 9. Key Business Rules for Frontend

- A candidate with no resume cannot apply. Show a prompt directing them to upload one.
- The `job_removed_at` field on an application must always be checked. When set, show the removed banner and disable any link to the live job page.
- All job and employer data shown on application screens must come from `job_snapshot` and `employer_snapshot` — never fetch the live job for this purpose.
- Withdrawal is permanent. After confirming, never show the withdraw button again for that application.
- The history timeline is append-only and arrives pre-sorted. Never reorder it on the frontend.
- `current_status` drives all status-dependent UI (badges, button visibility). Do not derive it from the history array.
- Interviews with `deleted_at` set must still be shown — they should render in a muted cancelled style with the cancellation reason.
- Skills must be selected from the existing taxonomy. The candidate cannot type a free-form skill name.
- Profile completion score is calculated by the backend. Never calculate it on the frontend.
