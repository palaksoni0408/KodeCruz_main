# KodesCruz Deployment Guide

This project is configured for a split deployment:
1.  **Backend (FastAPI)** on **Render**
2.  **Frontend (React/Vite)** on **Vercel**

---

## 1. Backend Deployment (Render)

We have included a `render.yaml` file which defines the infrastructure as code.

### Option A: Blueprints (Recommended)
1.  Push your code to GitHub.
2.  Go to the [Render Dashboard](https://dashboard.render.com/).
3.  Click **New +** -> **Blueprint**.
4.  Connect your repository.
5.  Render will automatically detect `render.yaml` and prompt you to create:
    *   **dskodescruz-backend** (Web Service)
    *   **dskodescruz-db** (PostgreSQL Database)
6.  **Environment Variables**: You will need to click "Advanced" or manually add these in the dashboard if not prompted:
    *   `OPENAI_API_KEY`: Your OpenAI key.
    *   `GROQ_API_KEY`: Your Groq key.
    *   `ALLOWED_ORIGINS`: `https://YOUR-VERCEL-DOMAIN.vercel.app,http://localhost:5173` (Add your Vercel URL here once you have it).

### Option B: Manual Setup
1.  Create a **Web Service** on Render.
2.  **Build Command**: `pip install -r requirements.txt`
3.  **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4.  Add the Environment Variables listed above.
5.  Create a separate **PostgreSQL** database on Render and paste its `Internal Connection String` into the Web Service's `DATABASE_URL` environment variable.

---

## 2. Frontend Deployment (Vercel)

1.  Push your code to GitHub.
2.  Go to the [Vercel Dashboard](https://vercel.com/dashboard).
3.  **Add New Project** -> Import your repository.
4.  **Configure Project**:
    *   **Framework Preset**: Vite
    *   **Root Directory**: Click "Edit" and select `frontend`. **(Crucial)**
5.  **Environment Variables**:
    *   `VITE_API_URL`: The URL of your deployed Render backend (e.g., `https://kodescruz-backend.onrender.com`). **Do not add a trailing slash.**
6.  Click **Deploy**.

---

## 3. Post-Deployment Checks
1.  **CORS**: Once Vercel deploys, copy the domain (e.g., `https://kodescruz.vercel.app`). Go back to Render -> Environment Variables and update `ALLOWED_ORIGINS` to include this domain.
2.  **Health Check**: Visit `https://YOUR-RENDER-URL.onrender.com/health` to confirm the backend is up.
3.  **Frontend Connection**: Open your Vercel app. If it connects to the backend, the "Backend Disconnected" warning in the header should disappear.

## Notes
- **Local Development**:
    - Backend: `uvicorn main:app --reload`
    - Frontend: `npm run dev` (in `frontend/` directory)
- **Database**: The `render.yaml` automatically creates a database. Ensure your local `.env` has a valid `DATABASE_URL` if you want to run code locally that requires it.
