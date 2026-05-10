# HireMasr — Admin Functionalities
**For:** Vue 3 frontend agent/developer
**Role:** admin
**Scope:** Everything an admin can see and do on the platform

---

## Overview

Admins are the platform moderators. They do not register through the public form — admin accounts are created via database seeder only. Admins manage the entire platform: approving and rejecting jobs, moderating users, managing the taxonomy (categories and skills), approving company reviews, and handling reports. Admins also have access to a dashboard with platform-wide statistics.

---

## 1. Authentication

### 1.1 Login
Admin accounts exist in the database only. There is no public registration for admins.

**Endpoint:** `POST /api/v1/auth/login`
**Payload:** `{ email, password }`
**On success:** Redirect to `/admin/dashboard`

### 1.2 Logout
**Endpoint:** `POST /api/v1/auth/logout`

### 1.3 Update Own Account Info
Admin can update their own name, phone, and avatar.

**Endpoint:** `PATCH /api/v1/auth/me`

---

## 2. Admin Dashboard

A stats overview page showing platform health at a glance.

**Endpoint:** `GET /api/v1/admin/dashboard`

**Response:**
```json
{
  "stats": {
    "total_users": 124,
    "total_candidates": 98,
    "total_employers": 24,
    "total_admins": 2,
    "total_jobs": 56,
    "pending_jobs": 8,
    "active_jobs": 42,
    "closed_jobs": 6,
    "total_applications": 342,
    "total_reviews_pending": 12
  },
  "recent_jobs": [],
  "recent_users": []
}
```

**UI:** Render as stat cards at the top. Below the cards: two tables — "Recently Submitted Jobs" (pending_review queue) and "Recently Registered Users". Each row links to the respective detail screen.

---

## 3. User Management

### 3.1 List All Users
Paginated list of all users across all roles. Filterable by role, active status, and search by name or email.

**Endpoint:** `GET /api/v1/admin/users`
**Query params:** `role` (candidate/employer/admin), `status` (active/inactive), `search`, `page`, `per_page`

**Each user item includes:** id, first_name, last_name, email, role, is_active, avatar_url, created_at

### 3.2 User Detail
Full user profile including role-specific stats.

**Endpoint:** `GET /api/v1/admin/users/:id`

**Response includes:**
- For candidates: applications count, reviews count
- For employers: jobs count (by status), active jobs, reviews received

### 3.3 Activate / Deactivate User
**Endpoint:** `PATCH /api/v1/admin/users/:id/status`
**Payload:** `{ is_active: false }`

**Rules:**
- Admin cannot deactivate another admin account → 403
- Deactivated users cannot log in (backend rejects with 403 "Account deactivated")

**UI:** Toggle button on each user row and on the user detail screen.

---

## 4. Job Moderation

This is the primary admin task. Jobs submitted by employers arrive as `pending_review` and must be approved or rejected before going live.

### 4.1 List All Jobs (Admin View)
All jobs in the system regardless of status. Primary use: the moderation queue.

**Endpoint:** `GET /api/v1/admin/jobs`
**Query params:** `status` (default filter: pending_review), `employer_id`, `search`, `page`, `per_page`

**Each job item includes:** title, employer (company_name, is_verified), status, applications_count, created_at, rejection_reason

**UI:** Default view shows `pending_review` jobs first. Provide tabs or filter chips for: All, Pending Review, Active, Rejected, Closed/Expired.

### 4.2 Job Detail (Admin View)
Full job detail including application count.

**Endpoint:** `GET /api/v1/admin/jobs/:id`

### 4.3 Update Job Status (Approve / Reject / Close)
**Endpoint:** `PATCH /api/v1/admin/jobs/:id/status`

**Admin can set any status:**
```json
// Approve:
{ "status": "active", "rejection_reason": null }

// Reject:
{ "status": "rejected", "rejection_reason": "Job description contains discriminatory language. Please revise and resubmit." }

// Close:
{ "status": "closed" }
```

**Business rules:**
- On approve (`status → active`): sets `expires_at` to 30 days from now if not already set. Fires `JobApproved` event → employer receives notification.
- On reject: stores `rejection_reason` in the job record. Fires `JobRejected` event → employer receives notification with the reason.
- Admin can transition to any status (no restriction map like the employer has).

**UI on the job detail screen:**
- If status is `pending_review`: show "Approve" (green) and "Reject" (red) buttons prominently
- If status is `active`: show "Close" and "Pause" buttons
- If status is `rejected`: show "Re-activate" button
- Reject action opens a modal with a required reason textarea

### 4.4 Hard Delete a Job
**Endpoint:** `DELETE /api/v1/admin/jobs/:id`

This is a hard delete (removes from DB entirely), unlike the employer soft-delete. Applications are preserved because their snapshots store all job data independently.

**UI:** "Delete Permanently" button on job detail. Requires a confirmation dialog: "This action cannot be undone."

### 4.5 Create Job on Behalf of Employer
Admin can post a job directly for any employer and set it immediately to active.

**Endpoint:** `POST /api/v1/admin/jobs`
**Payload:** same as employer job creation, plus `employer_id` and optionally `status: "active"` to bypass review.

---

## 5. Review Moderation

Company reviews submitted by candidates must be approved by admin before appearing on public employer pages.

### 5.1 Pending Reviews Queue
**Endpoint:** `GET /api/v1/admin/reviews`
**Query params:** `status` (pending/approved/rejected), `page`, `per_page`

**Each review item includes:** candidate name (or "Anonymous"), employer name, rating_overall, title, pros, cons, submitted_at, is_approved

### 5.2 Approve a Review
**Endpoint:** `PATCH /api/v1/admin/reviews/:id/approve`

On approval:
- Sets `is_approved = true`, records `approved_by` and `approved_at`
- Recalculates employer `average_rating` and `total_reviews`
- Fires `ReviewApproved` event → candidate receives notification

### 5.3 Reject a Review
**Endpoint:** `PATCH /api/v1/admin/reviews/:id/reject`

Rejected reviews do not appear publicly. The candidate is not notified by default (no event specified), but the review status is visible to the candidate in their own review list.

**UI:** Each review card in the moderation queue has "Approve" and "Reject" buttons. Show the full review text so admin can read it before deciding.

---

## 6. Taxonomy Management (Categories & Skills)

Admin controls the entire taxonomy that jobs and candidates reference.

### 6.1 Categories

**List:** `GET /api/v1/admin/categories` — same as public endpoint but admin sees inactive ones too

**Create:** `POST /api/v1/admin/categories`
```json
{
  "name": "Cybersecurity",
  "icon": "Shield",
  "description": "Security engineering, pentesting, compliance",
  "display_order": 10
}
```
Slug is auto-generated from name.

**Update:** `PUT /api/v1/admin/categories/:id`
- Changing name does NOT auto-update the slug (slug is immutable after creation)
- Can update: name, icon, description, display_order, is_active

**Delete:** `DELETE /api/v1/admin/categories/:id`
- Only allowed if no active jobs reference it → 409 if in use

### 6.2 Skills

**List:** `GET /api/v1/admin/skills`
**Query params:** `category_id`, `search`, `page`

**Create:** `POST /api/v1/admin/skills`
```json
{ "name": "Nuxt.js", "category_id": "uuid" }
```
Slug auto-generated.

**Update:** `PUT /api/v1/admin/skills/:id`
Can update name, category_id, is_active. Can re-categorize a skill.

**Delete:** `DELETE /api/v1/admin/skills/:id`
Only if skill is not linked to any active job or candidate profile → 409 if in use.

**UI:** Two sub-tabs inside a Taxonomy screen — Categories and Skills. Skills list shows which category each belongs to. Create/edit open a side panel or modal.

---

## 7. Reports

Users can flag jobs, reviews, employers, or other users. Admin manages this queue.

### 7.1 List Reports
**Endpoint:** `GET /api/v1/admin/reports`
**Query params:** `status` (pending/investigating/resolved/dismissed), `target_type` (job/review/user/employer), `page`

**Each report includes:** reporter name, target type and id, reason, details, status, submitted_at

### 7.2 Update Report Status
**Endpoint:** `PATCH /api/v1/admin/reports/:id`
**Payload:** `{ status: "resolved", resolution_notes: "Job was taken down." }`

Status options: pending, investigating, resolved, dismissed

**UI:** Reports list with status filter. Each row shows the reason and a link to the reported content. Clicking opens a detail panel with the full report and a status update form.

---

## 8. Notifications

Admin receives in-app notifications for:
- New company review submitted (for moderation queue awareness)

### 8.1 List Notifications
**Endpoint:** `GET /api/v1/notifications`

### 8.2 Unread Count
**Endpoint:** `GET /api/v1/notifications/unread-count`

### 8.3 Mark as Read / Mark All Read
**Endpoints:** `PATCH /api/v1/notifications/:id/read`, `PATCH /api/v1/notifications/read-all`

---

## 9. Screens Summary

| Screen | Route | Endpoint(s) |
|---|---|---|
| Login | `/auth/login` | POST /auth/login |
| Dashboard | `/admin/dashboard` | GET /admin/dashboard |
| User List | `/admin/users` | GET /admin/users |
| User Detail | `/admin/users/:id` | GET /admin/users/:id + PATCH status |
| Job List | `/admin/jobs` | GET /admin/jobs |
| Job Detail | `/admin/jobs/:id` | GET /admin/jobs/:id + PATCH status + DELETE |
| Create Job (behalf) | `/admin/jobs/create` | POST /admin/jobs |
| Review Queue | `/admin/reviews` | GET /admin/reviews + PATCH approve/reject |
| Categories | `/admin/taxonomy/categories` | GET+POST+PUT+DELETE /admin/categories |
| Skills | `/admin/taxonomy/skills` | GET+POST+PUT+DELETE /admin/skills |
| Reports | `/admin/reports` | GET /admin/reports + PATCH /admin/reports/:id |
| Notifications | `/admin/notifications` | GET+PATCH /notifications |

---

## 10. Key Business Rules for Frontend

- Admin accounts are created via seeder only. There is no registration flow for admins.
- Admin cannot deactivate another admin — show this action as disabled/hidden when viewing an admin user.
- The reject job action always requires a reason. Make the reason field required in the reject modal and do not allow submission without it.
- Category and skill slugs are immutable after creation. The edit form should not expose the slug as an editable field.
- Deleting a category or skill that is in use returns 409. Show the error message from the API response to the admin.
- Hard-deleting a job (admin only) does not delete applications. Candidate applications preserve all data via snapshots.
- The dashboard stats are a snapshot — they should refresh on mount but do not need real-time polling.
- All admin list endpoints are paginated. Never load all records at once. Implement paginated tables with filter controls.
- Admin can set job status to any value directly — they are not bound by the transition map that employers follow.
- Review approval recalculates the employer's `average_rating` and `total_reviews` on the backend. The frontend does not need to calculate these — just refetch the employer data after approval if displaying it.
- Notification bell in the admin header uses the same endpoint as candidate and employer (`GET /api/v1/notifications/unread-count`).
