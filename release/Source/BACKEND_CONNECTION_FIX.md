# 🔧 Backend Connection Fix Guide

## Problem
Frontend cannot connect to backend at `https://kodescrux.onrender.com` (503 error)

## Quick Fix Steps

### 1️⃣ Verify Backend is Running on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Open your backend service (`kodescrux`)
3. Check the **Logs** tab:
   - Look for errors during startup
   - Verify the service started successfully
   - Check if it shows "Uvicorn running on..."

4. Check **Events** tab:
   - Ensure recent deployment completed successfully
   - If deployment failed, check the error message

### 2️⃣ Verify Environment Variables in Render

1. In Render Dashboard → Your Service → **Environment**
2. Verify these are set:
   ```
   OPENAI_API_KEY=sk-... (your new API key)
   ALLOWED_ORIGINS=https://your-vercel-frontend.vercel.app
   ```
   ⚠️ **Important**: Replace `your-vercel-frontend.vercel.app` with your actual Vercel URL

3. If you changed `OPENAI_API_KEY`:
   - Render should auto-redeploy
   - Wait 1-2 minutes for deployment to complete
   - Check the **Logs** tab to see deployment progress

### 3️⃣ Manual Redeploy (if needed)

If the service didn't redeploy automatically:

1. In Render Dashboard → Your Service
2. Click **Manual Deploy** → **Deploy latest commit**
3. Wait 2-3 minutes for deployment
4. Check logs for startup success

### 4️⃣ Test Backend is Accessible

Try these URLs in your browser:

```
https://kodescrux.onrender.com/health
https://kodescrux.onrender.com/wake
```

**Expected Response:**
```json
{"status": "ok", "llm": "..."}
```

**If you get 503:**
- Service is hibernated (Render free tier)
- First request will wake it up (takes 30-60 seconds)
- Try again after waiting

### 5️⃣ Set Frontend Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your frontend project
3. Go to **Settings** → **Environment Variables**
4. Add/Update these variables:

   ```
   VITE_API_URL=https://kodescrux.onrender.com
   VITE_WS_URL=wss://kodescrux.onrender.com
   ```

   ⚠️ **Important**: 
   - No trailing slashes
   - Use `https://` not `http://`
   - Use `wss://` for WebSocket (secure)

5. **Redeploy** your Vercel frontend:
   - Go to **Deployments** tab
   - Click **⋮** (three dots) on latest deployment
   - Click **Redeploy**
   - Wait 1-2 minutes

### 6️⃣ Verify CORS Configuration

1. In Render → Your Service → Environment
2. Set `ALLOWED_ORIGINS` to include your Vercel URL:
   ```
   https://your-frontend-name.vercel.app
   ```
   (Get your Vercel URL from Vercel Dashboard → Project → Settings → Domains)

3. Save and wait for redeploy

## Common Issues

### ❌ 503 Error (Service Unavailable)
- **Cause**: Service is hibernated (Render free tier)
- **Fix**: Wait 30-60 seconds after first request, or wake it up manually

### ❌ CORS Error in Browser Console
- **Cause**: Frontend URL not in `ALLOWED_ORIGINS`
- **Fix**: Add your Vercel URL to Render's `ALLOWED_ORIGINS` environment variable

### ❌ Connection Refused / Network Error
- **Cause**: `VITE_API_URL` not set in Vercel
- **Fix**: Set `VITE_API_URL=https://kodescrux.onrender.com` in Vercel

### ❌ Invalid API Key Error
- **Cause**: API key not set correctly in Render
- **Fix**: 
  1. Double-check `OPENAI_API_KEY` in Render
  2. Ensure no extra spaces or quotes
  3. Trigger manual redeploy

## Verification Checklist

- [ ] Backend is running in Render (check logs)
- [ ] `OPENAI_API_KEY` is set in Render environment variables
- [ ] `ALLOWED_ORIGINS` includes your Vercel frontend URL
- [ ] `VITE_API_URL` is set in Vercel environment variables
- [ ] `VITE_WS_URL` is set in Vercel (optional, auto-detects from API_URL)
- [ ] Both services have been redeployed after changes
- [ ] Backend `/health` endpoint returns 200 OK
- [ ] Frontend can connect (no CORS errors in browser console)

## Test Commands

```bash
# Test backend health
curl https://kodescrux.onrender.com/health

# Test wake endpoint
curl https://kodescrux.onrender.com/wake
```

After fixing, your frontend should connect! 🎉

