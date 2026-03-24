# Supabase Setup Guide

This guide explains how to set up the Incozi Supabase database and obtain your API credentials.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in details:
   - **Project Name:** `incozi`
   - **Database Password:** Create a strong password (save this!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier is fine to start

5. Wait for the project to initialize (~2 minutes)

## Step 2: Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `backend/migrations/supabase_schema.sql`
4. Paste it into the SQL editor
5. Click **"Run"** button
6. Wait for all commands to execute successfully

## Step 3: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `SUPABASE_URL`
   - **Anon Key** → `SUPABASE_ANON_KEY`
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY`

3. Create a `.env` file in your project root:
   ```bash
   cp .env.example .env
   ```

4. Fill in your Supabase credentials:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

## Step 4: Set Up Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (default, already enabled)
3. Go to **Authentication** → **Email Templates**
4. Customize templates if needed (optional)

## Step 5: Set Up Storage for File Uploads

1. Go to **Storage**
2. Click **"Create a new bucket"**
3. Name it: `documents`
4. Make it **Public**
5. Click **"Create bucket"**

6. Create another bucket for `consultations` (for video/call recordings if needed)

## Step 6: Verify Connection

Run this command to install dependencies:
```bash
npm install
```

Then test connection with:
```bash
npm run dev
```

You should see: `✅ Supabase connected successfully` in the console

## Database Structure Overview

| Table | Purpose |
|-------|---------|
| **users** | Client, Consultant, Admin profiles |
| **services** | Consultation services offered |
| **consultations** | Booking records with status |
| **payments** | Transaction history |
| **subscriptions** | User plan information |
| **messages** | Real-time chat history |
| **reviews** | Consultant ratings & feedback |
| **documents** | File storage & versioning |

## Important Security Notes

- **Never commit** `.env` file to git
- **Use Service Role Key only on backend** (never expose in frontend)
- **Use Anon Key in frontend** for client-side operations
- Enable **Row Level Security (RLS)** policies (already included in schema)
- Set up **CORS origins** in Supabase dashboard

## Backup & Disaster Recovery

Supabase automatically backs up daily. To export data:
1. Go to **Settings** → **Backups**
2. Click **"Request Download"**
3. Check email for download link

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Connection refused" | Verify SUPABASE_URL and keys in .env |
| "Invalid credentials" | Check SUPABASE_ANON_KEY is correct |
| "Table doesn't exist" | Re-run the schema SQL file |
| RLS blocking queries | Check policies match your user role |

## Next Steps

1. ✅ Database schema created
2. ✅ Authentication configured
3. ⬜ Configure Stripe for payments
4. ⬜ Set up Socket.IO for real-time chat
5. ⬜ Deploy to Vercel (frontend) and Render (backend)

See [main README.md](../README.md) for full setup instructions.
