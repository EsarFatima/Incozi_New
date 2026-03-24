# INCOZI - Consultation Platform

> A comprehensive full-stack platform connecting entrepreneurs and small business owners with qualified consultants for business incorporation, bookkeeping, and tax compliance services.

## 🎯 Project Overview

**Incozi** is a production-ready consultation booking platform built with modern web technologies. It solves the fragmentation problem where entrepreneurs must juggle multiple platforms for scheduling, payments, and communication.

**Key Features:**
- 🔍 **Service Discovery** - Browse consultants by category (Incorporation, Bookkeeping, Tax Compliance)
- 📅 **Smart Booking** - Interactive calendar with real-time availability
- 💳 **Secure Payments** - Stripe integration with invoice generation
- 💬 **Real-Time Chat** - Socket.IO powered messaging between clients & consultants
- 🏆 **User Profiles** - Role-based access (Client, Consultant, Admin)
- 📊 **Dashboard** - Analytics & consultation management
- 📦 **Document Management** - Secure file uploads & sharing

---

## 🛠 Tech Stack

### Backend
- **Node.js** + **Express.js** - RESTful API server
- **Supabase** (PostgreSQL) - Managed database with auth
- **Socket.IO** - Real-time bidirectional communication
- **Stripe API** - Payment processing
- **JWT + bcrypt** - Secure authentication

### Frontend
- **HTML5 / CSS3 / JavaScript** - Static pages with dynamic interactions
- **Fully Responsive** - Desktop, tablet, mobile optimized

### Infrastructure & Deployment
- **Vercel** - Frontend hosting (auto-deploy from Git)
- **Render/Railway** - Backend API hosting
- **Supabase Cloud** - Managed PostgreSQL database
- **Storage** - Supabase Storage buckets

---

## 📋 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account (free tier available)
- Stripe account (for payments)

### 1. Clone & Install Dependencies

```bash
cd Incozi
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Fill in your credentials (see [SUPABASE_SETUP.md](backend/SUPABASE_SETUP.md)):
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
```

### 3. Set Up Supabase Database

Follow the detailed guide in [backend/SUPABASE_SETUP.md](backend/SUPABASE_SETUP.md):

```bash
# The guide walks you through:
# 1. Creating a Supabase project
# 2. Running the database schema
# 3. Getting API credentials
# 4. Setting up authentication & storage
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs at: **http://localhost:3000**

### 5. Open in Browser

```
http://localhost:3000/index.html
```

---

## 📁 Project Structure

```
Incozi/
├── backend/
│   ├── infrastructure/          # Adapter layer (database, external APIs)
│   │   ├── database/           # Supabase client config
│   │   └── utils/              # Database helpers
│   ├── application/            # Domain-specific business logic
│   │   ├── auth.js             # Authentication services
│   │   ├── consultations.js    # Consultation management
│   │   ├── payments.js         # Payment processing
│   │   └── services.js         # Service catalog
│   ├── migrations/
│   │   ├── supabase_schema.sql # Database schema
│   │   └── seeds.sql           # Sample data
│   ├── middleware.js           # JWT, error handling
│   ├── emailService.js         # Email notifications
│   ├── SUPABASE_SETUP.md       # Database setup guide
│   └── README.md
├── pages/                      # HTML templates
│   ├── index.html              # Landing page
│   ├── dashboard.html          # User dashboard
│   ├── admin.html              # Admin panel
│   ├── consultation.html       # Booking page
│   ├── checkout.html           # Payment page
│   └── ...
├── assets/
│   ├── images/                 # Service & blog images
│   └── uploads/                # User-uploaded documents
├── script.js                   # Frontend JavaScript
├── style.css                   # Global styles
├── server.js                   # Express server entry point
├── package.json
├── .env.example
└── README.md                   # This file
```

---

## 🏗 Architecture

Incozi follows **Hexagonal Architecture** principles for clean, maintainable code:

```
┌─────────────────────────────────────────┐
│         HTTP Controllers (Routes)       │
├─────────────────────────────────────────┤
│  Application Layer (Business Logic)     │
│  - Authentication                       │
│  - Consultation Booking                 │
│  - Payment Processing                   │
├─────────────────────────────────────────┤
│  Adapter Layer (External Systems)       │
│  - Supabase Database                    │
│  - Stripe API                           │
│  - Email Service                        │
│  - File Storage                         │
└─────────────────────────────────────────┘
```

**Benefits:**
- ✅ Easily switch database without changing business logic
- ✅ Testable - mock external dependencies
- ✅ Scalable - add new adapters without refactoring
- ✅ Professional - industry-standard approach

---

## 📊 Database Schema

Key tables in Supabase PostgreSQL:

| Table | Purpose |
|-------|---------|
| `users` | Client, Consultant, Admin profiles + subscriptions |
| `services` | Consultation offerings with pricing & availability |
| `consultations` | Booking records with status & payment tracking |
| `payments` | Transaction history (Stripe integration) |
| `subscriptions` | User plan data (Basic/Standard/Premium) |
| `messages` | Real-time chat conversations |
| `reviews` | Consultant ratings & feedback |
| `documents` | User files + version control |

See `backend/migrations/supabase_schema.sql` for complete schema.

---

## 🔐 Authentication & Security

- **JWT Tokens** - Stateless authorization
- **Password Hashing** - bcryptjs with salt rounds
- **Row Level Security** - Supabase RLS policies enforce data isolation
- **CORS Protection** - Whitelisted origins only
- **Environment Variables** - All secrets in `.env` (not committed)

---

## 💳 Payment Processing

**Stripe Integration:**
- Secure checkout form
- Invoice generation
- Refund processing
- Subscription management

See `backend/payments.js` for implementation.

---

## 💬 Real-Time Chat

**Socket.IO Features:**
- Bidirectional messaging
- Typing indicators
- Online/offline status
- File attachments
- Message history

See `backend/chat.js` for implementation.

---

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repo to Vercel dashboard
3. Auto-deploys on git push

### Backend (Render/Railway)
1. Connect GitHub repo
2. Set environment variables in dashboard
3. Deploy with single click

### Database (Supabase Cloud)
- Automatically hosted & backed up
- Auto-scaling on demand
- Built-in SSL encryption

---

## 📝 API Documentation

### Auth Endpoints
```
POST   /api/auth/register      - Create new user
POST   /api/auth/login         - User login
POST   /api/auth/logout        - User logout
POST   /api/auth/verify-email  - Email verification
```

### Services Endpoints
```
GET    /api/services           - List all services
GET    /api/services/:id       - Service details
POST   /api/services           - Create service (consultant only)
PUT    /api/services/:id       - Update service
```

### Consultations Endpoints
```
GET    /api/consultations      - My bookings
POST   /api/consultations      - Create booking
GET    /api/consultations/:id  - Booking details
PUT    /api/consultations/:id/status - Update status
DELETE /api/consultations/:id  - Cancel booking
```

### Payments Endpoints
```
POST   /api/payments/checkout  - Create payment intent
POST   /api/payments/confirm   - Confirm payment
GET    /api/payments/history   - Payment history
```

See `backend/README.md` for complete API reference.

---

## 🧪 Testing

Run tests:
```bash
npm test
```

Test coverage:
- Authentication flows
- Booking workflows
- Payment processing
- Real-time chat

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `lsof -i :3000` then kill process |
| Supabase connection fails | Check SUPABASE_URL and keys in .env |
| Payments not working | Verify Stripe keys and webhook configuration |
| Real-time chat not connecting | Ensure Socket.IO is running on correct port |

---

## 📚 Additional Resources

- [Supabase Setup Guide](backend/SUPABASE_SETUP.md)
- [Backend API Documentation](backend/README.md)
- [Database Schema](backend/migrations/supabase_schema.sql)

---

## 👥 Team

- **Esar Fatima** (23L-0888)
- **Haleemah Zaheer** (23L-0554)

---

## 📄 License

This project is part of a capstone course project. All rights reserved.

---

## 🎓 Learning Outcomes

By building Incozi, the team demonstrates:
- ✅ Full-stack development (Frontend + Backend + Database)
- ✅ Professional architecture patterns (Hexagonal Architecture)
- ✅ API design & RESTful principles
- ✅ Database design with PostgreSQL
- ✅ Real-time communication with Socket.IO
- ✅ Payment processing integration
- ✅ Security best practices
- ✅ Version control & deployment pipelines
- ✅ Technical documentation

---

**Last Updated:** March 2026
