# NYDL (NYDev Learning)

## Project Overview

NYDL (NYDev Learning) is a modern LMS (Learning Management System) focused on online software engineering education.

It is NOT just another course website.

The platform is designed to manage the entire learning lifecycle:

- Student Registration
- Authentication
- Cohorts
- Teams
- Courses
- Modules
- Lessons
- Live Sessions
- Assignments
- Resources
- Certificates
- Badges
- Announcements
- Notifications
- Progress Tracking
- Payments
- Analytics
- Internship Pipeline
- Community

The platform follows a production-ready enterprise architecture.

---

# Repository Structure

Root contains

/backend
/nydl-admin
/nydl-web
/Design

Design folder contains the UI references.

Both React applications MUST follow the Design folder.

Never invent a different UI.

Always implement according to those designs.

---

# Frontend Architecture

Both React applications use

React
Vite
TypeScript
TanStack Router
TanStack Query
Tailwind CSS
Zustand
Axios

Production architecture

src/

api/
hooks/
store/
components/
features/
routes/
layouts/
providers/
services/
utils/
types/
lib/
constants/
contexts/

Business logic belongs inside

features/

API calls belong inside

api/

Never fetch directly inside pages.

Always use custom hooks.

Example

Course Page

↓

useCourses()

↓

courses.api.ts

↓

backend

---

# State Management

Use

TanStack Query

for

Server State

Use

Zustand

for

Global UI State

Examples

Theme

Sidebar

User

Notifications

Filters

Selected Course

Never duplicate state.

---

# API Layer

Every backend endpoint must have

typed

api wrapper

inside

api/

Example

courses.api.ts

students.api.ts

analytics.api.ts

assignments.api.ts

etc

No page should ever call axios directly.

---

# Styling Rules

Colors

Typography

Spacing

Radius

Shadows

Animations

must come from

index.css

Do NOT invent custom colors.

Do NOT hardcode theme values.

Always use the design tokens already defined.

---

# Assets

Both apps contain

public/

logos

preview image

icons

Use those assets.

Never reference placeholders.

Never reference vite.svg.

Replace every placeholder.

---

# Forms

Use

React Hook Form

+

Zod

for validation.

Never build uncontrolled production forms.

---

# Tables

Use

TanStack Table

where appropriate.

---

# Loading

Every page must have

Loading

Empty

Error

Success

states.

---

# Error Handling

All API calls must have

retry logic

toast

typed errors

loading state

No silent failures.

---

# Authentication

Authentication is JWT based.

Support

Email Login

GitHub OAuth

GitHub login is currently optional.

Architecture must support switching GitHub to mandatory later.

Never tightly couple authentication.

---

# File Uploads

Assignments

Profile Pictures

Resources

must support upload.

---

# Student Platform

Student app must consume backend data only.

Nothing should be hardcoded.

Everything shown should originate from backend APIs.

Examples

Courses

Announcements

Assignments

Sessions

Resources

Notifications

Progress

Certificates

Badges

Profile

Everything should reflect backend data.

---

# Admin Platform

Admin is the source of truth.

When admin creates

Course

↓

backend stores it

↓

student immediately sees it

Same applies to

Announcements

Assignments

Resources

Sessions

Payments

Certificates

Notifications

Everything.

No duplicated mock data.

---

# Components

Reusable components belong inside

components/

Never duplicate UI.

---

# Production Readiness

Prefer

Reusable

Composable

Typed

Maintainable

Testable

Architecture.

Avoid

Magic strings

Duplicate logic

Inline API calls

Hardcoded values

Unused files

Dead code

---

# Code Quality

Strict TypeScript

No any

No console.log

No TODO

No placeholder text

No fake data

No unused imports

No commented code

No duplicate components

Production quality only.