# OAuth Setup Guide for Deployment

This guide explains how to set up Google and GitHub authentication for your deployed application.

## Prerequisites
- **Backend URL**: Your Render backend URL (e.g., `https://kodescruxx-qcaf.onrender.com`).
- **Frontend URL**: Your Vercel frontend URL (e.g., `https://kodes-cruxx-ten.vercel.app`).

---

## 1. Google OAuth Setup

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project (or select an existing one).
3.  Navigate to **APIs & Services** > **Credentials**.
4.  Click **Create Credentials** > **OAuth client ID**.
5.  **Application Type**: Web application.
6.  **Name**: `KodesCruz` (or your app name).
7.  **Authorized JavaScript origins**:
    *   Add your Vercel Frontend URL: `https://kodes-cruxx-ten.vercel.app` (no trailing slash).
    *   Add your Render Backend URL: `https://kodescruxx-qcaf.onrender.com` (no trailing slash).
8.  **Authorized redirect URIs**:
    *   Add the backend callback URL: `https://kodescruxx-qcaf.onrender.com/auth/google/callback`
9.  Click **Create**.
10. Copy the **Client ID** and **Client Secret**.

---

## 2. GitHub OAuth Setup

1.  Go to [GitHub Developer Settings](https://github.com/settings/developers).
2.  Click **New OAuth App**.
3.  **Application Name**: `KodesCruz`.
4.  **Homepage URL**: Your Vercel Frontend URL (`https://kodes-cruxx-ten.vercel.app`).
5.  **Authorization callback URL**:
    *   Add the backend callback URL: `https://kodescruxx-qcaf.onrender.com/auth/github/callback`
6.  Click **Register application**.
7.  Copy the **Client ID**.
8.  Generate a new **Client Secret** and copy it.

---

## 3. Configure Render Environment Variables

1.  Go to your **Render Dashboard** > **kodescruxx-backend** > **Environment**.
2.  Add the following variables:

| Key | Value |
| :--- | :--- |
| `GOOGLE_CLIENT_ID` | (Paste your Google Client ID) |
| `GOOGLE_CLIENT_SECRET` | (Paste your Google Client Secret) |
| `GITHUB_CLIENT_ID` | (Paste your GitHub Client ID) |
| `GITHUB_CLIENT_SECRET` | (Paste your GitHub Client Secret) |

3.  Click **Save Changes**. Render will automatically redeploy your backend.

---

## 4. Important Note on Redirects

Currently, your backend returns the authentication token as a JSON response after a successful login.
- When a user clicks "Login with Google", they will be redirected to Google, then back to your backend.
- They will see a JSON response in their browser window containing the `access_token`.
- **For a seamless experience**: You would typically update the backend (`app/auth/router.py`) to redirect the user *back* to your frontend with the token in the URL (e.g., `https://kodescruxx.vercel.app/auth/callback?token=...`).
