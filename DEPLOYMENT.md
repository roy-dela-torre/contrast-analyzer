# 🚀 Quick Start & Deployment Guide

## Local Development

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Development Server
```bash
npm run dev
```

### Step 3: Open Browser
Navigate to `http://localhost:3000`

## Production Build

### Build the Application
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## Deploy to Vercel (Easiest - Recommended)

### Method 1: Via Vercel CLI

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Follow the prompts**
   - Set up and deploy
   - Choose project settings
   - Deploy to production

### Method 2: Via Vercel Dashboard

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/roy-dela-torre/contrast-analyzer.git
git push -u origin main
```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select your repository
   - Click "Deploy"

**Done!** Your site will be live at `https://your-project.vercel.app`

## Deploy to Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Deploy**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

## Environment Variables (Optional)

If you need to add API rate limiting or analytics:

```env
# .env.local
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Netlify
1. Go to Domain Settings
2. Add custom domain
3. Configure DNS

## Performance Optimization

The app is already optimized with:
- ✅ Server-side rendering (Next.js)
- ✅ Code splitting
- ✅ Image optimization
- ✅ CSS minification
- ✅ Tree shaking

## Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

### TypeScript Errors
```bash
# Check types
npm run build
```

## Monitoring

### Add Analytics (Optional)

**Google Analytics:**
```typescript
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## Support

Need help? Check:
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

Happy deploying! 🎉
