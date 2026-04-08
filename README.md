# ClinicFlow – Clinic Management & Appointment Booking Backend

A production-ready backend system for managing clinics, doctors, patients, and appointment workflows with high-precision scheduling and role-based access control (RBAC).

This project demonstrates scalable backend architecture, secure authentication, concurrency-safe booking, and real-world healthcare workflow implementation.

---

## Overview

ClinicFlow simulates a real-world clinic management system where different users interact based on defined roles:

- Manage clinic onboarding and verification workflows  
- Handle doctor approval and lifecycle management  
- Enable patients to book appointments seamlessly  
- Prevent double bookings using concurrency-safe logic  
- Provide role-based dashboards and analytics  

---

## Core Features

### Authentication and Security

- JWT-based authentication (Access and Refresh Tokens)  
- Secure token lifecycle management  
- Google OAuth login support  
- Email verification and password reset  
- Middleware-based route protection  

---

### Role-Based Access Control (RBAC)

| Role    | Capabilities                                       |
|---------|----------------------------------------------------|
| Patient | Book appointments and manage personal records      |
| Doctor  | Manage availability and appointments               |
| Admin   | Verify clinics, approve doctors, full system control |

RBAC is enforced at:
- Route level using middleware  
- Service layer using business logic  

---

### Clinic and Doctor Management

- Clinic onboarding and verification workflow  
- Doctor creation, approval, and rejection system  
- Admin-controlled verification process  
- Public doctor listing (marketplace-ready)  

---

### Appointment Booking System

- Slot-based appointment booking  
- High-precision scheduling  
- Concurrency-safe booking using database transactions  
- Prevention of double bookings  
- Appointment cancellation by patient and doctor  

---

### Slot Management

- Custom slot creation  
- Recurring slot generation  
- Fine-grained time-slot handling  
- Dynamic availability tracking  

---

### Search System

- Public doctor discovery  
- Filter-based doctor search  
- Scalable marketplace-ready architecture  

---

### Dashboard System

- Doctor dashboard (appointments and schedule)  
- Patient dashboard (booking history)  
- Clinic dashboard (operational insights)  

---

### Validation and Error Handling

- Centralized validation layer  
- Consistent API response structure  
- Standard HTTP status codes  
- Global error handling middleware  

---

## Tech Stack

- Node.js  
- Express.js  
- TypeScript  
- PostgreSQL  
- Prisma ORM  
- JWT Authentication  
- Zod (Validation)  
- Redis (optional caching)  
- Docker  
- AWS (deployment ready)  

---

## Project Structure

```bash
src/
│
├── config/         # Environment and app configuration
├── middleware/     # Auth, RBAC, validation, error handling
├── modules/
│   ├── auth/       
│   ├── clinic/     
│   ├── doctor/     
│   ├── appointment/
│   ├── slot/       
│   ├── dashboard/  
│   ├── admin/      
│   ├── search/     
│
├── utils/          # Helpers (JWT, hashing, etc.)
├── routes/         
└── server.ts       
```

---

## Setup Instructions

### Clone Repository

```bash
git clone https://github.com/Swapnil0717/ClinicFlow.git
cd clinicflow-backend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=your_postgres_url

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

EMAIL_USER=your_email
EMAIL_PASS=your_password

CLIENT_URL=http://localhost:3000
```

---

### Run Database Migrations

```bash
npx prisma migrate dev
npx prisma generate
```

---

### Start Development Server

```bash
npm run dev
```

Server will run at:

```
http://localhost:5000/api/v1
```

---

## API Overview

### Authentication

| Method | Endpoint                |
|--------|------------------------|
| POST   | /auth/register         |
| POST   | /auth/login            |
| POST   | /auth/google           |
| GET    | /auth/verify-email     |
| POST   | /auth/forgot-password  |
| POST   | /auth/reset-password   |
| POST   | /auth/refresh          |
| POST   | /auth/logout           |
| GET    | /auth/me               |

---

### Clinics

| Method | Endpoint              |
|--------|----------------------|
| POST   | /clinics             |
| GET    | /clinics/me          |
| PATCH  | /clinics/verify/:id  |

---

### Doctors

| Method | Endpoint                 |
|--------|--------------------------|
| POST   | /doctors                 |
| GET    | /doctors                 |
| GET    | /doctors/:id             |
| GET    | /doctors/pending         |
| PATCH  | /doctors/verify/:id      |
| PATCH  | /doctors/reject/:id      |

---

### Appointments

| Method | Endpoint                             |
|--------|--------------------------------------|
| POST   | /appointments/book                   |
| GET    | /appointments/patient                |
| GET    | /appointments/doctor                 |
| PATCH  | /appointments/cancel/:id             |
| PATCH  | /appointments/doctor/cancel/:id      |

---

### Slots

| Method | Endpoint             |
|--------|----------------------|
| POST   | /slots/custom        |
| POST   | /slots/recurring     |
| GET    | /slots/:doctorId     |

---

### Search

| Method | Endpoint         |
|--------|------------------|
| GET    | /search/doctors  |

---

### Dashboard

| Method | Endpoint               |
|--------|------------------------|
| GET    | /dashboard/doctor      |
| GET    | /dashboard/patient     |
| GET    | /dashboard/clinic      |

---

### Admin

| Method | Endpoint                          |
|--------|-----------------------------------|
| GET    | /admin/pending-clinics            |
| GET    | /admin/pending-doctors            |
| PATCH  | /admin/verify-clinic/:id          |
| PATCH  | /admin/verify-doctor/:id          |
| PATCH  | /admin/reject-clinic/:id          |
| POST   | /admin/become                     |

---

## Access Control Summary

| Action              | Patient | Doctor | Admin |
|--------------------|--------|--------|-------|
| Book appointment   | Yes    | No     | Yes   |
| View appointments  | Own    | Own    | All   |
| Manage slots       | No     | Yes    | Yes   |
| Manage doctors     | No     | No     | Yes   |
| Verify clinics     | No     | No     | Yes   |
| Access dashboards  | Yes    | Yes    | Yes   |

---

## Example Requests

### Book Appointment

```json
POST /appointments/book

{
  "doctorId": "123",
  "slotId": "456",
  "date": "2026-04-10"
}
```

---

### Get Available Slots

```bash
GET /slots/:doctorId
```

---

## Design Decisions

- Concurrency-safe booking using database transactions to prevent double bookings  
- RBAC enforced at service level to ensure strict authorization  
- Modular architecture for scalability and maintainability  
- Slot-based scheduling for precise time management  
- Verification workflows to maintain platform trust  
- Marketplace-ready search architecture  

---

## Assumptions

- Only verified doctors can accept appointments  
- Clinics must be approved before activation  
- Patients can manage only their own bookings  
- Admin has full control over system verification  
- Slots define availability and prevent conflicts  

---

## Future Enhancements

- Redis caching for performance optimization  
- Rate limiting and API security improvements  
- Email and SMS notifications  
- Payment integration (Stripe or Razorpay)  
- Swagger / OpenAPI documentation  
- Docker-based deployment with CI/CD  

---

## Author

Pranav Pathare  
GitHub: Swapnil0717  

---
