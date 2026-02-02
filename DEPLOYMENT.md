# Railway Deployment Guide for myTROUVEpro Backend

## Quick Deploy to Railway.app (FREE)

### Step 1: Prepare Environment Variables
Create a `.env` file with:

```
# Server
PORT=3001
NODE_ENV=production
JWT_SECRET=your_long_random_secret

# CORS Origins
FRONTEND_URL=https://mytrouvepro11.netlify.app
```

### Step 2: Deploy to Railway

1. **Go to Railway.app**
   ```
   https://railway.app
   ```

2. **Create Account** (use GitHub)

3. **New Project** → **Deploy from GitHub repo**
   - Select your myTROUVEpro repository
   - Root directory: `/` (or wherever server.js is)

4. **Add Environment Variables**
   - Go to Variables tab
   - Add all variables from .env file

5. **Configure Start Command**
   - Settings → Deploy
   - Build Command: `npm install`
   - Start Command: `node server.js`

6. **Deploy**
   - Railway will auto-deploy
   - You'll get a URL like: `https://mytrouvepro-production.up.railway.app`

### Step 3: Update Frontend

In your Netlify environment variables:
```
VITE_BACKEND_URL=https://your-railway-url.up.railway.app
```

### Step 4: Test Backend

```bash
# Test health check
curl https://your-railway-url.up.railway.app/

# Test registration
curl -X POST https://your-railway-url.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!","name":"Test User","role":"customer"}'
```

---

## Alternative: Render.com (Also FREE)

1. Go to render.com
2. New → Web Service
3. Connect GitHub repo
4. Configure:
   - Name: mytrouvepro-backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Add environment variables
6. Create Web Service

---

## DNS Configuration (Optional)

If you have a custom domain:

### Railway:
1. Settings → Domains
2. Add custom domain: `api.mytrouvepro.com`
3. Add CNAME record in your DNS:
   ```
   CNAME api.mytrouvepro.com → your-app.up.railway.app
   ```

---

## Environment Variables Checklist

- [ ] JWT_SECRET
- [ ] PORT (usually 3001)
- [ ] FRONTEND_URL (your Netlify URL)

---

## Deployment Verification

After deployment, verify:

1. **Health Check:**
   ```bash
   curl https://your-backend-url/
   ```
   Should return: `{"status":"online",...}`

2. **Auth Health:**
   ```bash
   curl https://your-backend-url/api/health
   ```
   Should return: `{"status":"ok"}`

---

## Cost Estimates

| Service | Free Tier | Paid Start |
|---------|-----------|------------|
| Railway | 500 hrs/month | $5/month |
| Render | 750 hrs/month | $7/month |
| Vercel | Unlimited serverless | $20/month for teams |

**Recommendation:** Start with Railway free tier

---

## Next Steps After Deployment

1. Monitor logs in Railway dashboard
2. Set up error tracking (Sentry)
3. Configure auto-deploy on git push
