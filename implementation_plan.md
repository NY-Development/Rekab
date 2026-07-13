# NYDL Production Implementation & Verification Plan

## IMPORTANT NOTE

Before starting, carefully read this entire document.

### Development Environment

- The **backend**, **nydl-admin**, and **nydl-web** applications are **already running** on my machine.
- **Do NOT start or restart** any development servers (`npm run dev`, `pnpm dev`, `yarn dev`, etc.).
- I will continuously test the applications manually while you implement the requested changes.
- If a server restart becomes absolutely necessary due to a configuration change, clearly explain why before doing so.

### Allowed Commands

You may freely run commands that help verify or improve the codebase, including but not limited to:

- `tsc`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run test`
- `npm audit`
- `eslint`
- `prettier`
- dependency analysis
- static code analysis
- file searching
- repository inspection

Feel free to execute any non-destructive commands required to validate the implementation.

---

# OBJECTIVE

Your objective is **NOT** to redesign the application.

Your objective is to verify, complete, improve, optimize, and productionize the entire NYDL repository according to the plan below starting at #NYDL Production Audit.

The repository consists of three major applications:

- Backend
- NYDL Admin
- NYDL Web

Your goal is to ensure that the entire ecosystem works together as one production-ready Learning Management System.

Always prefer fixing problems over simply reporting them.

Do not leave TODOs.

Do not leave placeholders.

Continue until every major issue has been resolved.

---

# NYDL Production Audit

You are acting as a Senior Staff Software Engineer performing a production readiness audit.

Your task is NOT to explain architecture.

Your task is to inspect the entire repository and verify that NYDL has been implemented correctly.

Work through the project module by module.

Do not skip anything.

---

# PHASE 1

Repository Inspection

Inspect

/backend

/nydl-admin

/nydl-web

/Design

Understand the entire system before making changes.

---

# PHASE 2

Backend Verification

Verify

Authentication

Users

Students

Courses

Modules

Lessons

Assignments

Announcements

Sessions

Resources

Certificates

Badges

Payments

Notifications

Analytics

Progress

Teams

Cohorts

Settings

Everything.

Check

controllers

services

repositories

middlewares

validation

routes

DTOs

database models

API consistency

pagination

sorting

filtering

permissions

---

# PHASE 3

Admin Verification

Verify every admin page.

Check

Dashboard

Users

Students

Mentors

Courses

Curriculum

Enrollments

Attendance

Assignments

Resources

Announcements

Payments

Notifications

Certificates

Analytics

Audit Logs

Risk Students

Settings

Every page must

Read

Create

Update

Delete

using backend APIs.

No mocked data.

---

# PHASE 4

Student Platform Verification

Verify

Landing

Authentication

Dashboard

Courses

Course Detail

Assignments

Resources

Announcements

Notifications

Sessions

Profile

Settings

Progress

Certificates

Badges

Everything.

Every page must consume backend APIs.

No placeholders.

---

# PHASE 5

Data Flow Verification

Verify

Admin creates Course

↓

Backend saves Course

↓

Student sees Course

Verify the same flow for

Announcements

Assignments

Resources

Sessions

Certificates

Notifications

Progress

Everything.

If any data is mocked

Replace it.

---

# PHASE 6

Design Verification

Design references are inside

/Design

Inspect every design.

Ensure

Spacing

Typography

Icons

Layouts

Cards

Sidebar

Navigation

Forms

Tables

Charts

Colors

Animations

match the designs.

Do NOT invent your own UI.

Use the project's CSS variables already defined in

index.css

Never hardcode colors.

---

# PHASE 7

Assets

Replace every placeholder.

Use

public/logo.*

public/preview.png

public/favicon.*

Use project branding everywhere.

Remove

vite.svg

placeholder logos

default icons

---

# PHASE 8

React Architecture

Verify

TanStack Router

TanStack Query

Axios

Zustand

Providers

Layouts

Hooks

Store

Services

Utils

Types

API

Features

Everything follows architecture.

No page should directly call axios.

Every API call belongs in

api/

Every API should have

typed hook

inside hooks.

---

# PHASE 9

Performance

Check

memoization

query invalidation

lazy loading

route splitting

image optimization

bundle size

duplicate renders

cache strategy

prefetching

pagination

infinite scroll where appropriate.

---

# PHASE 10

Accessibility

Verify

Keyboard navigation

ARIA

Labels

Color contrast

Focus state

Screen reader support

Semantic HTML

---

# PHASE 11

Production Readiness

Remove

Unused code

Unused imports

Duplicate code

Magic strings

TODO

console.log

Temporary comments

Mock data

Test components

Dead components

Everything should be production quality.

---

# PHASE 12

Testing

Automatically inspect every backend endpoint.

Generate either

1. Postman Collection

OR

2. Bruno Collection

OR

3. REST Client

containing every endpoint.

Group endpoints by module.

Include

Authentication

Students

Courses

Assignments

Resources

Announcements

Certificates

Payments

Notifications

Analytics

Settings

Everything.

Also validate

Request body

Response

Authorization

Error handling

Status codes

---

# PHASE 13

Bug Fixing

Whenever you discover a problem

Fix it immediately.

Do not simply report it.

After fixing

Continue auditing.

Repeat until repository is production ready.

---

# FINAL OUTPUT

Produce

1.

Architecture Report

2.

Files Modified

3.

Issues Fixed

4.

Remaining Recommendations

5.

Production Readiness Score

for

Backend

Admin

Student Platform

Overall Repository

Continue until every critical issue has been resolved.


