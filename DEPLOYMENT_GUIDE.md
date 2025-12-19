# Deployment Guide

This guide explains how to deploy the **Backend to Render** and the **Frontend to Vercel**, and how to connect them.

# Deployment Guide: KodesCruz

This guide details how to deploy the KodesCruz application to **Render** (Backend) and **Vercel** (Frontend).

## Prerequisites

1.  **GitHub Account**: Ensure your project is pushed to a GitHub repository.
2.  **Render Account**: Sign up at [render.com](https://render.com).
3.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).

---

## Part 1: Backend Deployment (Render)

We will use Render to host the FastAPI backend.

1.  **Create a New Web Service**:
    *   Go to your Render Dashboard.
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository.

2.  **Configure the Service** (Fill in the form exactly as below):
    *   **Name**: `kodescruxx-backend`
    *   **Region**: Oregon (US West) (or your preference)
    *   **Branch**: `main`
    *   **Root Directory**: (Leave blank)
    *   **Runtime**: `Python 3`
    *   **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
    *   **Start Command**: `gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
        *   **IMPORTANT**: Do NOT use the default `gunicorn app:app`. You must copy the command above exactly.
    *   **Instance Type**: Free

3.  **Environment Variables**:
    *   Scroll down to **Environment Variables** and click **Add Environment Variable** for each of these:

    | Key | Value |
    | :--- | :--- |
    | `PYTHON_VERSION` | `3.9.0` |
    | `SECRET_KEY` | (Enter a random string, e.g., `mysecretkey123`) |
    | `OPENAI_API_KEY` | (Enter your OpenAI API Key) |
    | `ALLOWED_ORIGINS` | `https://kodes-cruxx-ten.vercel.app` |
    | `DATABASE_URL` | `sqlite:///./kodescruxx.db` |

4.  **Deploy**:
    *   Click **Create Web Service**.
8.  **Copy the Backend URL**: Once deployed, copy the URL (e.g., `https://kodescruxx-qcaf.onrender.com`).

## 2. Deploy Frontend to Vercel

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** > **Project**.
3.  Import your GitHub repository.
4.  **Configure the Project**:
    *   **Framework Preset**: `Vite`
    *   **Root Directory**: `frontend` (Important! Click "Edit" and select the `frontend` folder).
5.  **Environment Variables**:
    *   `VITE_API_URL`: Paste your Render Backend URL (e.g., `https://kodescruxx-qcaf.onrender.com`). **Do not add a trailing slash**.
6.  Click **Deploy**.
7.  **Copy the Frontend URL**: Once deployed, copy the URL (e.g., `https://kodescruxx.vercel.app`).

## 3. Connect & Finalize

1.  **Update Backend CORS**:
    *   Go back to Render > Environment.
    *   Update `ALLOWED_ORIGINS` to your Vercel Frontend URL (e.g., `https://kodes-cruxx-ten.vercel.app`).
    *   Save changes (Render will redeploy).

2.  **Update OAuth Redirect URIs**:
    *   **Google Cloud Console**: Add `https://kodescruxx-qcaf.onrender.com/auth/google/callback` to "Authorized redirect URIs".
    *   **GitHub Developer Settings**: Update "Authorization callback URL" to `https://kodescruxx-qcaf.onrender.com/auth/github/callback`.

## 4. Verify

1.  Open your Vercel URL.
2.  Try to Sign Up / Log In.
3.  Check if the API requests are going to the Render URL (Network tab).
