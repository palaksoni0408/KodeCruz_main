# 🚀 Deployment Quick Start Guide

## 1. Backend (Render) Configuration

Go to your Render Dashboard -> Select your Backend Service -> **Environment**

Add these Environment Variables:

| Key | Value | Description |
|-----|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | Your Render PostgreSQL Internal URL |
| `SECRET_KEY` | `your-secure-secret-key` | Generate a random string |
| `ALLOWED_ORIGINS` | `https://your-frontend-app.vercel.app` | **CRITICAL**: Your Vercel Frontend URL |
| `OPENAI_API_KEY` | `sk-...` | Your OpenAI Key |

> **Note**: For `ALLOWED_ORIGINS`, if you have multiple URLs (e.g. staging), separate them with commas: `https://app.com,https://staging.app.com`

## 2. Frontend (Vercel) Configuration

Go to your Vercel Dashboard -> Select your Project -> **Settings** -> **Environment Variables**

Add this Environment Variable:

| Key | Value | Description |
|-----|-------|-------------|
| `VITE_API_URL` | `https://your-backend-app.onrender.com` | **CRITICAL**: Your Render Backend URL |

> **Important**: Do NOT add a trailing slash `/` at the end of the URL.
> ✅ Correct: `https://api.render.com`
> ❌ Incorrect: `https://api.render.com/`

## 3. Verification Steps

After redeploying both:

1.  Open your Vercel App URL.
2.  Open Chrome Developer Tools (F12) -> **Network** tab.
3.  Try to **Login**.
4.  Look for the login request.
    *   **Request URL** should start with `https://your-backend-app.onrender.com/...`
    *   **Status** should be `200` (OK).

### Troubleshooting "Failed to Fetch"

If you still see "Failed to Fetch" in production:

1.  **Check VITE_API_URL**: Ensure it matches your Render URL exactly.
2.  **Check ALLOWED_ORIGINS**: Ensure your Vercel URL is listed in Render env vars.
3.  **Check Protocol**: Ensure both are using `https://`.
