# 🚀 ClinicFlow Backend

A scalable **clinic management SaaS backend** built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

---

## 🏥 Overview

ClinicFlow is a production-ready backend system that supports:

- 🔐 JWT Authentication (Access + Refresh Tokens)
- 🏥 Clinic onboarding & verification
- 🩺 Doctor management system
- 📅 Smart slot-based appointment booking
- 📊 Role-based dashboards (Admin / Doctor / Patient)
- 🔍 Public doctor search (Marketplace-ready)
- ⚡ Race-condition safe booking

---

## ⚙️ Tech Stack

- **Backend:** Node.js + Express + TypeScript  
- **Database:** PostgreSQL  
- **ORM:** Prisma  
- **Auth:** JWT (Access + Refresh)  
- **Architecture:** Modular (Feature-based)

---

## 🚀 Getting Started

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Swapnil0717/ClinicFlow.git
cd clinicflow-backend
npm install
2️⃣ Environment Setup
cp .env.example .env

Update .env:

DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
EMAIL_USER=
EMAIL_PASS=
CLIENT_URL=
3️⃣ Database Setup
npx prisma migrate dev
npx prisma generate
4️⃣ Run Server
npm run dev
🌐 Base URL
http://localhost:5000/api/v1
🔐 AUTH APIs
Register

POST /auth/register

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "PATIENT"
}
Login

POST /auth/login

{
  "email": "john@example.com",
  "password": "123456"
}
Google Login

POST /auth/google

{
  "idToken": "GOOGLE_ID_TOKEN"
}
Verify Email

GET /auth/verify-email?token=TOKEN

Forgot Password

POST /auth/forgot-password

{
  "email": "john@example.com"
}
Reset Password

POST /auth/reset-password

{
  "token": "RESET_TOKEN",
  "newPassword": "123456"
}
Refresh Token

POST /auth/refresh

{
  "refreshToken": "REFRESH_TOKEN"
}
Logout

POST /auth/logout

Get Current User

GET /auth/me

🏥 CLINIC APIs
Create Clinic

POST /clinics
🔒 Role: PATIENT

{
  "name": "City Care Clinic",
  "address": "Pune",
  "phone": "9999999999"
}
Get My Clinic

GET /clinics/me

Verify Clinic

PATCH /clinics/verify/:id

👨‍⚕️ DOCTOR APIs
Create Doctor

POST /doctors
🔒 ADMIN

{
  "name": "Dr. Smith",
  "specialization": "Cardiologist",
  "experience": 5,
  "clinicId": "CLINIC_ID"
}
Get All Doctors

GET /doctors

Get Doctor By ID

GET /doctors/:id

Pending Doctors

GET /doctors/pending

Verify Doctor

PATCH /doctors/verify/:id

Reject Doctor

PATCH /doctors/reject/:id

{
  "reason": "Invalid documents"
}
👑 ADMIN APIs
Pending Clinics

GET /admin/pending-clinics

Pending Doctors

GET /admin/pending-doctors

Verify Clinic

PATCH /admin/verify-clinic/:id

Verify Doctor

PATCH /admin/verify-doctor/:id

Reject Clinic

PATCH /admin/reject-clinic/:id

{
  "reason": "Incomplete documents"
}
Become Admin

POST /admin/become

📅 APPOINTMENTS
Book Appointment

POST /appointments/book
🔒 PATIENT

{
  "subSlotId": "SUB_SLOT_ID"
}
Patient Appointments

GET /appointments/patient

Doctor Appointments

GET /appointments/doctor

Cancel Appointment (Patient)

PATCH /appointments/cancel/:appointmentId

Cancel Appointment (Doctor)

PATCH /appointments/doctor/cancel/:appointmentId

⏱ SLOT APIs
Create Custom Slot

POST /slots/custom

{
  "date": "2026-04-01",
  "startTime": "10:00",
  "endTime": "12:00",
  "slotDuration": 30
}
Create Recurring Slot

POST /slots/recurring

{
  "daysOfWeek": ["MONDAY", "WEDNESDAY"],
  "startTime": "10:00",
  "endTime": "12:00",
  "slotDuration": 30
}
Get Available Slots

GET /slots/:doctorId?clinicId=CLINIC_ID&date=YYYY-MM-DD

🔍 SEARCH APIs
Search Doctors

GET /search/doctors?clinicId=CLINIC_ID&specialization=cardiologist

📊 DASHBOARD APIs
Doctor Dashboard

GET /dashboard/doctor

Patient Dashboard

GET /dashboard/patient

Clinic Dashboard

GET /dashboard/clinic

🔐 Authorization

All protected routes require:

Authorization: Bearer YOUR_ACCESS_TOKEN
🧠 Architecture Highlights
⚡ Race-condition safe booking (Prisma transactions)
🧩 Modular architecture (feature-based)
🔐 Role-based access control (RBAC)
📅 Sub-slot booking precision
🌍 Marketplace-ready doctor search
📁 Project Structure
src/
├── modules/
│   ├── auth
│   ├── clinic
│   ├── doctor
│   ├── appointment
│   ├── slot
│   ├── dashboard
│   ├── admin
│   ├── search
├── middleware/
├── utils/
├── config/
📌 Future Improvements
Pagination & filtering
Email/SMS notifications
Payment integration (Stripe/Razorpay)
Swagger/OpenAPI docs
Rate limiting & security hardening
Docker support
👨‍💻 Author

Pranav Pathare

⭐ Support

If you like this project:

⭐ Star the repo
🍴 Fork it
🚀 Build on top of it
