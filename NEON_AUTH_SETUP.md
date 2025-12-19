# Neon Auth Integration Guide

## ✅ What Was Done

Your React app has been fully integrated with **Neon Auth** for authentication. Here's what changed:

### 1. **Dependencies Added**
- `@stackframe/react` - Neon Auth React SDK
- `react-router-dom` - Required for Neon Auth routing

### 2. **Files Created/Modified**

#### New Files:
- `frontend/src/stack.ts` - Neon Auth client configuration
- `frontend/.env.example` - Environment variable template

#### Modified Files:
- `frontend/package.json` - Added Neon Auth dependencies
- `frontend/src/main.tsx` - Added StackProvider, StackHandler, and BrowserRouter
- `frontend/src/context/AuthContext.tsx` - Now uses Neon Auth hooks instead of custom auth
- `frontend/src/components/LandingPage.tsx` - Signup/login buttons now redirect to Neon Auth

### 3. **How It Works**

- **Signup/Login**: Users click "Get Started" or "Log In" → Redirects to `/handler/sign-up` or `/handler/sign-in` (Neon Auth hosted pages)
- **Authentication**: Neon Auth handles all authentication (email/password, Google OAuth, etc.)
- **User Data**: Stored automatically in your Neon Postgres database
- **Session**: Managed by Neon Auth SDK (tokens stored in localStorage)

---

## 🔧 Setup Steps

### Step 1: Get Neon Auth Keys

1. Go to your **Neon Dashboard** → **KodesCruz** project
2. Click **"Auth"** in the left sidebar
3. Enable **Neon Auth** if not already enabled
4. Copy these values:
   - **Project ID** → `VITE_STACK_PROJECT_ID`
   - **Publishable Client Key** → `VITE_STACK_PUBLISHABLE_CLIENT_KEY`
   - **Secret Server Key** → `STACK_SECRET_SERVER_KEY` (for backend later)

### Step 2: Configure Google OAuth (Optional but Recommended)

1. In Neon Auth dashboard → **Providers** → **Google**
2. Follow Neon's instructions to set up Google OAuth
3. Add your redirect URLs:
   - `https://kodes-cruxx-agbn.vercel.app/handler/callback`
   - `http://localhost:5173/handler/callback` (for local dev)

### Step 3: Set Environment Variables on Vercel

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**:

```
VITE_STACK_PROJECT_ID=your-neon-auth-project-id
VITE_STACK_PUBLISHABLE_CLIENT_KEY=your-neon-auth-publishable-key
VITE_API_URL=https://kodescruxx-backend-gnlc.onrender.com
```

**Important**: Set these for **Production**, **Preview**, and **Development** environments.

### Step 4: Set Environment Variables Locally

Create `frontend/.env.local`:

```bash
VITE_STACK_PROJECT_ID=your-neon-auth-project-id
VITE_STACK_PUBLISHABLE_CLIENT_KEY=your-neon-auth-publishable-key
VITE_API_URL=http://localhost:8000
```

### Step 5: Install Dependencies

```bash
cd frontend
npm install
```

### Step 6: Test Locally

```bash
npm run dev
```

Visit:
- **Signup**: http://localhost:5173/handler/sign-up
- **Login**: http://localhost:5173/handler/sign-in

### Step 7: Deploy to Vercel

After setting environment variables, redeploy:
- Vercel will auto-deploy on git push, OR
- Go to Vercel Dashboard → **Deployments** → **Redeploy**

---

## 🎯 How to Use

### For Users:
1. Click **"Get Started"** or **"Log In"** on the landing page
2. Redirected to Neon Auth signup/login page
3. Can sign up with:
   - Email + Password
   - Google (if configured)
   - Other providers you enable in Neon Auth

### For Developers:

**Check if user is authenticated:**
```tsx
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;
  
  return <div>Welcome, {user?.email}!</div>;
}
```

**Sign out:**
```tsx
const { logout } = useAuth();
<button onClick={logout}>Sign Out</button>;
```

**Access Neon Auth directly:**
```tsx
import { useStackApp } from '@stackframe/react';

const stackApp = useStackApp();
// Use stackApp methods for advanced auth operations
```

---

## 🔗 Important URLs

- **Signup**: `/handler/sign-up`
- **Login**: `/handler/sign-in`
- **Profile**: `/handler/profile` (Neon Auth default)
- **Callback**: `/handler/callback` (handled automatically)

---

## 🐛 Troubleshooting

### Issue: "VITE_STACK_PROJECT_ID is not defined"
**Solution**: Make sure environment variables are set in Vercel and `.env.local` for local dev.

### Issue: Users can't sign up/login
**Solution**: 
1. Check Neon Auth dashboard → Verify Auth is enabled
2. Check browser console for errors
3. Verify redirect URLs match your domain

### Issue: Google OAuth not working
**Solution**:
1. Verify Google OAuth is configured in Neon Auth dashboard
2. Check redirect URLs include your domain
3. Ensure Google Cloud Console has correct OAuth settings

### Issue: Users not appearing in database
**Solution**: 
1. Check Neon Auth dashboard → Users tab
2. Verify DATABASE_URL is set correctly on Render
3. Check Neon Postgres → Tables → `stack_users` table

---

## 📚 Next Steps

1. **Customize Neon Auth UI**: You can customize the signup/login pages in Neon Auth dashboard
2. **Add More Providers**: Enable GitHub, Discord, etc. in Neon Auth
3. **Backend Integration**: Update your FastAPI backend to validate Neon Auth tokens (if needed)
4. **User Profiles**: Use Neon Auth's built-in profile management

---

## ✅ Checklist

- [ ] Neon Auth enabled in Neon dashboard
- [ ] Environment variables set on Vercel
- [ ] Environment variables set locally (`.env.local`)
- [ ] Dependencies installed (`npm install`)
- [ ] Tested signup/login locally
- [ ] Google OAuth configured (optional)
- [ ] Deployed to Vercel
- [ ] Tested signup/login in production

---

**Your app now uses Neon Auth for all authentication! 🎉**

