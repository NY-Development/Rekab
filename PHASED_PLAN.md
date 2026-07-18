# NYDL — Phased Implementation Plan

Active batch concept: **Summer 2026**. A **cohort** = the entire student body for a
course in a batch (one per course per batch, unbounded). A **team** = a small 3–6
student subset *inside* a cohort, for group projects.

## Phase 1 — Foundation ✅ DONE
- [x] **I. Cohort/Team model** — batch-wide cohort (one per course per batch, "Summer 2026"); team = small group. Reworked provisioning (`ensureCourseCohort`), `resolveCohortId`, payment cohort-add, seeder; migrated 32 mini-cohorts → 8 batch cohorts.
- [x] **4a. Merge Instructor & Mentor** — `effectiveRole()` maps MENTOR→INSTRUCTOR in RBAC; `getContentScope` routes mentor to instructor scope; frontend `isStaffRole`.
- [x] **II. Payment verification** — fixed a latent bug that broke ALL payments (repo populates studentId/courseId/cohortId; code did `.toString()` on the populated objects → ownership check always failed with a 500). Now uses `refId()`. Added settlement-account config (school CBE `1000403196928`) so Verify.ET gets the required 8-digit CBE suffix; admin-verify also activates + adds to cohort.
- [x] **6. Helper contact button** — `SupportContactModal` on registration header + payment step (nydevofficial@gmail.com, 0902142767).
- [x] **5. Session-expiry notice** — both apps: `SessionExpiryNotice` banner at ≤2 min + Refresh button (rotates token via refresh cookie).

## Phase 2 — Student pages + dark mode ✅ DONE
- [x] Privacy Policy page (`/privacy`) + Terms of Service (`/terms`) — token-based, NYDL-specific, shared `LegalDocument` shell; footer links wired.
- [x] Refined, searchable Help Center with accurate NYDL FAQs + support CTA.
- [x] Fixed Teams page — added backend `GET /teams/my-team` (was hitting `/:id` → cast error); now shows populated member names/avatars, leader, instructor, cohort.
- [x] Fixed Progress page — was rendering populated `courseId` object as "[object Object]"; now shows course title, real stats, tokens.
- [x] Dark-mode conversions to index.css tokens: help, about, contact, teams, progress, assignments, resources, sessions, announcements (dashboard was already token-based).

## Phase 3 — Notifications infrastructure ✅ DONE
- [x] Nodemailer + Brevo SMTP service (`services/email.service.ts`, cached transporter, HTML template, graceful no-SMTP fallback). **SMTP connectivity verified live.**
- [x] `services/adminNotify.service.ts` — `notifyAdmins()` fans an in-app Notification out to every admin + one email to all admin addresses (never throws). Verified fan-out (0→2 for 2 admins).
- [x] Email + in-app notification to admins on **new registration** (name, email, phone, gender, DOB, school, grade, location, tech readiness, course, batch, cohort; team = not yet assigned) — wired in `enrollmentService.apply()`.
- [x] **Contact module** (`modules/contacts`) — public `POST /contacts` (optionalAuth attaches identity), admin `GET /contacts`, `/contacts/unread-count`, `PATCH /:id/handled`; each submission notifies + emails admins.
- [x] nydl-web ContactPage now actually submits to `POST /contacts`.
- [x] nydl-admin **Support Inbox** page + route + nav item, plus a header **bell badge** (`NotificationBell`) showing the unhandled-contact count.
- [x] Added `optionalAuth` middleware; extended `env.ts` with SMTP/SENDER/ADMIN_NOTIFY config.
- Note: admin's existing Notifications page already lists the fanned-out in-app notifications.

## Phase 4 — Admin overhaul (Section 2)
- [ ] Responsive layout, collapsible sidebar, working theme toggle (per Design/NYDL/admin)
- [ ] Row-click detail views (users, students, courses, cohorts, instructors, mentors, …)
- [ ] Payment verifications in payments tab
- [ ] Session detail: start/status/end/instructor/student count → attendance
- [ ] Registration statuses: paid / unsuccessful / pending
- [ ] Consolidate Mentors into Instructors

## Phase 5 — Team management drag-drop (Section 3)
- [ ] Per Design/NYDL/admin/team_management_admin
- [ ] Admin + instructor (nydl-web) drag students within a cohort into teams

## Phase 6 — Certificates (Section 2)
- [ ] Admin uploads template image/PDF
- [ ] Overlay name/course/batch (pdf-lib)
- [ ] Checkbox-select students → appears in their certificate portal

## Phase 7 — Attendance (Section 4)
- [ ] Click-based join tracking
- [ ] Instructor-uploaded attendance file (CSV/XLSX) merge → present/partial/absent
- [ ] Admin sees all logs; instructor sees only assigned courses
- [ ] Google Reports API scaffolded behind env config (inert until paid Workspace)

## Decisions locked in
- Email: Brevo SMTP via nodemailer (SMTP_* + SENDER_EMAIL in backend/.env).
- Attendance: click-tracking + instructor file upload now; Google Reports API scaffolded, inert until paid Workspace tier.
- Instructor == Mentor (same thing).
