# Setting Up Authentication

To enable Google and GitHub Sign-In, you need to configure the OAuth credentials in your `.env` file.

## 1. Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services** > **Credentials**.
4. Click **Create Credentials** > **OAuth client ID**.
5. Select **Web application**.
6. Set the **Authorized redirect URIs** to:
   - `http://localhost:8000/auth/google/callback`
7. Copy the **Client ID** and **Client Secret**.
8. Add them to your `.env` file:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## 2. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers).
2. Click **New OAuth App**.
3. Set the **Authorization callback URL** to:
   - `http://localhost:8000/auth/github/callback`
4. Register the application.
5. Copy the **Client ID** and generate a new **Client Secret**.
6. Add them to your `.env` file:

```env
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

## 3. Restart the Backend

After updating the `.env` file, restart your backend server for the changes to take effect:

```bash
# In the terminal running uvicorn
Ctrl+C
uvicorn main:app --reload
```
