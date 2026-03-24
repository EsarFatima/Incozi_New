# Quick Start Guide - INCOZI Setup

Complete step-by-step guide to get INCOZI running locally and deployed to production.

---

## Part 1: Local Development (15 minutes)

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- Express.js (backend server)
- Socket.IO (real-time chat)
- Stripe (payments)
- Supabase (database client)
- And more...

### Step 2: Set Up Environment Variables

```bash
cp .env.example .env
```

Fill in `.env` with your credentials:

```
# Server
NODE_ENV=development
PORT=3000

# Supabase (from supabase.com)
SUPABASE_URL=https://[your-project-id].supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# JWT
JWT_SECRET=generate_a_random_string

# Email (Gmail example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_app_password

# Stripe (from stripe.com)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Step 3: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create free account
2. Create new project
3. Get API keys from Settings → API
4. Run the database schema:
   - Go to SQL Editor
   - Create new query
   - Copy-paste contents of `backend/migrations/supabase_schema.sql`
   - Click "Run"

**Detailed setup:** See [backend/SUPABASE_SETUP.md](backend/SUPABASE_SETUP.md)

### Step 4: Start Development Server

```bash
npm run dev
```

You should see:
```
✅ Server running on http://localhost:3000
✅ Supabase connected successfully
✅ Socket.IO initialized
```

### Step 5: Test the App

Open in browser:
```
http://localhost:3000/index.html
```

**Test features:**
- ✅ Sign up / Login at `/pages/account.html`
- ✅ Browse services at `/pages/consultation.html`
- ✅ Create booking at `/pages/order-wizard.html`
- ✅ View dashboard at `/pages/dashboard.html`
- ✅ Admin panel at `/pages/admin.html`

---

## Part 2: Production Deployment (30 minutes)

### Step 1: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial INCOZI commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/incozi.git
git push -u origin main
```

### Step 2: Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Select your GitHub repo: `incozi`
5. Fill settings:
   - **Name:** `incozi-api`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

6. Add Environment Variables (same as .env):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET` (generate new for production)
   - `STRIPE_SECRET_KEY`
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`
   - `FRONTEND_URL` (your Vercel domain)

7. Click **"Create Web Service"**
8. Wait ~2 minutes for deployment

**Your backend is live at:**
```
https://incozi-api.render.com
```

### Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Add New"** → **"Project"**
4. Select GitHub repo: `incozi`
5. Settings:
   - **Name:** `incozi`
   - **Framework:** `Other` (static HTML)
6. Leave build settings as default
7. Click **"Deploy"**

**Your frontend is live at:**
```
https://incozi.vercel.app
```

### Step 4: Update API Endpoint

In your frontend code (`script.js`), update API URL:

```javascript
// OLD
const API_URL = 'http://localhost:3000';

// NEW
const API_URL = 'https://incozi-api.render.com';
```

Then push:
```bash
git add script.js
git commit -m "Update API endpoint for production"
git push origin main
```

Vercel auto-deploys! ✅

### Step 5: Configure Stripe

1. Get live keys from [stripe.com](https://stripe.com)
2. Update in Render environment variables:
   - `STRIPE_SECRET_KEY=sk_live_...`
   - `STRIPE_PUBLIC_KEY=pk_live_...`

(Render auto-redeploys when you update variables)

---

## Part 3: Verification Checklist

### Local Development
- ✅ `npm install` succeeds
- ✅ `npm run dev` starts without errors
- ✅ Supabase connection works
- ✅ Can create user account
- ✅ Can browse services
- ✅ Can create consultation booking
- ✅ Chat works with Socket.IO
- ✅ Payment form appears

### Production
- ✅ Frontend loads at `https://incozi.vercel.app`
- ✅ Backend API responds at `https://incozi-api.render.com/api/services`
- ✅ Can log in
- ✅ Can make a test payment (Stripe test mode)
- ✅ Email notifications send
- ✅ Real-time chat works
- ✅ Dashboard shows data

---

## Part 4: Troubleshooting

### "Cannot connect to Supabase"
```bash
# Verify credentials in .env
SUPABASE_URL=correct_value
SUPABASE_ANON_KEY=correct_value

# Restart server
npm run dev
```

### "Port 3000 already in use"
```bash
# Find process using port
lsof -i :3000

# Kill it (Mac/Linux)
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### "Stripe payment not working"
- Verify you have test keys (start with `sk_test_`)
- For production, use live keys (`sk_live_`)
- Restart server after changing keys

### "Emails not sending"
- Gmail: Use App Password (not regular password)
- Generate at: https://myaccount.google.com/apppasswords
- Update `EMAIL_PASSWORD` in .env

### "Real-time chat not connecting"
- Check Socket.IO running on correct port
- Verify CORS settings
- Check browser console for errors

---

## Architecture Overview

```
┌─────────────────────────────┐
│  INCOZI Platform            │
│ ─────────────────────────── │
│                             │
│  Frontend (Vercel)          │
│  ✓ HTML/CSS/JavaScript      │
│  ✓ Responsive design        │
│  ✓ Real-time UI             │
│                             │
│  Backend (Render)           │
│  ✓ Node.js + Express        │
│  ✓ REST API endpoints       │
│  ✓ Business logic           │
│  ✓ Socket.IO real-time      │
│                             │
│  Database (Supabase)        │
│  ✓ PostgreSQL               │
│  ✓ Row Level Security       │
│  ✓ File Storage             │
│                             │
└─────────────────────────────┘
       │         │         │
       ▼         ▼         ▼
    Stripe   Email    WebSocket
```

---

## File Structure

```
Incozi/
├── backend/
│   ├── infrastructure/       ← Database, APIs, real-time
│   ├── application/          ← Business logic
│   ├── migrations/           ← Database schema
│   └── ...service files
├── pages/                    ← HTML templates
├── assets/                   ← Images
├── script.js                 ← Frontend logic
├── style.css                 ← Styling
├── server.js                 ← Express entry point
├── package.json
├── .env.example
├── README.md
├── ARCHITECTURE.md
├── DEPLOYMENT.md
└── PROPOSAL_ALIGNMENT.md
```

---

## Key Features Implemented

| Feature | Status | Location |
|---------|--------|----------|
| User Authentication | ✅ | `backend/auth.js` |
| Service Catalog | ✅ | `pages/consultation.html` |
| Smart Booking | ✅ | `pages/order-wizard.html` |
| Payment Processing | ✅ | `backend/payments.js` |
| Real-Time Chat | ✅ | `backend/infrastructure/realtime/socketIO.js` |
| Dashboard | ✅ | `pages/dashboard.html` |
| Admin Panel | ✅ | `pages/admin.html` |
| Responsive Design | ✅ | `style.css` |
| Email Notifications | ✅ | `backend/emailService.js` |
| Role-Based Access | ✅ | `backend/middleware.js` |
| Subscription Plans | ✅ | Database: `subscriptions` |
| Document Management | ✅ | `backend/documents.js` |
| Reviews & Ratings | ✅ | Database: `reviews` |

---

## Next Steps After Deployment

1. **Test thoroughly** - Go through all user workflows
2. **Collect feedback** - Set up feedback form or survey
3. **Monitor performance** - Check Render & Vercel dashboards
4. **Security audit** - Review authentication & data handling
5. **Plan Phase 2** - Video conferencing, analytics, mobile app

---

## Support Resources

- **Architecture:** [ARCHITECTURE.md](backend/ARCHITECTURE.md)
- **Database:** [SUPABASE_SETUP.md](backend/SUPABASE_SETUP.md)
- **Deployment:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Proposal:** [PROPOSAL_ALIGNMENT.md](PROPOSAL_ALIGNMENT.md)
- **Main README:** [README.md](README.md)

---

## Production URLs

Once deployed, your app is live at:

- **Frontend:** https://incozi.vercel.app
- **Backend:** https://incozi-api.render.com
- **Database:** Supabase Cloud
- **Real-time:** WebSocket via Socket.IO

---

## Team Contact

- **Esar Fatima** (23L-0888)
- **Haleemah Zaheer** (23L-0554)

---

**Setup Complete!** 🎉 Now build amazing features! 🚀
