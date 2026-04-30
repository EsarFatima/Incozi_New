# INCOZI - Consultation Booking Platform

A full-stack web application for connecting entrepreneurs with business consultants. Built with Node.js, Express.js, React, MongoDB, and Stripe.

## Overview

INCOZI enables entrepreneurs to discover business consultants, book consultations, make secure payments, communicate in real-time, and manage documents—all through an intuitive web platform.

---

## Features

- **Service Discovery** - Browse and filter available consulting services
- **Interactive Booking** - Calendar-based consultation scheduling
- **Secure Payments** - Stripe integration for transaction processing
- **Real-time Chat** - Socket.IO-powered messaging between users and consultants
- **User Dashboards** - Separate dashboards for clients, consultants, and admins
- **Document Management** - Upload, store, and manage project documents
- **Admin Panel** - Manage users, bookings, payments, and support tickets

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **Frontend** | React with Tailwind CSS |
| **Real-time** | Socket.IO |
| **Payments** | Stripe API |
| **Build Tools** | Vite, PostCSS, Tailwind |

---

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- MongoDB Atlas account (for database)
- Stripe account (for payments)

### Installation

1. **Clone and Navigate**
```bash
git clone <repository-url>
cd Incozi_New
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment Variables**
Create a `.env` file in the root directory:
```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/incozi

# Stripe
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# Server
PORT=5000
NODE_ENV=development
```

4. **Start Development Server**
```bash
npm run dev
```

Access the application at `http://localhost:3000` (frontend) and `http://localhost:5000` (API).

---

## Project Structure

```
Incozi_New/
│
├── backend/                          # Express server and APIs
│   ├── auth.js                       # User authentication & JWT
│   ├── payments.js                   # Stripe payment processing
│   ├── consultations.js              # Booking management
│   ├── services.js                   # Service CRUD operations
│   ├── dashboard.js                  # Dashboard data & analytics
│   ├── chat.js                       # Real-time messaging
│   ├── documents.js                  # Document management
│   ├── admin.js                      # Admin operations
│   ├── middleware.js                 # Express middleware
│   ├── emailService.js               # Email notifications
│   ├── paymentService.js             # Payment utilities
│   ├── infrastructure/               # Database connection & config
│   └── migrations/                   # MongoDB schema definitions
│
├── pages/                            # HTML pages
│   ├── index.html
│   ├── dashboard.html
│   ├── consultation.html
│   ├── cart.html
│   ├── checkout.html
│   ├── admin.html
│   └── [other pages]
│
├── src/                              # React components (if used)
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   └── styles/
│
├── assets/                           # Static assets
│   ├── images/
│   └── uploads/
│
├── scripts/                          # Utility scripts
│   ├── testMongoConnection.js
│   ├── seedDatabase.js
│   └── [other scripts]
│
├── server.js                         # Express server entry point
├── style.css                         # Global styles
├── script.js                         # Frontend utilities
├── chat.js                           # Frontend chat handler
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## Database Schema

The MongoDB database includes the following collections:

- **users** - User accounts (clients, consultants, admins)
- **services** - Available consultation services
- **consultations** - Booked consultations/appointments
- **payments** - Payment records and transactions
- **messages** - Chat messages between users
- **documents** - User-uploaded documents
- **reviews** - Service reviews and ratings
- **subscriptions** - Subscription plans
- **tickets** - Support tickets (admin)

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Services
- `GET /api/services` - List all services
- `GET /api/services/:id` - Get service details
- `POST /api/services` - Create service (consultant)
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Consultations
- `GET /api/consultations` - List user's consultations
- `POST /api/consultations` - Book consultation
- `GET /api/consultations/:id` - Get consultation details
- `PUT /api/consultations/:id` - Update consultation
- `DELETE /api/consultations/:id` - Cancel consultation

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/history` - Get payment history

### Chat
- Real-time events via Socket.IO
- `socket.on('send_message')` - Send message
- `socket.on('receive_message')` - Receive message

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - List all users
- `GET /api/admin/bookings` - List all bookings
- `GET /api/admin/payments` - Payment reports

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key for server-side operations |
| `STRIPE_PUBLISHABLE_KEY` | No | Stripe public key for frontend (can be hardcoded) |
| `JWT_SECRET` | Yes | Secret key for JWT token signing |
| `PORT` | No | Server port (default: 5000) |
| `NODE_ENV` | No | Environment: development/production |

---

## Development

### Running Tests
```bash
npm run test
```

### Database Seeding
```bash
node scripts/seedDatabase.js
```

### Check MongoDB Connection
```bash
node scripts/testMongoConnection.js
```

---

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### MongoDB Atlas Setup
1. Create cluster at https://www.mongodb.com/cloud/atlas
2. Create database user with appropriate permissions
3. Add IP whitelist (or allow all)
4. Generate connection string
5. Update `MONGODB_URI` in environment variables

---

## Troubleshooting

### MongoDB Connection Issues
```bash
# Test connection
node scripts/testMongoConnection.js

# Check .env file has MONGODB_URI set correctly
```

### Payment Processing
- Ensure Stripe keys are correct and not expired
- Test cards: 4242 4242 4242 4242 (success), 4000 0000 0000 0002 (decline)

### Socket.IO Connection
- Ensure server is running on correct port
- Check CORS settings in server.js if frontend is on different domain

---

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

---

## Team

- Esar Fatima
- Haleemah Zaheer

---

## License

This project is proprietary. All rights reserved.
