[README.md](https://github.com/user-attachments/files/24540495/README.md)
# myTROUVEpro - Deployment Guide

## 🚀 Quick Deploy to Netlify (Recommended - FREE)

### Option A: Drag & Drop (Easiest!)
1. Go to [netlify.com](https://netlify.com)
2. Sign up / Log in (free)
3. Click **"Add new site"** → **"Deploy manually"**
4. **Drag & drop** the entire `deploy` folder
5. ✅ **Your site is live!**

You'll get a URL like: `random-name-123.netlify.app`

### Option B: Change to Custom Name
1. After deploy, go to **Site settings**
2. Click **"Change site name"**
3. Enter: `mytrouvepro`
4. Your URL: `mytrouvepro.netlify.app`

---

## 🌐 Custom Domain Setup

### Buy a Domain (~$12-15/year)
- [Namecheap](https://namecheap.com) - `mytrouvepro.ca`
- [Google Domains](https://domains.google)
- [GoDaddy](https://godaddy.com)

### Connect to Netlify
1. In Netlify: **Domain settings** → **Add custom domain**
2. Enter: `mytrouvepro.ca`
3. At your domain registrar, add DNS records:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: mytrouvepro.netlify.app
   ```
4. Wait 5-30 minutes for propagation
5. Netlify auto-enables FREE SSL (https)

---

## 📁 Deployment Package Contents

```
deploy/
├── index.html        # Main app
├── manifest.json     # PWA configuration
├── sw.js            # Service worker (offline support)
└── icons/
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-120.png
    ├── icon-128.png
    ├── icon-144.png
    ├── icon-152.png
    ├── icon-180.png
    ├── icon-192.png
    ├── icon-384.png
    ├── icon-512.png
    ├── icon.svg
    └── og-image.png
```

---

## 🔧 Alternative Hosting Options

### GitHub Pages (FREE)
1. Create GitHub account
2. New repository: `mytrouvepro`
3. Upload all files from `deploy/` folder
4. Settings → Pages → Enable
5. Live at: `username.github.io/mytrouvepro`

### Vercel (FREE)
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import or drag & drop
4. Live instantly!

### Firebase Hosting (FREE tier)
1. Install: `npm install -g firebase-tools`
2. `firebase login`
3. `firebase init hosting`
4. `firebase deploy`

---

## 📱 PWA Features Included

- ✅ **Installable** - Add to home screen
- ✅ **Offline Support** - Works without internet
- ✅ **Native App Feel** - No browser bars
- ✅ **Push Ready** - Notification support prepared
- ✅ **Fast Loading** - Cached resources
- ✅ **Responsive** - All screen sizes

---

## 🔐 SSL Certificate

Netlify, Vercel, and GitHub Pages all provide **FREE SSL** automatically!

Your site will be secure with `https://`

---

## 📊 After Launch Checklist

- [ ] Test on mobile (Android & iOS)
- [ ] Test "Add to Home Screen"
- [ ] Verify all pages work
- [ ] Check offline mode
- [ ] Submit to Google Search Console
- [ ] Set up Google Analytics (optional)

---

## 🆘 Need Help?

- Netlify Docs: https://docs.netlify.com
- PWA Guide: https://web.dev/progressive-web-apps/

---

## 📞 Company Info

**Performance Cristal Technologies Avancées S.A.**
- NEQ: 2280629637
- Location: Laval, Quebec, Canada
- Website: mytrouvepro.ca

---

© 2025 myTROUVEpro. All rights reserved.
