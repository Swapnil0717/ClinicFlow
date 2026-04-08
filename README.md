# 🚀 ClinicFlow – Clinic Management & Appointment Booking Backend

A **production-ready backend system** designed for managing clinics, doctors, patients, and appointment workflows with **high precision scheduling and role-based access control (RBAC)**.

This project demonstrates **scalable backend architecture, secure authentication, concurrency-safe booking, and real-world healthcare workflow implementation**.

---

## 📌 Overview

ClinicFlow simulates a **real-world clinic management system** where different users interact based on their roles:

- Manage clinics and onboarding workflows  
- Handle doctor verification and approvals  
- Enable patients to book appointments seamlessly  
- Prevent double bookings using concurrency-safe logic  
- Provide role-based dashboards and analytics  

---

## ✨ Core Features

### 🔐 Authentication & Security

- JWT-based authentication (Access + Refresh tokens)  
- Secure token lifecycle (expiry & refresh flow)  
- Google OAuth login support  
- Email verification & password reset  
- Protected routes using middleware  

---

### 👥 Role-Based Access Control (RBAC)

| Role    | Capabilities                                  |
| ------- | --------------------------------------------- |
| Patient | Book appointments, manage clinic              |
| Doctor  | Manage appointments & availability            |
| Admin   | Verify clinics, approve doctors, full control |

**✔ Enforced at:**

- Route level (middleware)  
- Service level (business logic restrictions)  

---

### 🏥 Clinic & Doctor Management

- Clinic onboarding & verification system  
- Doctor creation, approval, and rejection workflow  
- Admin-controlled verification system  
- Public doctor listing (marketplace-ready)  

---

### 📅 Appointment Booking System

- Slot-based appointment booking  
- High precision scheduling system  
- Concurrency-safe booking using DB transactions  
- Prevents double booking scenarios  
- Appointment cancellation (Patient & Doctor)  

---

### ⏱️ Slot Management System

- Custom slot creation  
- Recurring slot generation  
- Fine-grained time-slot handling  
- Dynamic availability tracking  

---

### 🔍 Search & Marketplace

- Public doctor discovery system  
- Search doctors by filters  
- Scalable marketplace-ready architecture  

---

### 📊 Dashboard System

- Doctor dashboard (appointments & schedule)  
- Patient dashboard (bookings & history)  
- Clinic dashboard (operations overview)  

---

### ✅ Validation & Error Handling

- Centralized validation system  
- Consistent API response structure  
- Proper HTTP status codes  
- Clean error handling middleware  

---

## 🏗️ Tech Stack

- **Node.js + Express**  
- **TypeScript**  
- **PostgreSQL**  
- **Prisma ORM**  
- **JWT Authentication**  
- **Zod (Validation)**  
- **Redis (Caching - Optional)**  
- **Docker (Containerization)**  
- **AWS / Cloud Deployment Ready**  

---

## 📂 Project Structure


src/
│
├── config/ # Env, DB, and app configuration
├── middleware/ # Auth, RBAC, validation, error handling
├── modules/
│ ├── auth/ # Authentication logic
│ ├── clinic/ # Clinic management
│ ├── doctor/ # Doctor workflows
│ ├── appointment/# Booking system
│ ├── slot/ # Slot management
│ ├── dashboard/ # Role-based dashboards
│ ├── admin/ # Admin operations
│ ├── search/ # Doctor search system
│
├── utils/ # Helpers (JWT, hashing, etc.)
├── routes/ # Route registration
└── server.ts # Entry point


---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Swapnil0717/ClinicFlow.git
cd clinicflow-backend
2️⃣ Install Dependencies
npm install
3️⃣ Setup Environment Variables

Create .env file:

PORT=5000
DATABASE_URL=your_postgres_url

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

EMAIL_USER=your_email
EMAIL_PASS=your_password

CLIENT_URL=http://localhost:3000
4️⃣ Run Database Migrations
npx prisma migrate dev
npx prisma generate
5️⃣ Start Development Server
npm run dev

Server runs at:

http://localhost:5000/api/v1
🔑 API Overview
🔐 Auth
Method	Endpoint
POST	/auth/register
POST	/auth/login
POST	/auth/google
GET	/auth/verify-email
POST	/auth/forgot-password
POST	/auth/reset-password
POST	/auth/refresh
POST	/auth/logout
GET	/auth/me
🏥 Clinics
Method	Endpoint
POST	/clinics
GET	/clinics/me
PATCH	/clinics/verify/:id
👨‍⚕️ Doctors
Method	Endpoint
POST	/doctors
GET	/doctors
GET	/doctors/:id
GET	/doctors/pending
PATCH	/doctors/verify/:id
PATCH	/doctors/reject/:id
📅 Appointments
Method	Endpoint
POST	/appointments/book
GET	/appointments/patient
GET	/appointments/doctor
PATCH	/appointments/cancel/:id
PATCH	/appointments/doctor/cancel/:id
⏱️ Slots
Method	Endpoint
POST	/slots/custom
POST	/slots/recurring
GET	/slots/:doctorId
🔍 Search
Method	Endpoint
GET	/search/doctors
📊 Dashboard
Method	Endpoint
GET	/dashboard/doctor
GET	/dashboard/patient
GET	/dashboard/clinic
⚙️ Admin
Method	Endpoint
GET	/admin/pending-clinics
GET	/admin/pending-doctors
PATCH	/admin/verify-clinic/:id
PATCH	/admin/verify-doctor/:id
PATCH	/admin/reject-clinic/:id
POST	/admin/become
🔐 Access Control Summary
Action	Patient	Doctor	Admin
Book appointment	✅	❌	✅
View appointments	✅ (own)	✅ (own)	✅
Manage slots	❌	✅	✅
Manage doctors	❌	❌	✅
Verify clinics	❌	❌	✅
Access dashboards	✅	✅	✅
🧪 Example Requests
Book Appointment
POST /appointments/book

{
  "doctorId": "123",
  "slotId": "456",
  "date": "2026-04-10"
}
Get Available Slots
GET /slots/:doctorId
🧠 Design Decisions
Concurrency-safe booking (DB transactions) → prevents double bookings
RBAC enforced at service layer → prevents unauthorized access
Modular architecture → scalable and maintainable
Slot-based system → precise scheduling control
Verification workflows → ensures trusted platform usage
Marketplace-ready search → supports scaling
⚠️ Assumptions
Only verified doctors can accept appointments
Clinics must be approved before becoming active
Patients can only manage their own bookings
Admin has full control over verification workflows
Slots define availability and prevent conflicts
🚀 Additional Enhancements
Redis caching for performance optimization
Rate limiting & API security
Email & SMS notifications
Payment integration (Stripe / Razorpay)
Swagger / OpenAPI documentation
Docker + CI/CD pipeline
👨‍💻 Author

Pranav Pathare (Swapnil0717)

⭐ If you found this useful, consider starring the repo!


---

### 🔥 Tip
When you paste this into GitHub:
- It will **auto-render perfectly**
- Tables + emojis + spacing = **clean professional look**
- This is already **ATS + recruiter optimized**

---

If you want next level:
👉 I can add **badges (build, license, tech stack)**  
👉 Or a **system design diagram (huge impact for FAANG)**
