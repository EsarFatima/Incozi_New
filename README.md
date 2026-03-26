# INCOZI - Consultation Booking Platform

A full-stack web application for connecting entrepreneurs with business consultants. Built with Node.js, React, and Supabase.

## Features

- Service discovery and consultant browsing
- Interactive booking calendar
- Secure payment processing (Stripe)
- Real-time chat messaging
- User dashboards and profiles
- Document management

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** Supabase (PostgreSQL)
- **Frontend:** React, Tailwind CSS
- **Real-time:** Socket.IO
- **Payments:** Stripe API

## Getting Started

### Prerequisites
- Node.js 16+
- npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Incozi_New
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your Supabase and Stripe credentials
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
Incozi_New/
├── backend/
│   ├── migrations/          # Database schemas
│   ├── infrastructure/      # Database and external integrations
│   ├── auth.js              # Authentication logic
│   ├── services.js          # Service management
│   ├── payments.js          # Payment processing
│   ├── consultations.js     # Booking management
│   ├── chat.js              # Real-time chat
│   ├── middleware.js        # Express middleware
│   └── README.md
├── src/
│   ├── components/          # React components
│   ├── pages/               # Page components
│   ├── context/             # React context for state management
│   └── styles/              # CSS modules
├── assets/
│   ├── images/              # Project images
│   └── uploads/             # User-uploaded files
├── server.js                # Express server entry point
├── package.json
├── .env.example
├── .env                     # Environment variables (not committed)
└── README.md
```

## Setup & Configuration

1. Create a `.env` file with the following:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
STRIPE_SECRET_KEY=your_stripe_key
JWT_SECRET=your_jwt_secret
```

2. Database: Run migration scripts in `backend/migrations/` on Supabase

## Team

- Esar Fatima
- Haleemah Zaheer
