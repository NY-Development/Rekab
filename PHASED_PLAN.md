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

## Phase 4 — Admin overhaul (Section 2) — CORE SLICE DONE
- [x] Responsive layout, collapsible sidebar (persisted), mobile drawer, token-based shell so theme toggle affects the whole chrome — `AdminLayout`
- [x] Row-click detail infra: `DataTable` `onRowClick` + reusable generic `RowDetailDialog`; wired into Students & Users (+ Registrations already had a rich dialog)
- [x] Payment verifications in payments tab (already present: verify/fail + StatusBadge)
- [x] Registration statuses: stat cards (total / new-3-days / paid / pending / unsuccessful) + "New This Week" (last 3 days) section on Registrations
- [x] Consolidate Mentors into Instructors — removed Mentors nav item (route kept)
- [ ] REMAINING: token-convert the ~24 feature pages so LIGHT mode is cohesive (dark already is); row-click detail on Instructors/Courses/Cohorts; session detail → attendance (see Phase 7)

## Phase 5 — Team management drag-drop (Section 3) — DONE
- [x] Backend `GET /cohorts/:id/roster` → `{ cohort, students (populated), teams }`, gated by `assertCohortAccess` (admin + assigned instructor); `CohortService.getRoster`; team `addMember`/`removeMember` already existed.
- [x] `TeamBoard` drag-and-drop component (native HTML5 DnD, no new dep): Unassigned pool + one column per team; drag = removeMember(old)+addMember(new); inline "Create Team" (auto teamCode). Built for both apps (admin dark, nydl-web token-based).
- [x] Admin `TeamsPage`: cohort selector → board + all-teams table below.
- [x] nydl-web `TeamPage`: staff (instructor/admin) get `StaffTeamManager` (cohort selector filtered to `cohort.instructors` for instructors) + board; students keep the `MyTeamView`.

## Phase 6 — Certificates (Section 2) — DONE (blocked only by Cloudinary account)
- [x] Admin uploads template image/PDF → `POST /certificates/template` (multer→Cloudinary) → hosted URL
- [x] Overlay name/course/batch with **pdf-lib** — `services/certificateGenerator.service.ts` (template becomes full-page bg; centered text at configurable %-positions; DEFAULT_LAYOUT). Verified: produces a valid `%PDF` locally.
- [x] `POST /certificates/generate` { templateUrl, courseId, cohortId, batch, studentIds[] } → `CertificateService.generateBatch` → per-student PDF → Cloudinary → Certificate record (metadata: studentName/courseTitle/batch)
- [x] Admin CertificatesPage: template upload dropzone + course/cohort select + roster checkbox list (`GET /cohorts/:id/roster`) + Generate; issued table shows View link
- [x] Student portal: nydl-web `/certificates` page + nav (Award, student-only) + `GET /certificates/me` → cards with Download/View
- ⚠️ **BLOCKER (infra, not code):** Cloudinary account `dmylzrvse` returns **403 on ALL uploads** (verified with the SDK directly — even a 1-level image upload). This breaks cert template upload + generation, AND resource-file / session-recording uploads. Fix: rotate/verify the Cloudinary API secret or check the account is active/within quota, then set CLOUDINARY_* in backend/.env.

## Phase 7 — Attendance (Section 4) — DONE (verified live end-to-end)
- [x] Click-based join tracking — `POST /attendance/join` (student); recorded PRESENT/source=CLICK; the SessionsPage "Join Meet" link fires it fire-and-forget. A later report never gets downgraded by a click; a click is upgraded to IMPORT by a report.
- [x] Instructor CSV/XLSX upload — `POST /attendance/session/:id/import` (multer memory + `xlsx`), robust column/duration parser (`45 min`, `1:05:00`, `1h 5m`, bare minutes), matched by email→name; presence vs session length: ≥80% PRESENT, >20% PARTIAL, else ABSENT. Attendance model/type gained PARTIAL, durationSeconds, presenceRatio, source; enrollmentId now optional.
- [x] Scope — `getSessionAttendance` now `assertSessionCohortAccess`: admin any, instructor only assigned cohorts (verified: unassigned instructor → 403).
- [x] Google Reports API — `services/googleMeetAttendance.service.ts` scaffolded, inert unless GOOGLE_SA_EMAIL/GOOGLE_SA_PRIVATE_KEY/GOOGLE_ADMIN_EMAIL set (documents the exact setup + scope). **Needs a paid Education/Enterprise Workspace to enable.**
- [x] UI — nydl-web instructor `AttendanceModal` (upload report + present/partial/absent summary + per-student list); admin AttendancePage gained Duration + Source columns.
- Verified live: click→PRESENT/CLICK; XLSX import 92%→PRESENT, 33%→PARTIAL, 8%→ABSENT, unmatched row skipped; click upgraded to IMPORT; unassigned instructor 403.

## Decisions locked in
- Email: Brevo SMTP via nodemailer (SMTP_* + SENDER_EMAIL in backend/.env).
- Attendance: click-tracking + instructor file upload now; Google Reports API scaffolded, inert until paid Workspace tier.
- Instructor == Mentor (same thing).
