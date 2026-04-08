ClinicFlow Backend

A scalable clinic management SaaS backend built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

Overview

ClinicFlow is a production-ready backend system designed to support real-world clinic workflows and healthcare operations. It provides a structured and secure foundation for managing clinics, doctors, patients, and appointments.

Key capabilities include:

JWT-based authentication with access and refresh tokens
Clinic onboarding and verification workflows
Doctor management and approval system
Slot-based appointment booking with high precision
Role-based dashboards for Admin, Doctor, and Patient
Public doctor search for marketplace-style discovery
Concurrency-safe booking to prevent double reservations
Tech Stack
Backend: Node.js, Express.js, TypeScript
Database: PostgreSQL
ORM: Prisma
Authentication: JWT (Access and Refresh Tokens)
Architecture: Modular, feature-based design
Getting Started
1. Clone the Repository
git clone https://github.com/Swapnil0717/ClinicFlow.git
cd clinicflow-backend
npm install
2. Environment Setup
cp .env.example .env

Update the .env file:

DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
EMAIL_USER=
EMAIL_PASS=
CLIENT_URL=
3. Database Setup
npx prisma migrate dev
npx prisma generate
4. Run the Server
npm run dev
Base URL
http://localhost:5000/api/v1
Authentication APIs
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
Reset Password
POST /auth/reset-password
{
  "token": "RESET_TOKEN",
  "newPassword": "123456"
}
Refresh Token
POST /auth/refresh
Logout
POST /auth/logout
Get Current User
GET /auth/me
Clinic APIs
Create Clinic
POST /clinics

Role: Patient

{
  "name": "City Care Clinic",
  "address": "Pune",
  "phone": "9999999999"
}
Get My Clinic
GET /clinics/me
Verify Clinic
PATCH /clinics/verify/:id
Doctor APIs
Create Doctor
POST /doctors

Role: Admin

{
  "name": "Dr. Smith",
  "specialization": "Cardiologist",
  "experience": 5,
  "clinicId": "CLINIC_ID"
}
Other Endpoints
GET /doctors
GET /doctors/:id
GET /doctors/pending
PATCH /doctors/verify/:id
PATCH /doctors/reject/:id
Admin APIs
GET /admin/pending-clinics
GET /admin/pending-doctors
PATCH /admin/verify-clinic/:id
PATCH /admin/verify-doctor/:id
PATCH /admin/reject-clinic/:id
POST /admin/become
Appointments
Book Appointment
POST /appointments/book

Role: Patient

{
  "subSlotId": "SUB_SLOT_ID"
}
Other Endpoints
GET /appointments/patient
GET /appointments/doctor
PATCH /appointments/cancel/:appointmentId
PATCH /appointments/doctor/cancel/:appointmentId
Slot Management
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
Search APIs
GET /search/doctors?clinicId=CLINIC_ID&specialization=cardiologist
Dashboard APIs
GET /dashboard/doctor
GET /dashboard/patient
GET /dashboard/clinic
Authorization

All protected routes require:

Authorization: Bearer YOUR_ACCESS_TOKEN
Architecture Highlights
Concurrency-safe appointment booking using database transactions
Modular, feature-based architecture for scalability and maintainability
Role-based access control (RBAC)
Fine-grained slot and sub-slot booking system
Marketplace-ready doctor discovery and search
Project Structure
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
Future Improvements
Pagination and advanced filtering
Email and SMS notifications
Payment integration (Stripe, Razorpay)
API documentation using Swagger/OpenAPI
Rate limiting and additional security enhancements
Full Docker-based deployment setup
Author

Pranav Pathare

Support

If you find this project useful:

Star the repository
Fork and extend it
Use it as a base for your own backend systems
