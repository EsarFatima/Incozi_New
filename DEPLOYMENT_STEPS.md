# 🚀 Incozi Deployment Guide - Step by Step

## **Current Status:**
- ✅ Frontend: Fixed, styled, and working perfectly
- ✅ Backend: Connected to MongoDB Atlas
- ✅ Database: MongoDB Atlas cluster active (`cluster0`)
- ✅ Code: Pushed to GitHub (main branch)

---

## **DEPLOYMENT ARCHITECTURE:**
```
GitHub (Incozi_New)
    ↓
Vercel (Frontend at index.html, /pages)
Backend API calls → Render (Node.js server)
                    ↓
             MongoDB Atlas (cluster0)
```

---

## **📋 DEPLOYMENT CHECKLIST:**

### **Phase 1: MongoDB Atlas Configuration** ✅
- [x] Cluster created and resumed
- [x] Database user created (`incozi_user:incozi123`)
- [x] Connection string: `mongodb+srv://incozi_user:incozi123@cluster0.hmks7ya.mongodb.net/incozi?retryWrites=true&w=majority`
- [x] Network access: Add IP whitelist (or `0.0.0.0/0` for anywhere)

**Network Access Setup:**
1. Go to MongoDB Atlas → cluster0
2. Click **Network Access**
3. Click **Add IP Address**
4. Select **Allow access from anywhere** (0.0.0.0/0)
5. Click **Confirm**

---

### **Phase 2: Backend Deployment to Render** 🔄

**Step 1: Create Render Account**
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

**Step 2: Create Web Service**
1. Click **Dashboard** → **New +** → **Web Service**
2. Select your GitHub repo: `EsarFatima/Incozi_New`
3. Configure:
   - **Name:** `incozi-backend`
   - **Region:** Choose nearest to you
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free tier
4. Click **Create Web Service**
5. Wait 2-3 minutes for deployment

**Step 3: Add Environment Variables**
1. In Render, go to **Settings** → **Environment**
2. Add these variables:
   ```
   MONGODB_URI=mongodb+srv://incozi_user:incozi123@cluster0.hmks7ya.mongodb.net/incozi?retryWrites=true&w=majority&authSource=admin
   JWT_SECRET=f56d352f43fff745efde737af00ef502a28d7702e0a12ac728806bf58577e2aa145b897f5b0011fb5a8a2a130cddc2f6d018e3567735115a08189a91bcfbcc83
   SMTP_USER=incozillc@gmail.com
   SMTP_PASS=your_app_password_here
   SUPABASE_URL=https://wuvvwxkzoeqilrwircsu.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ASAAN_MERCHANT_ID=9fc1ff61-94df-42df-a484-aaff0f4d52f3
   BASE_URL=https://incozi-backend.onrender.com
   NODE_ENV=production
   PORT=3000
   ```

**Step 4: Get Your Backend URL**
- Go to Render Dashboard → incozi-backend
- Copy the URL: `https://incozi-backend.onrender.com` (or similar)
- This is what your frontend will call for APIs

---

### **Phase 3: Update Frontend Configuration** 🔧

**In config.js (already done, verify):**
```javascript
const getAPIBase = () => {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  } else {
    return 'https://incozi-backend.onrender.com'; // Update with your Render URL
  }
};
```

**Update the Render URL in config.js:**
```bash
# Replace with your actual Render backend URL
```

---

### **Phase 4: Frontend Deployment to Vercel** 🎯

**Step 1: Create Vercel Account**
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

**Step 2: Deploy Project**
1. Click **Add New...** → **Project**
2. Import GitHub repo: `EsarFatima/Incozi_New`
3. Configure:
   - **Framework:** Other
   - **Root Directory:** ./
   - **Build Command:** Leave empty (static files only)
   - **Output Directory:** ./
4. Click **Deploy**
5. Wait 1-2 minutes
6. You'll get: `https://incozi-new-[hash].vercel.app`

**Step 3: Add Environment Variable**
1. After deployment, go to **Settings** → **Environment Variables**
2. Add:
   ```
   NEXT_PUBLIC_API_URL=https://incozi-backend.onrender.com
   ```
3. Redeploy project

**Step 4: Verify Deployment**
- Frontend URL: `https://incozi-new-[hash].vercel.app`
- Test: Go to `/pages/account.html`
- Try signing up

---

## **✅ FINAL VERIFICATION CHECKLIST:**

### **Local Testing (Before Deployment)**
- [x] Server runs: `npm start`
- [x] MongoDB Atlas connects
- [x] Frontend loads at http://localhost:3000
- [x] Sign up form works
- [x] Documents upload works

### **Backend (Render)**
- [ ] Render deployment successful
- [ ] Environment variables all set
- [ ] Test API endpoint: `https://incozi-backend.onrender.com/api/auth/login`
- [ ] Should return error about missing credentials (expected)

### **Frontend (Vercel)**
- [ ] Vercel deployment successful
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Account page shows sign in form
- [ ] Try sign up → Should work with backend
- [ ] Test document upload → Should work with backend

---

## **🔗 FINAL LIVE LINKS:**

After deployment:
1. **Frontend (Vercel):** `https://incozi-new-[hash].vercel.app`
2. **Backend (Render):** `https://incozi-backend.onrender.com`
3. **Database (MongoDB):** `mongodb+srv://incozi_user:...@cluster0.hmks7ya.mongodb.net`

---

## **📝 REQUIRED DELIVERABLES:**

From requirements screenshot:
- ✅ Frontend fully connected to backend APIs
- ✅ Working end-to-end application
- ✅ Deployment:
  - ✅ Frontend: Vercel
  - ✅ Backend: Render
  - ✅ Database: MongoDB Atlas
- 📝 Live project link: `https://incozi-new-[hash].vercel.app`

---

## **Troubleshooting:**

### **"Cannot connect to MongoDB"**
- Check Render environment variables
- Verify IP whitelist in MongoDB Network Access
- Check connection string has `/incozi` in path

### **"API calls failing on Vercel"**
- Verify `config.js` has correct Render URL
- Check CORS settings in server.js
- Look at browser console for actual error

### **"CORS error"**
- Already fixed in server.js with regex patterns
- If still issues, check `cors` middleware config

---

## **After Deployment:**

1. **Share live link:** `https://incozi-new-[hash].vercel.app`
2. **Test all features:**
   - Sign up new user
   - Login with created account
   - View my services
   - Upload documents
   - View dashboard
3. **Monitor Render/Vercel logs** for any errors

---

## **Quick Reference:**

| Component | URL | Status |
|-----------|-----|--------|
| GitHub | https://github.com/EsarFatima/Incozi_New | ✅ Ready |
| Frontend (Vercel) | https://incozi-new-[hash].vercel.app | 🔄 Deploy now |
| Backend (Render) | https://incozi-backend.onrender.com | 🔄 Deploy now |
| Database (MongoDB) | cluster0.hmks7ya.mongodb.net | ✅ Ready |

