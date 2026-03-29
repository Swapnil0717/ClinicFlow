# 🏥 ClinicFlow Backend

A scalable clinic management backend built with Node.js, Express, Prisma, and PostgreSQL.

---

## 🚀 Features

- 🔐 JWT Authentication (Access + Refresh)
- 📧 Email Verification & Password Reset
- 🏥 Clinic Approval System (Admin controlled)
- 🩺 Doctor Verification & Rejection
- 📅 Advanced Slot & SubSlot System
- ⚡ Race-condition safe appointment booking
- ❌ Appointment cancellation (Patient & Doctor)
- 🔑 Role-based Access Control (ADMIN / DOCTOR / PATIENT)

---

## 🛠 Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Auth
- Nodemailer

---

## 📦 Setup

```bash
git clone https://github.com/your-username/clinicflow-backend.git
cd clinicflow-backend
npm install

⚙️ Environment Setup
cp .env.example .env

Update .env with your values.

🗄 Database Setup
npx prisma migrate dev
npx prisma generate
▶️ Run Server
npm run dev

Server runs on:

http://localhost:5000
🔐 API Base URL
http://localhost:5000/api/v1
📬 API Highlights
Auth
POST /auth/register
POST /auth/login
GET /auth/verify-email
POST /auth/forgot-password
POST /auth/reset-password
Admin
PATCH /admin/clinic/verify/:clinicId
PATCH /admin/doctor/verify/:doctorId
Appointments
POST /appointments/book
GET /appointments/patient
GET /appointments/doctor
PATCH /appointments/cancel/:appointmentId
PATCH /appointments/doctor/cancel/:appointmentId
🔐 Authorization
Authorization: Bearer <token>
📊 Architecture Highlights
🔄 Database transactions for booking safety
🚫 Prevents double booking
📈 Scalable slot-based scheduling
🧠 Clean modular structure
📌 Future Improvements
Pagination & filters
Notifications (Email/SMS)
Admin dashboard
Payment integration
👨‍💻 Author

Pranav Pathare

⭐ If you like this project

Give it a star on GitHub ⭐