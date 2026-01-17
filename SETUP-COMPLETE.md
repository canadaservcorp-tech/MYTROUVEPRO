# 🚀 myTROUVEpro COMPLETE SETUP GUIDE

**Complete this setup in ~2 hours to go live**

---

## ✅ PHASE 1: SUPABASE DATABASE SETUP (15 min)

### 1.1 Create Supabase Project
```
1. Go to https://supabase.com
2. Sign up (free tier)
3. Create new project:
   - Name: mytrouvepro
   - Database Password: (save this!)
   - Region: Canada Central (closest to Quebec)
   - Plan: Free
4. Wait 2 minutes for database creation
```

### 1.2 Run Database Schema
```
1. In Supabase dashboard → SQL Editor
2. Open file: /database/schema.sql
3. Copy entire content
4. Paste in SQL Editor
5. Click "Run"
6. Verify: Tables tab should show 10+ tables
```

### 1.3 Get Supabase Credentials
```
1. Settings → API
2. Copy these values:
   ✓ Project URL
   ✓ anon public key
   ✓ service_role key (secret!)
```

---

## ✅ PHASE 2: BACKEND DEPLOYMENT (30 min)

### 2.1 Deploy to Railway

```bash
# Option A: Railway CLI (fastest)
npm install -g @railway/cli
railway login
railway init
railway up

# Option B: Railway Web (easier)
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repo
4. Root Directory: / (or where server.js is)
```

### 2.2 Configure Environment Variables in Railway

```
Settings → Variables → Add All:

SQUARE_ACCESS_TOKEN=sq0atp-xxxxxxxx
SQUARE_APPLICATION_ID=sq0idp-xxxxxxxx
SQUARE_LOCATION_ID=Lxxxxxxxx
SQUARE_ENVIRONMENT=sandbox
PORT=3001
NODE_ENV=production
ADMIN_API_KEY=your_strong_admin_key
MAX_PAYMENT_AMOUNT_CAD=10000
ENFORCE_HTTPS=true
CORS_ALLOWED_ORIGINS=https://mytrouvepro11.netlify.app,https://mytrouvepro.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2.3 Verify Deployment

```bash
# Get your Railway URL from dashboard
# Test endpoints:

curl https://your-app.up.railway.app/
# Should return: {"status":"online",...}

curl -H "x-api-key: your_strong_admin_key" https://your-app.up.railway.app/api/test
# Should return Square location info

curl https://your-app.up.railway.app/api/config
# Should return Square app ID
```

---

## ✅ PHASE 3: FRONTEND UPDATES (30 min)

### 3.1 Update Environment Variables in Netlify

```
1. Netlify Dashboard → Site Settings → Environment Variables
2. Add these:

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_BACKEND_URL=https://your-app.up.railway.app
VITE_SQUARE_APPLICATION_ID=sq0idp-xxxxxxxx
VITE_SQUARE_LOCATION_ID=Lxxxxxxxx
VITE_SQUARE_ENVIRONMENT=sandbox
```

### 3.2 Replace Files

**Upload new files to your GitHub repo:**

```
/src/data/categories.js          (62 categories)
/src/lib/supabase.js             (Supabase client)
/src/contexts/AuthContext-Supabase.jsx  (New auth)
/src/components/PhotoUploadWithWatermark.jsx
/database/schema.sql
/.env.example
/DEPLOYMENT.md
```

### 3.3 Update Package.json

```bash
# Add Supabase dependency
npm install @supabase/supabase-js
```

Or use the provided `package-frontend.json`

### 3.4 Update imports

**In your main App.jsx or wherever AuthContext is used:**

```javascript
// OLD:
import { AuthProvider } from './AuthContext';

// NEW:
import { AuthProvider } from './contexts/AuthContext-Supabase';
```

**In ServicesPage.jsx (already done):**
```javascript
import { categories, getCategoryName } from '../data/categories';
```

---

## ✅ PHASE 4: TESTING (30 min)

### 4.1 Test User Registration

```
1. Go to your site
2. Click Sign Up
3. Create provider account
4. Check Supabase:
   - Dashboard → Table Editor → users
   - Should see new user
```

### 4.2 Test Photo Upload & Watermark

```
1. Provider Dashboard → Add Service
2. Upload photo
3. Verify watermark visible on preview
4. Save service
5. Check if image saved to Supabase Storage (if configured)
```

### 4.3 Test Square Payments

```
1. As seeker, book a service
2. Proceed to checkout
3. Use Square test card: 4111 1111 1111 1111
4. Verify payment in Square Dashboard
5. Check booking in Supabase → bookings table
```

### 4.4 Test 60+ Categories

```
1. Go to Services page
2. Scroll category sidebar
3. Should see 62 categories
4. Click different categories
5. Verify filtering works
```

---

## ✅ PHASE 5: PRODUCTION READINESS (30 min)

### 5.1 Security Checklist

- [ ] Change Supabase password
- [ ] Never commit .env files
- [ ] Enable RLS policies in Supabase
- [ ] Add rate limiting to backend
- [ ] Enable HTTPS only
- [ ] Set ADMIN_API_KEY for admin endpoints
- [ ] Add CSP headers

### 5.2 Switch to Production Square

```
1. Square Dashboard → Production
2. Get production credentials
3. Update environment variables:
   SQUARE_ENVIRONMENT=production
   SQUARE_ACCESS_TOKEN=prod_token
4. Redeploy backend
```

### 5.3 Add Terms & Privacy

```
Create pages:
- /terms-of-service
- /privacy-policy
- /refund-policy
```

### 5.4 Setup Monitoring

```bash
# Add error tracking
npm install @sentry/react

# Add analytics
Add Google Analytics script to index.html
```

---

## 🎯 DEPLOYMENT CHECKLIST

Before sharing QR code:

### Database
- [ ] Supabase project created
- [ ] Schema deployed (10+ tables)
- [ ] Test user created successfully
- [ ] RLS policies enabled

### Backend
- [ ] Deployed to Railway/Render
- [ ] Environment variables configured
- [ ] Health check passing
- [ ] Square connection working
- [ ] CORS configured for Netlify

### Frontend  
- [ ] Netlify environment variables set
- [ ] New files uploaded to GitHub
- [ ] npm install @supabase/supabase-js
- [ ] Site rebuilt and deployed
- [ ] No console errors

### Features
- [ ] User registration working
- [ ] Login/logout working
- [ ] 60+ categories visible
- [ ] Photo watermarking working
- [ ] Square payments processing
- [ ] Bookings saving to database

### Testing
- [ ] Create test provider account
- [ ] Add test service with photos
- [ ] Create test seeker account
- [ ] Make test booking
- [ ] Process test payment
- [ ] Verify data in Supabase

### Polish
- [ ] Mobile responsive
- [ ] French/English toggle working
- [ ] Error messages clear
- [ ] Loading states present
- [ ] Terms/Privacy pages added

---

## 📊 AFTER DEPLOYMENT

### Monitor Performance

```bash
# Railway logs
railway logs

# Supabase logs
Dashboard → Logs

# Netlify logs
Site → Deploys → Log
```

### Backup Strategy

```
1. Supabase: Automatic daily backups (free tier)
2. Code: Git repository
3. Database exports: Weekly manual backup
```

---

## 🆘 TROUBLESHOOTING

### "Cannot connect to database"
```
Check Supabase URL and keys in .env
Verify RLS policies don't block access
```

### "Square payment failed"
```
Check Square credentials
Verify sandbox vs production mode
Check backend logs in Railway
```

### "Images not uploading"
```
Configure Supabase Storage bucket
Update storage policies
Check file size limits
```

### "Categories not showing"
```
Verify import path: ../data/categories
Check build logs for errors
Clear browser cache
```

---

## 📞 SUPPORT RESOURCES

- Supabase Docs: https://supabase.com/docs
- Square API Docs: https://developer.squareup.com
- Railway Docs: https://docs.railway.app
- React Router: https://reactrouter.com

---

## 🎉 READY TO LAUNCH?

After completing all checklists:

1. ✅ Test everything one final time
2. ✅ Share QR code (from earlier)
3. ✅ Monitor first users closely
4. ✅ Collect feedback
5. ✅ Iterate and improve

**Time to launch: ~2 hours of focused work**

Good luck! 🚀
