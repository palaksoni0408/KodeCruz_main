# 🔐 Production Authentication Fix Guide

## Overview

This guide explains the authentication bug fixes and how to deploy them to your production environment (Vercel + Render).

---

## 🐛 What Was Fixed

### Root Causes Identified

1. **Missing Endpoints**: Frontend called `/register` and `/token` but these didn't exist in `main.py`
2. **Dual Auth Systems**: Had both old (username-based) and new (email-based) auth systems
3. **No Session Persistence**: Users weren't staying logged in after signup/page refresh
4. **Email Not Saved**: User email field wasn't being persisted to database

### Solutions Implemented

✅ **Added backward-compatible endpoints** (`/register`, `/token`) in `main.py`  
✅ **Added `username` field** to User model for flexible login (email or username)  
✅ **Fixed user creation** to save both email and username  
✅ **Updated authentication** to accept email OR username for login  
✅ **Enhanced error handling** with detailed error messages  
✅ **Fixed frontend auth flow** to properly save and persist tokens  

---

## 📋 Production Deployment Checklist

### ✅ Code Changes (Already Done)

- [x] Updated `app/users/models.py` - added username field
- [x] Updated `app/users/schemas.py` - made email optional, added username
- [x] Updated `app/users/repository.py` - added username lookup functions
- [x] Updated `app/auth/service.py` - login with email or username
- [x] Updated `app/auth/router.py` - enhanced validation
- [x] Added `/register` and `/token` endpoints in `main.py`
- [x] Updated `frontend/src/components/auth/AuthModal.tsx` - better error handling
- [x] Updated `frontend/src/context/AuthContext.tsx` - added username field

### 🔄 Deployment Steps

#### 1. Update Database Schema (CRITICAL)

The User model now has a `username` field. You need to:

**Option A: Using Render PostgreSQL** (Recommended)
```bash
# Add this migration in your backend
# The SQLAlchemy models will auto-create the column on first run
# OR manually add via SQL:
ALTER TABLE users ADD COLUMN username VARCHAR UNIQUE;
CREATE INDEX ix_users_username ON users(username);
```

**Option B: Fresh Database**
- Clear existing database and let SQLAlchemy recreate tables
- Only do this if you don't have important user data

#### 2. Update Environment Variables on **Render** (Backend)

Go to Render Dashboard → Your Service → Environment → Add/Update:

```bash
# Required for Authentication
SECRET_KEY=<generate-new-secure-key>  # IMPORTANT: Generate new key!
DATABASE_URL=<your-postgresql-database-url>  # Must be PostgreSQL, not SQLite

# CORS - Add your Vercel URL
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com

# OAuth (Optional - if using Google/GitHub login)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
```

**Generate a secure SECRET_KEY:**
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

#### 3. Update Environment Variables on **Vercel** (Frontend)

Go to Vercel Dashboard → Your Project → Settings → Environment Variables:

```bash
VITE_API_URL=https://your-backend.onrender.com
VITE_WS_URL=wss://your-backend.onrender.com
```

> **Important**: No trailing slashes!

#### 4. Deploy to Production

**Backend (Render):**
1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Fix authentication system"
   git push origin main
   ```
2. Render will auto-deploy (if auto-deploy is enabled)
3. OR manually deploy from Render Dashboard

**Frontend (Vercel):**
1. Vercel will auto-deploy from GitHub
2. OR redeploy from Vercel Dashboard

---

## 🧪 Testing Production Authentication

### 1. Test Backend Health

```bash
curl https://your-backend.onrender.com/health
# Should return: {"status":"ok","llm":"..."}
```

### 2. Test Registration (New User)

```bash
curl -X POST https://your-backend.onrender.com/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123"
  }'

# Should return: {"access_token":"...", "token_type":"bearer"}
```

### 3. Test Login (Existing User)

```bash
curl -X POST https://your-backend.onrender.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=SecurePass123"

# Should return: {"access_token":"...", "token_type":"bearer"}
```

### 4. Test Get User Info

```bash
TOKEN="<your-access-token>"
curl -H "Authorization: Bearer $TOKEN" \
  https://your-backend.onrender.com/auth/me

# Should return user data with email and username
```

### 5. Test in Browser

1. Open your Vercel app: `https://your-app.vercel.app`
2. Click "Sign Up"
3. Enter:
   - Username: `demouser`
   - Email: `demo@example.com` (optional)
   - Password: `Demo1234`
4. Submit form
5. **Verify**: Should redirect to dashboard/main app
6. **Refresh page** - should stay logged in
7. Check browser DevTools → Application → Local Storage:
   - Should see `token` stored

---

## 🔐 Cross-Origin Authentication (Vercel ↔️ Render)

### How It Works

1. **Frontend (Vercel)** sends login/signup request to **Backend (Render)**
2. **Backend** creates JWT token and returns it
3. **Frontend** stores token in `localStorage`
4. **Frontend** includes token in `Authorization: Bearer <token>` header for all API requests
5. **Backend** validates token and returns user data from `/auth/me`

### CORS Configuration

The backend is already configured to handle CORS properly:

```python
# main.py (already configured)
CORS Middleware:
- allow_origins: from ALLOWED_ORIGINS env variable
- allow_credentials: True
- allow_methods: All
- allow_headers: All
```

**Critical**: Make sure `ALLOWED_ORIGINS` on Render includes your Vercel URL!

---

## 🐛 Troubleshooting Production Issues

### Issue: "CORS Error" in Browser

**Solution:**
1. Check Render → Environment → `ALLOWED_ORIGINS` includes your Vercel URL
2. Ensure no trailing slash in URLs
3. Check browser console for specific CORS error
4. Verify both URLs use HTTPS (not HTTP)

### Issue: "Email already registered" on Fresh Signup

**Solution:**
1. User already exists in database
2. To reset: Either use different email or clear database
3. Or implement "Forgot Password" feature

### Issue: "Could not validate credentials"

**Possible Causes:**
1. Token expired (30 min default)
2. SECRET_KEY changed between login and validation
3. Token not properly sent in Authorization header

**Solution:**
1. Ensure SECRET_KEY is same across deployments
2. Check token expiration time: `ACCESS_TOKEN_EXPIRE_MINUTES=30`
3. Verify frontend sends: `Authorization: Bearer <token>`

### Issue: User Logged Out After Page Refresh

**Cause:** Token not persisting in localStorage

**Solution:**
1. Check browser console for errors
2. Verify `AuthContext.tsx` is properly saving token:
   ```js
   localStorage.setItem('token', token);
   ```
3. Check if browser is blocking localStorage (private mode)

### Issue: Database Connection Error

**Cause:** Using SQLite instead of PostgreSQL

**Solution:**
1. Render requires PostgreSQL for production
2. Set up PostgreSQL database on Render
3. Update `DATABASE_URL` environment variable
4. Format: `postgresql://user:password@host:port/dbname`

---

## 📊 Database Migration

If you have existing users in production and need to add the `username` field:

### Option 1: Alembic Migration (Recommended for Production)

```bash
# Install alembic
pip install alembic

# Initialize alembic (if not already done)
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Add username to users"

# Apply migration
alembic upgrade head
```

### Option 2: Manual SQL (Quick Fix)

Connect to your Render PostgreSQL database and run:

```sql
-- Add username column
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR;

-- Create unique index
CREATE UNIQUE INDEX IF NOT EXISTS ix_users_username ON users(username);

-- Update existing users (set username = email for now)
UPDATE users SET username = email WHERE username IS NULL;
```

---

## 🎯 Validation Steps

After deployment, verify these work:

- [ ] New user signup with username
- [ ] New user signup with email
- [ ] Login with username
- [ ] Login with email
- [ ] Page refresh keeps user logged in
- [ ] User data fetched correctly from `/auth/me`
- [ ] Logout works properly
- [ ] Error messages display correctly
- [ ] CORS works between Vercel and Render

---

## 📝 Environment Variable Summary

### Backend (Render)
| Variable | Required | Example |
|----------|----------|---------|
| `SECRET_KEY` | ✅ Yes | Generate with: `secrets.token_urlsafe(32)` |
| `DATABASE_URL` | ✅ Yes | `postgresql://user:pass@host:5432/db` |
| `ALLOWED_ORIGINS` | ✅ Yes | `https://your-app.vercel.app` |
| `ALGORITHM` | Optional | `HS256` (default) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Optional | `30` (default) |

### Frontend (Vercel)
| Variable | Required | Example |
|----------|----------|---------|
| `VITE_API_URL` | ✅ Yes | `https://your-backend.onrender.com` |
| `VITE_WS_URL` | Optional | `wss://your-backend.onrender.com` |

---

## 🚀 Next Steps

1. **Test Locally First**: Make sure auth works on `localhost` before deploying
2. **Backup Database**: Before migration, backup your production database
3. **Deploy Backend**: Push changes and wait for Render deployment
4. **Update Environment**: Set all required environment variables
5. **Test Backend API**: Use curl to test endpoints
6. **Deploy Frontend**: Let Vercel rebuild with updated code
7. **Test Full Flow**: Signup → Login → Refresh Page → Logout
8. **Monitor Logs**: Check Render logs for any errors

---

## 🆘 Need Help?

If you encounter issues:

1. **Check Render Logs**: Dashboard → Your Service → Logs
2. **Check Vercel Logs**: Dashboard → Your Project → Deployments → View Details
3. **Browser DevTools**: Console + Network tab for frontend errors
4. **Test API Directly**: Use curl or Postman to isolate backend issues

---

**Authentication system is now production-ready! 🎉**
