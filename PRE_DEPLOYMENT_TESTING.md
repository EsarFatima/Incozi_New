# INCOZI Pre-Deployment Testing Checklist

**Date:** March 24, 2026  
**Status:** Ready for Local Testing  
**Database:** Healthy ✅  

---

## 📋 Phase 1: Local Environment Setup (5 min)

### 1. Install Dependencies
```bash
cd c:\Users\esaar\Incozi\Incozi
npm install
```

**Expected Result:** No errors, dependencies installed ✅

### 2. Verify Environment Variables
Check `.env.local` file exists with:
```
REACT_APP_API_URL=http://localhost:3000/api
```

**Expected Result:** File exists, can connect to local API ✅

### 3. Start Development Server
```bash
npm run dev
```

**Expected Result:** 
- React starts on http://localhost:3000
- Express starts on http://localhost:3000/api
- No errors in console ✅

---

## 🧪 Phase 2: Critical Function Testing (20 min)

### Test 1: Home Page Loads ✅
- [ ] Open http://localhost:3000
- [ ] Page loads without errors
- [ ] Header visible with logo "INCOZI"
- [ ] Footer visible at bottom
- [ ] Services section shows (may be empty if no services in DB)

**If errors:** Check browser console (F12) for error messages

---

### Test 2: Navigation Works ✅
- [ ] Click "Services" in header → Should go to /services
- [ ] Click "Book Now" → Should go to /consultation
- [ ] Click "INCOZI" logo → Should go to Home
- [ ] Click on mobile menu icon (if on mobile view) → Menu opens

**Expected:** All links work without page reload (React Router) ✅

---

### Test 3: Authentication System ✅

#### Test 3A: Register New User
1. Click "Sign In" button in header
2. Click "Sign up" link
3. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: TestPass123
   - Account Type: Client
4. Click "Create Account"

**Expected Results:**
- [ ] No errors
- [ ] Redirected to Dashboard
- [ ] Header shows "Welcome, Test User!" in dropdown
- [ ] Token saved (check localStorage in DevTools)

**If fails:** Check:
- Backend running? (`npm run dev` output shows Express)
- API URL correct in .env.local?
- Network tab (F12) → Check API request status

---

#### Test 3B: Logout & Login
1. Click user dropdown in header
2. Click "Logout"
3. Redirected to Home, header shows "Sign In" button

**Expected Results:**
- [ ] Token cleared from localStorage
- [ ] User logged out ✅

#### Test 3C: Login with Previous Account
1. Click "Sign In"
2. Enter credentials:
   - Email: test@example.com
   - Password: TestPass123
3. Click "Sign In"

**Expected Results:**
- [ ] Logged in successfully
- [ ] Redirected to Dashboard
- [ ] Token saved ✅

---

### Test 4: Services Page ✅
1. Navigate to `/services`
2. Page should load

**Expected Results:**
- [ ] Page loads
- [ ] "All" button selected by default
- [ ] Categories visible (Bookkeeping, Tax, etc.)
- [ ] Services display (empty if no services in DB)

**If empty services:**
- [ ] This is OK for testing - add test data via Supabase directly if needed
- [ ] Or check backend `POST /api/services` endpoint

---

### Test 5: Consultation Booking ✅
1. Navigate to `/consultation`
2. Fill form:
   - Service: "Bookkeeping"
   - Date: Select future date
   - Time: Select time
   - Notes: "Test booking"
3. Click "Book Consultation"

**Expected Results:**
- [ ] Form submission works
- [ ] No errors in console
- [ ] Data sent to backend (check Network tab in F12)
- [ ] Consultation saved to Supabase (optional: verify in DB)

---

### Test 6: Shopping Cart ✅
1. Cart badge in header shows "0"
2. After adding services, badge should increment

**Expected Results:**
- [ ] Cart functionality works
- [ ] Badge updates correctly

---

### Test 7: Admin Access ✅
1. Register user with role: "Consultant" (if available)
2. Try accessing `/admin`

**Expected Results:**
- [ ] Consultant can see admin features (or restricted message)
- [ ] Proper access control working

---

### Test 8: Protected Routes ✅
1. Logout completely
2. Try accessing `/dashboard` directly via URL
3. Try accessing `/checkout` directly

**Expected Results:**
- [ ] Redirects to login page or shows "Access Denied"
- [ ] Can't access protected pages without login ✅

---

### Test 9: Mobile Responsiveness ✅
1. Press F12 (DevTools)
2. Click device toggle (mobile icon)
3. Select "iPhone 12" or "iPad"

**Expected Results:**
- [ ] Header collapses to mobile menu
- [ ] Navigation responsive
- [ ] Buttons clickable
- [ ] No horizontal scrolling
- [ ] Text readable

---

### Test 10: API Connection to Supabase ✅
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for API requests

**Expected Results:**
- [ ] Requests to `http://localhost:3000/api/*` show status 200
- [ ] No 500 errors
- [ ] Data loads from Supabase

**If 500 errors:**
- [ ] Check backend console for error messages
- [ ] Verify Supabase credentials in backend `.env`
- [ ] Check database tables exist

---

## ⚠️ Common Issues & Solutions

### Issue: React won't start
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm cache clean --force
npm install
npm run dev
```

### Issue: Port 3000 already in use
```bash
# Use different port
PORT=3001 npm run dev
```

### Issue: API calls failing (network errors)
**Check:**
1. Is backend running? (Should see Express messages in console)
2. Is `.env.local` correct?
3. Is Supabase database online? (Check dashboard)
4. Check browser console for error details

### Issue: Services not loading
**Check:**
1. Supabase database online
2. `services` table exists
3. Table has data (add test data in Supabase dashboard)
4. Backend can access Supabase (test in backend logs)

---

## ✅ Phase 3: Final Checks Before Deployment

### Database Checks
- [ ] Supabase showing "Healthy"
- [ ] Can read from services table
- [ ] Can write test data (create user, booking)

### Code Quality Checks
- [ ] No console errors (F12 → Console)
- [ ] No console warnings (preferably)
- [ ] All pages load without lag

### Performance Checks
- [ ] Home page loads in < 2 seconds
- [ ] Services page loads in < 2 seconds
- [ ] Navigation is instant (no lag)

---

## 📝 Test Results Recording

### Critical Tests (Must Pass ✅)
- [ ] Home page loads
- [ ] Register works
- [ ] Login works
- [ ] Services load
- [ ] Dashboard accessible when logged in
- [ ] Logout works
- [ ] Protected pages redirect when not logged in

### Important Tests (Should Pass ✅)
- [ ] Consultation booking submits
- [ ] Cart functions
- [ ] Mobile responsive
- [ ] API calls reach backend
- [ ] Database saves data

### Nice to Have Tests (Can Fail 🔄)
- [ ] Admin panel features
- [ ] Advanced filtering
- [ ] Animations smooth

---

## 🚀 When All Tests Pass

Once you've completed and passed all critical tests, you're ready for:
1. Production build: `npm run build`
2. Vercel deployment
3. GoDaddy domain setup
4. Go live! 🎉

---

## 🆘 If Tests Fail

### Document the failure:
1. **What test failed?**
2. **What was expected?**
3. **What actually happened?**
4. **Screenshot or error message?**

Then share with me and I'll help fix it before deployment!

---

**Status:** Ready to test locally 🧪  
**Next Step:** Run `npm run dev` and start testing!  
**Time Estimate:** 30 minutes total  

Let me know when you start testing! 👍
