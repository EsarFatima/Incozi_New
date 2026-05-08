# Incozi Vercel Deployment Guide

## Current Status
- ✅ Frontend: Fixed and styled with MongoDB backend
- ✅ Auth: Sign in/Sign up working
- ✅ Documents: Upload feature ready
- ⚠️ MongoDB: Currently local (needs migration to Atlas for Vercel)

---

## Step 1: Create MongoDB Atlas Cluster

### Option A: Quick Setup
1. Visit https://www.mongodb.com/cloud/atlas
2. Sign up with Gmail
3. Create a project named "Incozi"
4. Create a **FREE M0 cluster**
5. Wait 5-10 minutes for deployment

### Option B: Detailed Instructions
1. Click **Build a Cluster**
2. Choose **AWS** + closest region to you
3. Select **M0 Free** tier
4. Click **Create Deployment**

---

## Step 2: Create Database User & Get Connection String

1. Go to **Database Access**
2. Click **Add New Database User**
   - Username: `incozi_user`
   - Password: Generate strong password (copy it!)
   - Role: **readWriteAnyDatabase**
3. Click **Clusters** → Your cluster → **Connect**
4. Choose **Drivers** → **Node.js** → version 5.9+
5. **Copy the connection string** - it looks like:
   ```
   mongodb+srv://incozi_user:PASSWORD@cluster0.xxxxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
   ```

---

## Step 3: Update .env with Atlas URI

Replace the `MONGODB_URI` in `.env`:

```env
MONGODB_URI=mongodb+srv://incozi_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/incozi?retryWrites=true&w=majority
```

**Replace:**
- `YOUR_PASSWORD` with actual password
- Keep `incozi` as database name (last part before `?`)

---

## Step 4: Test Locally with Atlas

1. Update `.env` with Atlas URI
2. Restart server: 
   ```bash
   npm start
   ```
3. Test sign up/login/upload at http://localhost:3000

---

## Step 5: Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free)

### Deployment Steps

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add MongoDB Atlas migration"
   git push
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repo `EsarFatima/Incozi_New`
   - Select **Framework**: Other
   - Click **Deploy**

3. **Add Environment Variables:**
   - In Vercel → Project Settings → **Environment Variables**
   - Add all variables from your `.env` file:
     - `MONGODB_URI` (Atlas connection string)
     - `JWT_SECRET`
     - `SMTP_USER`, `SMTP_PASS`
     - `SUPABASE_URL`, `SUPABASE_KEY`
     - `ASAAN_MERCHANT_ID`

4. **Redeploy:**
   - After adding variables, click **Deployments** → **... → Redeploy**

---

## Step 6: Update Frontend for Production

In your `.env`, also add:
```env
BASE_URL=https://your-vercel-url.vercel.app
```

Update this in Vercel environment variables after you know your deployment URL.

---

## Common Issues & Solutions

### Issue: "MongoDB connection failed"
**Solution:** Check your MongoDB Atlas URI is correct in Vercel environment variables

### Issue: "Email not sending on Vercel"
**Solution:** Ensure `SMTP_PASS` is an **App Password**, not regular Gmail password

### Issue: "CORS errors"
**Solution:** Update headers in `server.js` if needed for your frontend domain

---

## Verification Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Connection string copied correctly
- [ ] `.env` updated locally
- [ ] Sign up works on localhost
- [ ] Documents upload works on localhost
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added to Vercel
- [ ] Deployment successful
- [ ] Frontend works on Vercel URL

---

## Database Considerations

### Backup Your Current Data
If you have data in local MongoDB, you may want to:
1. Export data: `mongodump --db incozi`
2. Import to Atlas: `mongorestore --uri "YOUR_ATLAS_URI" ./dump`

Or start fresh with empty Atlas database.

---

## Support

If issues arise:
1. Check Vercel deployment logs
2. Check MongoDB Atlas network access whitelist (should allow all IPs for now)
3. Verify all secrets are correct in `.env`
