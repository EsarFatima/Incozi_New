# INCOZI Deployment Guide

Complete guide to deploy Incozi to production using Vercel (frontend) and Render/Railway (backend).

---

## Architecture Overview

```
┌──────────────┐
│  Vercel      │ (Frontend: HTML, CSS, JS)
│  your-site   │
│  .vercel.app │
└──────┬───────┘
       │ HTTP/HTTPS
       ▼
┌──────────────┐
│  Render/     │ (Backend: Node.js + Express)
│  Railway     │
│  API         │
└──────┬───────┘
       │ Queries/Updates
       ▼
┌──────────────┐
│  Supabase    │ (Database: Cloud PostgreSQL)
│  Cloud       │
│  incozi-db   │
└──────────────┘
```

---

## Prerequisites

- GitHub account (for version control)
- Vercel account (free)
- Render or Railway account (free/paid tier)
- Supabase account (already set up)
- Stripe account (already set up)

---

## Step 1: Prepare Code for Production

### 1.1 Update API Endpoints

In your frontend JavaScript files, replace localhost references:

**Old (Development):**
```javascript
const API_URL = 'http://localhost:3000';
```

**New (Production):**
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'https://api.incozi.com';
```

Or use a configuration file:

Create `config.js`:
```javascript
const config = {
  development: {
    API_URL: 'http://localhost:3000',
  },
  production: {
    API_URL: 'https://your-backend-domain.render.com',
  },
};

export default config[process.env.NODE_ENV || 'development'];
```

### 1.2 Enable HTTPS Everywhere

All production URLs must use HTTPS (both Vercel and Render do this automatically).

### 1.3 Create `.gitignore`

```
# Environment
.env
.env.local
.env.production
.env.*.local

# Dependencies
node_modules/
package-lock.json
yarn.lock

# Build
dist/
build/

# Logs
*.log
npm-debug.log*.log

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Temp files
*.tmp
temp/
```

### 1.4 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Incozi Platform"
git branch -M main
git remote add origin https://github.com/yourusername/incozi.git
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your GitHub account

### 2.2 Deploy Node.js Service

1. Click **"New +"** → **"Web Service"**
2. Select your GitHub repository: `incozi`
3. Fill in settings:

| Setting | Value |
|---------|-------|
| **Name** | `incozi-api` |
| **Branch** | `main` |
| **Root Directory** | `.` (leave blank) |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

4. Select Plan: **Free** (for now)

5. Click **"Create Web Service"**

### 2.3 Add Environment Variables

In Render dashboard → your service → **Environment**:

Add these variables:

```
NODE_ENV=production
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_production_jwt_secret
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
EMAIL_USER=incozillc@gmail.com
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

⚠️ **Security:** Generate NEW secrets for production:
```bash
# Generate production JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.4 Wait for Deployment

Render automatically deploys when you push to `main`:

```bash
# Push to trigger deploy
git push origin main
```

**Your backend is now live at:**
```
https://incozi-api.render.com
```

Monitor logs in Render dashboard.

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Connect GitHub account

### 3.2 Deploy Project

1. Click **"Add New"** → **"Project"**
2. Select GitHub repository: `incozi`
3. Fill in settings:

| Setting | Value |
|---------|-------|
| **Project Name** | `incozi` |
| **Framework** | `Other` (since we're using static HTML) |
| **Root Directory** | `.` |

4. In **Build Settings**:
   - **Build Command:** Leave empty (static files)
   - **Output Directory:** `.` (root)
   - **Install Command:** `npm install`

### 3.3 Add Environment Variables

In Vercel project settings → **Environment Variables**:

```
REACT_APP_API_URL=https://incozi-api.render.com
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_your_stripe_key
```

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2 minutes)

**Your frontend is now live at:**
```
https://incozi.vercel.app
```

---

## Step 4: Production Configuration

### 4.1 Update CORS Settings

In `backend/server.js`, update CORS for production:

```javascript
app.use(cors({
  origin: [
    'https://incozi.vercel.app',
    'https://www.incozi.com', // custom domain if any
  ],
  credentials: true,
}));
```

After updating, push to trigger auto-deploy:
```bash
git push origin main
```

### 4.2 Update Stripe Webhooks

In Stripe Dashboard → **Webhooks**:

1. Update endpoint URL to: `https://incozi-api.render.com/api/webhooks/stripe`
2. Update event types: `payment_intent.succeeded`, `payment_intent.failed`

### 4.3 Update Email Configuration

For production emails, consider upgrading to:
- SendGrid (free tier: 100 emails/day)
- Mailgun (free tier: 100 emails/day)

Or configure company email properly with app password.

---

## Step 5: Connect Custom Domain (Optional)

### 5.1 Vercel Domain

1. In Vercel → Project Settings → **Domains**
2. Add custom domain: `incozi.com`
3. Update DNS records (provided by Vercel)

### 5.2 Backend Domain

1. In Render → Service Settings → **Custom Domains**
2. Add: `api.incozi.com`
3. Update DNS (provided by Render)

---

## Step 6: Set Up Monitoring & Backups

### 6.1 Error Tracking

Add Sentry for production error monitoring:

```bash
npm install @sentry/node
```

In `server.js`:
```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.errorHandler());
```

### 6.2 Database Backups

Supabase automatically backs up daily. To export:

1. Go to Supabase Dashboard → **Backups**
2. Click **"Request Download"**
3. Check email for download link

### 6.3 Monitoring

Render includes basic monitoring. For advanced:
- DataDog
- New Relic
- CloudFlare Analytics

---

## Step 7: CI/CD Pipeline (Optional)

Currently, deployments are manual. For true CI/CD:

### 7.1 Add Testing

```bash
npm test
```

### 7.2 GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Incozi

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## Production Checklist

Before going live, verify:

- ✅ HTTPS everywhere (automatic on Vercel & Render)
- ✅ Environment variables secured (not in git)
- ✅ CORS properly configured
- ✅ Database backups enabled
- ✅ Error logging configured
- ✅ Email service working
- ✅ Stripe live keys configured
- ✅ Socket.IO working in production
- ✅ File uploads to Supabase working
- ✅ Authentication tokens expiring
- ✅ Rate limiting enabled
- ✅ Monitoring/alerts set up

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 502 Bad Gateway | Check Render logs for errors |
| CORS errors | Update Render CORS config & redeploy |
| Database connection fails | Verify SUPABASE_URL and keys in Render |
| Builds failing | Check build logs on Vercel/Render |
| Emails not sending | Verify EMAIL_USER/PASSWORD in environment |

---

## Budget Estimate

| Service | Tier | Cost |
|---------|------|------|
| **Vercel** | Pro | $20/month |
| **Render** | Starter | $7/month |
| **Supabase** | Pro | $25/month |
| **Stripe** | Standard | 2.9% + $0.30 |
| **Total** | Approx | ~$52/month + Stripe fees |

Free tiers available for testing, but production recommends paid plans for reliability.

---

## Scaling to Production

For 10k+ users, consider:

1. **Database Scaling**
   - Supabase Pro plan (~$25/month)
   - Read replicas if needed

2. **Backend Scaling**
   - Render: Tier-2 plan (~$7-12/month)
   - Or Railway: Pay-as-you-go

3. **CDN**
   - Vercel includes automatic Cloudflare CDN
   - For custom domain: add Cloudflare free tier

4. **Real-Time Scaling**
   - Socket.IO with Redis adapter for multiple server instances

---

## Support

For deployment help:
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)

---

**Next Steps:**
1. ✅ Backend deployed to Render
2. ✅ Frontend deployed to Vercel
3. ⬜ Monitor in production
4. ⬜ Collect user feedback
5. ⬜ Iterate & improve
