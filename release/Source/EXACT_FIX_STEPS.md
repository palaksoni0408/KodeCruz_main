# ✅ Exact Fix Steps for Your Deployment

## Your URLs
- **Backend**: `https://kodescrux.onrender.com` ✅ (Running)
- **Frontend**: `https://kodes-cru.vercel.app/` ✅ (Deployed)

---

## Step 1: Set Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (kodes-cru)
3. Go to **Settings** → **Environment Variables**
4. Add/Update these variables:

   **Variable 1:**
   ```
   Name: VITE_API_URL
   Value: https://kodescrux.onrender.com
   Environment: Production, Preview, Development (select all)
   ```
   ⚠️ **Important**: No trailing slash!

   **Variable 2 (Optional - auto-detects if not set):**
   ```
   Name: VITE_WS_URL
   Value: wss://kodescrux.onrender.com
   Environment: Production, Preview, Development (select all)
   ```

5. Click **Save** for each variable

6. **Redeploy**:
   - Go to **Deployments** tab
   - Click **⋮** (three dots) on the latest deployment
   - Click **Redeploy**
   - Wait 1-2 minutes

---

## Step 2: Update CORS in Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Open your service: `kodescrux`
3. Go to **Environment** tab
4. Find `ALLOWED_ORIGINS` variable
5. Set the value to:
   ```
   https://kodes-cru.vercel.app
   ```
   ⚠️ **Important**: 
   - No trailing slash
   - No `http://` (must be `https://`)
   - Just the domain: `https://kodes-cru.vercel.app`

6. Click **Save Changes**
   - Render will automatically redeploy (wait 2-3 minutes)

---

## Step 3: Verify Everything Works

### Test Backend:
Visit these URLs in your browser:

```
https://kodescrux.onrender.com/health
```

**Expected Response:**
```json
{"status": "ok", "llm": "..."}
```

**Note**: First request after hibernation may take 30-60 seconds (Render free tier)

### Test Frontend:
1. Visit: `https://kodes-cru.vercel.app/`
2. Open Browser Console (F12)
3. Check for errors:
   - ❌ **Should NOT see**: "Cannot connect to backend server"
   - ✅ **Should see**: Backend connection successful (or no connection errors)
4. Try a feature:
   - Click any feature (e.g., "Explain Code")
   - If it works → ✅ Everything is connected!

---

## Common Issues & Solutions

### Issue: Frontend still shows connection error
**Solution:**
- Verify `VITE_API_URL` is set in Vercel (check spelling)
- Make sure you redeployed Vercel after adding the variable
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: CORS error in browser console
**Solution:**
- Verify `ALLOWED_ORIGINS` in Render is exactly: `https://kodes-cru.vercel.app`
- No trailing slash, no `http://`
- Wait for Render to finish redeploying (check Render logs)

### Issue: 503 Service Unavailable
**Solution:**
- This is normal for Render free tier (service hibernates after 15 min inactivity)
- First request wakes it up (takes 30-60 seconds)
- Wait and try again

---

## Quick Verification Checklist

- [ ] `VITE_API_URL=https://kodescrux.onrender.com` set in Vercel
- [ ] Vercel frontend redeployed after adding variable
- [ ] `ALLOWED_ORIGINS=https://kodes-cru.vercel.app` set in Render
- [ ] Render service redeployed after updating CORS
- [ ] Backend `/health` endpoint returns 200 OK
- [ ] Frontend loads without connection errors
- [ ] Can use features (code explanation, etc.)

---

## Test Commands

```bash
# Test backend health
curl https://kodescrux.onrender.com/health

# Test wake endpoint
curl https://kodescrux.onrender.com/wake
```

Both should return JSON responses after the cold start delay.

---

**After completing these steps, your frontend and backend should be fully connected!** 🎉

