# 🚀 Daily Query Quota System - Deployment Guide

## Quick Summary

This document guides you through deploying the **production-ready daily query quota system** (20 queries/day per user) to your Vercel (frontend) + Render (backend) environment.

---

## ✅ What Has Been Implemented

### Backend (Python/FastAPI)
- ✅ **Robust Rate Limiting**: `check_rate_limit()` function enforces 20 queries/day
- ✅ **No Silent Failures**: Removed try/except fallback that was bypassing limits
- ✅ **Proper 429 Responses**: Returns structured JSON with quota details
- ✅ **Quota Status Endpoint**: `GET /quota/status` returns current usage
- ✅ **UserActivity Table Creation**: Automatically created on startup
- ✅ **UTC-Based Daily Reset**: Quota resets at midnight UTC

### Frontend (React/TypeScript)
- ✅ **QuotaContext**: Global state management for quota
- ✅ **QuotaDisplay**: Badge in header showing "X/20 queries left"
- ✅ **QuotaExhaustedModal**: Professional modal when quota is exhausted
- ✅ **429 Error Handling**: API service detects and handles quota errors
- ✅ **Multi-Tab Sync**: Quota updates across browser tabs via localStorage
- ✅ **Auto-Refresh**: Quota status refreshes every minute

---

## 📋 Pre-Deployment Checklist

### 1. Verify Backend Changes

**Files Modified**:
- [x] `main.py` - Fixed `check_rate_limit()`, added `/quota/status`, table creation
- [x] `models.py` - UserActivity table (already existed)

**Verify Changes**:
```bash
# Check that check_rate_limit no longer has try/except fallback
grep -A 20 "async def check_rate_limit" main.py

# Should NOT see "except Exception" or "pass"
```

### 2. Verify Frontend Changes

**Files Created**:
- [x] `frontend/src/context/QuotaContext.tsx`
- [x] `frontend/src/components/QuotaDisplay.tsx`
- [x] `frontend/src/components/QuotaExhaustedModal.tsx`

**Files Modified**:
- [x] `frontend/src/services/api.ts` - Added QuotaExhaustedError, 429 handling
- [x] `frontend/src/App.tsx` - Wrapped with QuotaProvider, added modal
- [x] `frontend/src/components/layout/Header.tsx` - Added QuotaDisplay

---

## 🚀 Deployment Steps

### Step 1: Backend Deployment (Render)

#### A. Ensure Database is PostgreSQL

Your DATABASE_URL on Render **MUST** be PostgreSQL (not SQLite):

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

#### B. Push Code to GitHub

```bash
cd /Users/kunalkumargupta/Desktop/kodescru-xxx-main
git add .
git commit -m "Implement production-ready daily query quota system (20/day)"
git push origin main
```

#### C. Render Auto-Deploys

Render will automatically deploy your backend. Monitor the logs:

1. Go to https://dashboard.render.com
2. Select your service
3. Click "Logs"
4. Wait for "Application startup complete"

#### D. Verify Table Creation

Check logs for:
```
INFO: UserActivity table created successfully
```

If you don't see this, the table may already exist (which is fine).

---

### Step 2: Frontend Deployment (Vercel)

#### A. Set Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Ensure you have:
```env
VITE_API_URL=https://your-backend.onrender.com
```

(Your existing value is fine, just verify it's correct)

#### B. Deploy

Vercel auto-deploys from GitHub. Just push:

```bash
git push origin main
```

Or manually trigger from Vercel Dashboard → Deployments → Redeploy

---

### Step 3: Verification

#### Test Backend (Render)

**Test 1: Health Check**
```bash
curl https://your-backend.onrender.com/health
```
Expected: `{"status": "ok", ...}`

**Test 2: Quota Status** (requires auth token)
```bash
TOKEN="your-jwt-token"
curl -H "Authorization: Bearer $TOKEN" \
  https://your-backend.onrender.com/quota/status
```

Expected:
```json
{
  "success": true,
  "quota_used": 0,
  "quota_limit": 20,
  "quota_remaining": 20,
  "reset_at": "2025-11-30T00:00:00.000Z",
  "is_exhausted": false
}
```

#### Test Frontend (Vercel)

1. **Open your app**: `https://your-app.vercel.app`
2. **Sign in** as a user
3. **Check header**: Should see "20/20 queries left" badge
4. **Make a query**: Pick any feature (Explain Code, Debug, etc.)
5. **Submit**: Query should work
6. **Check header**: Should see "19/20 queries left"

#### Test Quota Exhaustion

**Option A: Make 20 queries manually** (tedious)

**Option B: Direct database test**

Connect to your Render PostgreSQL and insert 20 dummy activities:

```sql
-- Get user ID
SELECT id FROM users WHERE email = 'test@example.com';

-- Insert 20 activities for today
INSERT INTO user_activities (id, user_id, feature, timestamp)
SELECT 
  gen_random_uuid(),
  '<user-id-from-above>',
  'test',
  NOW()
FROM generate_series(1, 20);
```

Then try to make a request from the frontend:

- Should show:  "0/20 queries left" in header
- Should see: "Daily quota exhausted" modal
- Request should fail with 429 error

---

## 🔒 Security & Bypass Prevention

### How Quota is Enforced

| Bypass Attempt | Prevention |
|----------------|-----------|
| Modified frontend JS | Backend still enforces 20/day limit |
| Direct API calls (curl) | Requires valid JWT + still limited |
| Multiple browser tabs | Quota shared per user across all tabs |
| Page refresh | Quota persists in database |
| Logout/login | Same user ID = same quota |
| New account | Each user gets separate 20/day quota |

### Daily Reset

- Quota resets at **00:00 UTC** (midnight UTC)
- Based on `timestamp >= today` filter in SQL
- No cron job needed - automatic per request

---

## 🐛 Troubleshooting

### Issue: UserActivity table doesn't exist

**Symptom**: Backend throws `OperationalError: no such table: user_activities`

**Solution**:
```python
# In main.py, ensure this runs on startup:
from database import engine as old_engine
import models as old_models
old_models.Base.metadata.create_all(bind=old_engine)
```

This should already be in place at lines ~71-73 of main.py.

---

### Issue: Quota always shows 20/20

**Possible Causes**:
1. Activities not being logged
2. Different user ID between token and database

**Debug**:
```sql
-- Check if activities are being logged
SELECT * FROM user_activities 
WHERE user_id = '<your-user-id>' 
ORDER BY timestamp DESC 
LIMIT 10;
```

If empty, activities aren't logging. Check `/activity/log` endpoint.

---

### Issue: 429 error but quota shows remaining queries

**Cause**: Frontend and backend out of sync

**Solution**: Refresh page (quota state will reload from backend)

---

### Issue: Quota doesn't reset at midnight

**Cause**: Timezone mismatch or server time incorrect

**Debug**:
```python
# In check_rate_limit, add logging:
import logging
logger.info(f"Today UTC: {today}, User activities: {count}")
```

Check Render logs to see what "today" value is being used.

---

## ⚙️ Configuration

### Change Daily Limit

To change from 20 to a different number:

**Backend** (`main.py`):
```python
# In check_rate_limit function (line ~276)
if count >= 20:  # Change this number

# In get_quota_status function (line ~323)
"quota_limit": 20,  # Change this number
"quota_remaining": max(0, 20 - count),  # Change this number
```

**Frontend** (`components/QuotaExhaustedModal.tsx`):
```typescript
// Line ~49
You've used all <span>20 queries</span>  // Update display text
```

### Environment-Based Limits

You can make it configurable:

**Backend**:
```python
DAILY_LIMIT = int(os.getenv("DAILY_QUERY_LIMIT", "20"))

if count >= DAILY_LIMIT:
    ...
```

**Render Environment**:
```env
DAILY_QUERY_LIMIT=50  # For premium users, etc.
```

---

## 📊 Monitoring

### Check Quota Usage (Database)

```sql
-- Today's activities per user
SELECT 
  u.email,
  COUNT(*) as queries_today
FROM user_activities ua
JOIN users u ON ua.user_id = u.id
WHERE ua.timestamp >= DATE_TRUNC('day', NOW())
GROUP BY u.email
ORDER BY queries_today DESC;
```

### Check Who Hit Limit

```sql
-- Users who hit the limit
SELECT 
  u.email,
  COUNT(*) as queries_today
FROM user_activities ua
JOIN users u ON ua.user_id = u.id
WHERE ua.timestamp >= DATE_TRUNC('day', NOW())
GROUP BY u.email
HAVING COUNT(*) >= 20;
```

---

## ✅ Final Checklist

Before going live:

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] PostgreSQL database connected (not SQLite)
- [ ] UserActivity table exists and indexed
- [ ] Quota status endpoint returns correct data
- [ ] Frontend shows quota badge in header
- [ ] 429 errors trigger quota modal
- [ ] Tested: Make 20 queries → 21st is blocked
- [ ] Tested: Page refresh maintains quota state
- [ ] Tested: Multi-tab quota sync works
- [ ] Checked Render logs for errors
- [ ] Checked Vercel deployment logs

---

## 🎯 Success Criteria

Your quota system is working correctly if:

✅ New users see "20/20 queries left"  
✅ After 1 query: "19/20 queries left"  
✅ After 20 queries: "0/20 queries left"  
✅ 21st query: Gets 429 error + modal appears  
✅ Page refresh: Quota persists correctly  
✅ Next day (UTC): Quota resets to "20/20"  
✅ Multiple tabs: All show same quota  
✅ Direct API calls: Also blocked at 20 queries  

---

## 📞 Support

If you encounter issues:

1. **Check Render logs**: Dashboard → Your Service → Logs
2. **Check Vercel logs**: Dashboard → Deployments → View Function Logs
3. **Check Browser Console**: F12 → Console tab
4. **Check Network Tab**: F12 → Network → Filter for 429 status

---

**Quota system is production-ready! 🚀**
