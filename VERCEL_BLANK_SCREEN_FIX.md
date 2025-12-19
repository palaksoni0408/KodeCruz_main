# ✅ Fix Vercel Blank Screen - Missing Environment Variables

## 🔴 Problem
Your Vercel deployment shows a **blank screen** because the Stack Auth (Neon Auth SDK) environment variables are not configured in Vercel.

## 📋 Quick Fix Steps

### Step 1: Get Your Stack Auth Credentials

You should already have these from your Neon setup. If not:

1. Go to [Neon Console](https://console.neon.tech/)
2. Select your **KodesCruz** project
3. Navigate to **Auth** section
4. Copy these values:
   - **Project ID**
   - **Publishable Client Key**

### Step 2: Add Environment Variables to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **KodesCruz** project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_STACK_PROJECT_ID` | Your Stack Auth Project ID | Production, Preview, Development |
| `VITE_STACK_PUBLISHABLE_CLIENT_KEY` | Your Stack Auth Publishable Key | Production, Preview, Development |
| `VITE_API_URL` | `https://kodescruxx-backend-gnlc.onrender.com` | Production, Preview, Development |
| `VITE_WS_URL` | `wss://kodescruxx-backend-gnlc.onrender.com` | Production, Preview, Development |
| `VITE_ASSET_BASE_URL` | `https://kodescruxx-backend-gnlc.onrender.com` | Production, Preview, Development |

**IMPORTANT**: Make sure to select **all three environments** (Production, Preview, Development) when adding each variable!

### Step 3: Redeploy

After adding the environment variables:

1. Go to **Deployments** tab
2. Click on your latest deployment
3. Click the **⋯** (three dots) menu
4. Select **Redeploy**
5. Wait for the deployment to complete

### Step 4: Verify

1. Visit your Vercel URL: https://kodes-cruxx-ten.vercel.app
2. You should now see the landing page instead of a blank screen
3. Test the login flow by clicking "Get Started" or "Log In"

---

## 🔍 Why This Happened

Your app uses **Stack Auth** (Neon's authentication SDK) which requires:
- `VITE_STACK_PROJECT_ID` - To identify your Neon Auth project
- `VITE_STACK_PUBLISHABLE_CLIENT_KEY` - To authenticate API requests

Without these environment variables:
- The Stack Auth SDK fails to initialize
- React throws an error during render
- Result: **Blank screen** (white screen of death)

The build succeeded (as shown in your logs), but the app crashes at runtime when it tries to use Stack Auth.

---

## 🛠️ Alternative: Check Browser Console

If you want to confirm this is the issue:

1. Open your Vercel site: https://kodes-cruxx-ten.vercel.app
2. Open browser DevTools (F12 or Right-click → Inspect)
3. Go to **Console** tab
4. You should see errors like:
   - `StackClientApp: projectId is required`
   - `Cannot read properties of undefined`
   - Stack Auth initialization errors

---

## 📝 Local Development

For local development, create `frontend/.env.local`:

```bash
VITE_STACK_PROJECT_ID=your-stack-project-id
VITE_STACK_PUBLISHABLE_CLIENT_KEY=your-stack-publishable-key
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_ASSET_BASE_URL=http://localhost:8000
```

**Never commit this file to Git!** (It's already in `.gitignore`)

---

## ✅ Checklist

- [ ] Get Stack Auth credentials from Neon Console
- [ ] Add `VITE_STACK_PROJECT_ID` to Vercel
- [ ] Add `VITE_STACK_PUBLISHABLE_CLIENT_KEY` to Vercel
- [ ] Add `VITE_API_URL` to Vercel
- [ ] Add `VITE_WS_URL` to Vercel
- [ ] Add `VITE_ASSET_BASE_URL` to Vercel
- [ ] Verify all variables are set for Production, Preview, AND Development
- [ ] Redeploy on Vercel
- [ ] Test the deployed site
- [ ] Verify login/signup flow works

---

**That's it!** Your app should now work perfectly on Vercel. 🎉
