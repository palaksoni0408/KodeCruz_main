# 🚀 Complete Deployment Guide - KodesCruxx

## Overview
This guide provides step-by-step instructions for deploying the KodesCruxx platform:
- **Backend**: FastAPI application on Render
- **Frontend**: React/Vite application on Vercel

---

## 📋 Prerequisites

### Required Accounts
- [GitHub](https://github.com) account
- [Render](https://render.com) account (for backend)
- [Vercel](https://vercel.com) account (for frontend)

### Required API Keys
- **OpenAI API Key** (for primary LLM)
- **Groq API Key** (for fallback LLM)
- **Piston API URL** (for code execution) - Default: `https://emkc.org/api/v2/piston`

---

## 🔧 Part 1: Backend Deployment (Render)

### Step 1: Prepare Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create Render Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `kodescruxx-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (uses root)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: Leave empty (uses Procfile)

### Step 3: Configure Environment Variables
In Render dashboard, add these environment variables:

```bash
# Database Configuration (use Render PostgreSQL or Neon)
DATABASE_URL=postgresql://user:password@host:port/database

# Security
SECRET_KEY=your-super-secret-key-min-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# AI/LLM Configuration
OPENAI_API_KEY=sk-your-openai-api-key
GROQ_API_KEY=gsk_your-groq-api-key

# Code Execution
PISTON_API_URL=https://emkc.org/api/v2/piston

# CORS (add your Vercel frontend URL after deployment)
ALLOWED_ORIGINS=https://your-frontend.vercel.app

# Optional: OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Stack Auth (if using)
STACK_JWKS_URL=your-stack-jwks-url
STACK_ISSUER=your-stack-issuer
STACK_AUDIENCE=your-stack-audience

# Development/Production
DEBUG=False
```

### Step 4: Deploy Backend
1. Click **"Create Web Service"**
2. Wait for the build to complete (5-10 minutes)
3. Your backend will be available at: `https://kodescruxx-backend.onrender.com`

### Step 5: Test Backend
```bash
# Test health endpoint
curl https://kodescruxx-backend.onrender.com/health

# Expected response:
# {"status":"ok","message":"Backend is healthy"}
```

---

## 🎨 Part 2: Frontend Deployment (Vercel)

### Step 1: Update Frontend Environment Variable
Create `frontend/.env.production`:
```bash
VITE_API_URL=https://kodescruxx-backend.onrender.com
```

Commit and push:
```bash
git add frontend/.env.production
git commit -m "Add production API URL"
git push origin main
```

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Configure Environment Variables in Vercel
1. Go to Project Settings → Environment Variables
2. Add:
   ```bash
   VITE_API_URL=https://kodescruxx-backend.onrender.com
   ```
3. Apply to: Production, Preview, Development

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. Your frontend will be available at: `https://your-project.vercel.app`

---

## 🔄 Part 3: Post-Deployment Configuration

### Update CORS on Backend
1. Go to your Render dashboard
2. Navigate to Environment Variables
3. Update `ALLOWED_ORIGINS` to include your Vercel URL:
   ```bash
   ALLOWED_ORIGINS=https://your-project.vercel.app
   ```
4. Save and wait for automatic redeploy

### Update Frontend API URL (if needed)
If your Vercel URL is different, update the environment variable in Vercel dashboard and redeploy.

---

## ✅ Part 4: Verification

### Test Backend
```bash
# Health check
curl https://kodescruxx-backend.onrender.com/health

# Wake endpoint
curl https://kodescruxx-backend.onrender.com/wake

# Supported languages
curl https://kodescruxx-backend.onrender.com/supported_languages
```

### Test Frontend
1. Open your Vercel URL in browser
2. Try "Explain Code" feature with sample code
3. Verify it works without authentication (demo mode)
4. Check browser console for any CORS errors

### Test Integration
1. Open browser developer tools (F12)
2. Go to Network tab
3. Use any feature on the frontend
4. Verify requests go to your Render backend URL
5. Check for successful responses (200 status codes)

---

## 🚨 Troubleshooting

### Backend Issues

**Build Failed**
- Check `requirements.txt` is present
- Verify Python version in `runtime.txt` (should be `python-3.11.6`)
- Review build logs in Render dashboard

**Service Won't Start**
- Check Procfile is correct
- Verify all environment variables are set
- Review runtime logs in Render dashboard

**CORS Errors**
- Ensure `ALLOWED_ORIGINS` includes your Vercel URL
- Check that URL doesn't have trailing slash
- Wait for Render to redeploy after env var changes

### Frontend Issues

**Build Failed**
- Verify `package.json` and `package-lock.json` are committed
- Check build logs in Vercel dashboard
- Ensure Node version compatibility

**Blank Page**
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly
- Test API endpoint directly in browser

**API Connection Failed**
- Verify backend is running on Render
- Check `VITE_API_URL` matches Render URL exactly
- Ensure CORS is configured correctly on backend

### Database Issues

**Connection Failed**
- Verify `DATABASE_URL` is correct
- Check database is accessible from Render
- Test database connection separately

---

## 🔐 Security Checklist

- [ ] `SECRET_KEY` is unique and at least 32 characters
- [ ] All API keys are stored in environment variables (not in code)
- [ ] `.env` file is in `.gitignore`
- [ ] `DEBUG=False` in production
- [ ] CORS origins are restricted to your frontend URL only
- [ ] Database uses SSL connection
- [ ] OAuth secrets are properly configured (if using)

---

## 📊 Monitoring & Maintenance

### Render Monitoring
- Monitor service health in dashboard
- Set up alerts for downtime
- Review logs regularly
- Monitor resource usage

### Vercel Monitoring
- Check deployment logs
- Monitor build times
- Review analytics
- Track Core Web Vitals

### Recommended Actions
- Enable automatic deployments from GitHub main branch
- Set up environment-specific branches (dev, staging, production)
- Configure custom domains (optional)
- Enable CDN caching for static assets
- Monitor API usage and quotas

---

## 🎯 Quick Reference

### Important URLs
- Backend Health: `https://kodescruxx-backend.onrender.com/health`
- Backend API Docs: `https://kodescruxx-backend.onrender.com/docs`
- Frontend: `https://your-project.vercel.app`

### Deployment Commands
```bash
# Backend (auto-deploys from GitHub)
git push origin main

# Frontend via CLI
cd frontend && vercel --prod

# Force redeploy backend
# (use Render dashboard → Manual Deploy → Deploy Latest Commit)
```

---

## 🆘 Support Resources

- **Render Documentation**: https://render.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **FastAPI Documentation**: https://fastapi.tiangolo.com
- **Vite Documentation**: https://vitejs.dev

---

## 📝 Environment Variables Reference

### Backend (Render)
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `SECRET_KEY` | Yes | JWT signing key (32+ chars) | `your-secret-key-here` |
| `OPENAI_API_KEY` | Yes | OpenAI API key | `sk-...` |
| `GROQ_API_KEY` | Yes | Groq API key | `gsk_...` |
| `ALLOWED_ORIGINS` | Yes | Frontend URL for CORS | `https://yourapp.vercel.app` |
| `DEBUG` | No | Debug mode (use False) | `False` |
| `PISTON_API_URL` | No | Code execution API | `https://emkc.org/api/v2/piston` |

### Frontend (Vercel)
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | Yes | Backend API URL | `https://yourapp.onrender.com` |

---

**🎉 Congratulations!** Your KodesCruxx platform is now deployed and ready for production use!
