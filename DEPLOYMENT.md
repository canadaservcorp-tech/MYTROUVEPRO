# Railway Deployment Guide for myTROUVEpro Backend

## Quick Deploy to Railway.app (FREE)

### Step 1: Prepare Environment Variables
Create a `.env` file with:

```
# Square Configuration
SQUARE_ACCESS_TOKEN=your_square_access_token_here
SQUARE_APPLICATION_ID=your_square_app_id_here
SQUARE_LOCATION_ID=your_square_location_id_here
SQUARE_ENVIRONMENT=sandbox

# Server
PORT=3001
NODE_ENV=production
ADMIN_API_KEY=your_strong_admin_key
MAX_PAYMENT_AMOUNT_CAD=10000
ENFORCE_HTTPS=true

# CORS Origins
CORS_ALLOWED_ORIGINS=https://mytrouvepro11.netlify.app,https://mytrouvepro.com
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
   - **IMPORTANT:** Use PRODUCTION Square credentials when ready

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
VITE_BACKEND_URL=https://your-railway-url.up.railway.app  # Required for payment processing
```

### Step 4: Test Backend

```bash
# Test health check
curl https://your-railway-url.up.railway.app/

# Test Square connection
curl -H "x-api-key: your_strong_admin_key" https://your-railway-url.up.railway.app/api/test

# Test config
curl https://your-railway-url.up.railway.app/api/config
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

## Alternative: Vercel Serverless

Create `api/` folder with serverless functions:

**api/create-payment.js:**
```javascript
const { Client, Environment } = require('square');

module.exports = async (req, res) => {
  // Your Square payment logic
};
```

Deploy: `vercel --prod`

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

- [ ] SQUARE_ACCESS_TOKEN
- [ ] SQUARE_APPLICATION_ID  
- [ ] SQUARE_LOCATION_ID
- [ ] SQUARE_ENVIRONMENT (sandbox or production)
- [ ] PORT (usually 3001)
- [ ] ADMIN_API_KEY (keep secret)
- [ ] MAX_PAYMENT_AMOUNT_CAD
- [ ] ENFORCE_HTTPS (true in production)
- [ ] CORS_ALLOWED_ORIGINS (comma-separated)

---

## Deployment Verification

After deployment, verify:

1. **Health Check:**
   ```bash
   curl https://your-backend-url/
   ```
   Should return: `{"status":"online",...}`

2. **Square Connection:**
   ```bash
   curl -H "x-api-key: your_strong_admin_key" https://your-backend-url/api/test
   ```
   Should return: `{"success":true,"location":{...}}`

3. **CORS:**
   From browser console on Netlify site:
   ```javascript
   fetch('https://your-backend-url/api/config')
     .then(r => r.json())
     .then(console.log)
   ```

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

1. Update SquarePayment.jsx to use new backend URL
2. Test payment flow end-to-end
3. Monitor logs in Railway dashboard
4. Set up error tracking (Sentry)
5. Configure auto-deploy on git push
