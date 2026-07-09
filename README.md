# NYDEV Learning (NYDL)

NYDEV Learning (NYDL) is a modern, cohort-based EdTech SaaS platform designed to manage the full student lifecycle—from enrollment and cohort management to performance tracking and live class coordination.

## 🚀 Overview

NYDL is built to act as a central "learning operations" hub. It combines the clarity of Notion, the data-centric design of Stripe dashboards, and the community structure of Discord to provide a high-accountability learning environment.

## 🏗 Architecture

NYDL follows a monorepo-style structure, separating the frontend learning experience from the backend operations engine.

```text
root/
├── frontend/          # React + Vite + Shadcn/ui (Student & Admin Portals)
└── backend/           # Node.js + Express + TypeScript + MongoDB (API Engine)

```

## 🛠 Tech Stack

* **Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn/ui, TanStack Query, TanStack Table.
* **Backend**: Node.js, Express, TypeScript, Mongoose (MongoDB).
* **Infrastructure**: Versioned API (`/api/v1`), structured middleware for security (Helmet, CORS).

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+)
* MongoDB (local or Atlas instance)
* npm or yarn

### Installation & Local Development

#### 1. Setup Backend

```bash
cd backend
npm install
# Create a .env file based on your environment needs
npm run dev

```

#### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev

```

## 📂 Key Folders & Structure

### Backend (`/backend/src`)

* `controllers/`: Logic for handling HTTP requests.
* `dtos/`: Data Transfer Objects for strict type checking.
* `models/`: Mongoose schemas defining our MongoDB data structure.
* `repositories/`: Database-level abstraction layer.
* `routes/`: API endpoint definitions (versioned as `/api/v1`).
* `services/`: Business logic layer.
* `validators/`: Request body validation (Joi/Zod).

## 🔐 API Versioning

NYDL utilizes versioned endpoints to ensure stability as the platform scales.

* **Current Version**: `v1`
* **Waitlist Endpoint**: `POST /api/v1/waitlist/join`

## ⚙️ Configuration

The system relies on the following environment variables (defined in `.env`):

* `PORT`: Port for the API server.
* `MONGO_URI`: Connection string for your MongoDB database.
* `CLIENT_URL`: Trusted origin for CORS settings.

## 📈 Roadmap / Future Scope

* [ ] **Admin Dashboard**: Implementation of TanStack Table for student/cohort management.
* [ ] **Auth System**: Role-based access control (Student/Instructor/Admin).
* [ ] **Integrations**: Discord and Google Meet API connectors.
* [ ] **Risk Analytics**: Automated tracking for "At-Risk" students based on attendance and assignment data.

## 📝 License

This project is proprietary software developed for NYDEV Learning.
