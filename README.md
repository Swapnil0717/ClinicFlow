ClinicFlow Backend

A scalable clinic management SaaS backend built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

Overview

ClinicFlow is a production-ready backend system designed for real-world clinic workflows, enabling efficient management of clinics, doctors, patients, and appointments.

Core Features
Secure authentication using JWT (Access + Refresh Tokens)
Clinic onboarding and verification workflows
Doctor management and approval system
Slot-based appointment booking with high precision
Role-based dashboards (Admin, Doctor, Patient)
Public doctor search (Marketplace-ready)
Concurrency-safe booking to prevent double appointments
Tech Stack
Category	Technology
Backend	Node.js, Express.js, TypeScript
Database	PostgreSQL
ORM	Prisma
Authentication	JWT (Access & Refresh Tokens)
Architecture	Modular, Feature-Based
Caching (Optional)	Redis
Deployment	Docker, Cloud (AWS/Railway)
Getting Started
1. Clone the Repository
git clone https://github.com/Swapnil0717/ClinicFlow.git
cd clinicflow-backend
npm install
2. Environment Setup
cp .env.example .env

Update .env:

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
Action	Method	Endpoint
Register	POST	/auth/register
Login	POST	/auth/login
Google Login	POST	/auth/google
Verify Email	GET	/auth/verify-email
Forgot Password	POST	/auth/forgot-password
Reset Password	POST	/auth/reset-password
Refresh Token	POST	/auth/refresh
Logout	POST	/auth/logout
Current User	GET	/auth/me
Clinic APIs
Action	Method	Endpoint	Role
Create Clinic	POST	/clinics	Patient
Get My Clinic	GET	/clinics/me	Authenticated
Verify Clinic	PATCH	/clinics/verify/:id	Admin
Doctor APIs
Action	Method	Endpoint	Role
Create Doctor	POST	/doctors	Admin
Get All Doctors	GET	/doctors	Public
Get Doctor by ID	GET	/doctors/:id	Public
Pending Doctors	GET	/doctors/pending	Admin
Verify Doctor	PATCH	/doctors/verify/:id	Admin
Reject Doctor	PATCH	/doctors/reject/:id	Admin
Admin APIs
Action	Method	Endpoint
Pending Clinics	GET	/admin/pending-clinics
Pending Doctors	GET	/admin/pending-doctors
Verify Clinic	PATCH	/admin/verify-clinic/:id
Verify Doctor	PATCH	/admin/verify-doctor/:id
Reject Clinic	PATCH	/admin/reject-clinic/:id
Become Admin	POST	/admin/become
Appointments APIs
Action	Method	Endpoint	Role
Book Appointment	POST	/appointments/book	Patient
Patient Appointments	GET	/appointments/patient	Patient
Doctor Appointments	GET	/appointments/doctor	Doctor
Cancel Appointment	PATCH	/appointments/cancel/:id	Patient
Doctor Cancel	PATCH	/appointments/doctor/cancel/:id	Doctor
Slot Management APIs
Action	Method	Endpoint
Create Custom Slot	POST	/slots/custom
Create Recurring Slot	POST	/slots/recurring
Get Available Slots	GET	/slots/:doctorId
Search APIs
Action	Method	Endpoint
Search Doctors	GET	/search/doctors
Dashboard APIs
Dashboard	Endpoint
Doctor Dashboard	/dashboard/doctor
Patient Dashboard	/dashboard/patient
Clinic Dashboard	/dashboard/clinic
Authorization

All protected routes require:

Authorization: Bearer YOUR_ACCESS_TOKEN
Architecture Highlights
Concurrency-safe booking using database transactions
Modular architecture (feature-based design)
Role-Based Access Control (RBAC)
Fine-grained slot and sub-slot booking system
Marketplace-ready doctor search system
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
API documentation (Swagger/OpenAPI)
Rate limiting and security enhancements
Full Docker-based deployment setup
Author

Pranav Pathare

Support

If you find this project useful:

Star the repository
Fork and extend it
Use it as a base for your own backend systems
